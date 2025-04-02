import { Request, Response, RequestHandler } from "express";
import { prisma } from "../../db/postgres/prismaClient";
import otpGenerator from "otp-generator";
import { redisClient } from "../../index";
import { sendMailOTP } from "../mail.controller";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const checkUserAccount = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await prisma.authentication.findUnique({
      where: {
        email: email,
      },
    });

    if (!result) {
      res.status(404).json({
        msg: "No Advisor access found on this email",
      });
    }
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await redisClient.setEx(`otp:${email}`, 600, OTP);
    await sendMailOTP(email, OTP);

    res.status(200).json({
      msg: "OTP sent successfully to your email",
    });
  } catch (error: any) {
    res.status(500).json({
      msg: "Some error occurred",
      error: error.message,
    });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, OTP, password } = req.body;

  if (!email || !password || !OTP) {
    res.status(400).json({
      msg: "All fields are required",
    });
    return;
  }
  const redisOTP = await redisClient.get(`otp:${email}`);

  if (OTP !== redisOTP) {
    res.status(401).json({
      msg: "Invalid OTP",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.authentication.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    redisClient.del(`otp:${email}`);
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({
      msg: "Some error occurred",
      error: error.message,
    });
    return;
  }
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      msg: "email or password missing",
    });
    return;
  }

  try {
    const result = await prisma.authentication.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        password: true, 
        roles: true,
      }
    });
    if (!result) {
      res.status(404).json({ msg: "No student account found on this email" });
      return;
    }

    if (!result.password) {
      res.status(400).json({ msg: "Password not set for this account" });
      return;
    }

    const isMatch = await bcrypt.compare(password, result.password);

    if (!isMatch) {
      res.status(401).json({ msg: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: result.id, email: result.email,roles: result.roles.map(r => r.role ) },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err: any) {
    res.status(500).json({ msg: "Some error occurred", error: err.message });
    return;
  }
};

export const logoutUser: RequestHandler = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};