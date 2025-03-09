import {Request, Response,RequestHandler} from "express";
import { prisma } from "../../db/postgres/prismaClient";
import otpGenerator from "otp-generator";
import { redisClient } from "../../index";
import { sendMail } from "../mail.controller";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const checkAdmin:RequestHandler = async (req:Request, res:Response) => {
  const { email } = req.body;
  try {
    const result = await prisma.authentication.findUnique({
      where: {
        email: email,
      },
    });
    if (!result) {
      res.status(404).json({
        msg: "No Admin access found on this email",
      });
    }
    const OTP = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
    });


    await redisClient.setEx(`otp:${email}`, 600, OTP);
    await sendMail(email, OTP);

    res.status(200).json({
      msg: "OTP sent successfully to your email",
    });
  } catch (err: any) {
    res.status(500).json({
      msg: "Some error occurred",
      error: err.message,
    });
  }
}

export const registerAdmin:RequestHandler = async (req:Request, res:Response) => {
  const {email, OTP, password} = req.body;
  if (!email || !OTP) {
    res.status(400).json({ msg: "Email and OTP required" });
    return;
  }
  const redisOTP = await redisClient.get(`otp:${email}`);

  if(OTP !== redisOTP){
    res.status(401).json({ msg: "Invalid OTP" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.authentication.update({
      where: { email: email },
      data: { password: hashedPassword }
    });

    redisClient.del(`otp:${email}`);
    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (err: any) {
    res.status(500).json({ msg: "Some error occurred", error: err.message });
    return;
  }
}

export const loginAdmin:RequestHandler = async (req:Request, res:Response) => {
  const {email, password} = req.body;
  if (!email ||!password) {
    res.status(400).json({ msg: "Email and password required" });
    return;
  }
  try {
    const result = await prisma.authentication.findUnique({
      where: { email: email },
    });
    if (!result) {
      res.status(404).json({ msg: "No admin found on this email" });
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
      { id: result.id, email: result.email },
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

  }catch (err:any) {
    res.status(500).json({ msg: "Some error occurred", error: err.message });
    return;
  }
}