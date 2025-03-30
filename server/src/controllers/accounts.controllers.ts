import { Request, Response, RequestHandler } from "express";
import { prisma } from "../db/postgres/prismaClient";
import { sendMailMessage } from "./mail.controller";
import { Role } from "@prisma/client";

export const createStudent: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { rollNo, email } = req.body;

    const defaultEmail = rollNo ? `${rollNo.toLowerCase()}@tezu.ac.in` : email;

    const existingUser = await prisma.authentication.findUnique({
      where: { email: defaultEmail },
    });
    if (existingUser) {
      res.status(400).json({ msg: "Student account already exists" });
      return;
    }

    //transaction to rollback if email fails
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.authentication.create({
        data: { email: defaultEmail },
      });

      await tx.roleAssignment.create({
        data: {
          userId: newUser.id, // Associate with the newly created user
          role: "STUDENT",
        },
      });

      // Send email (throws error if fails, so account won't be created)
      await sendMailMessage(
        defaultEmail,
        `Your account was created with email ${defaultEmail}.`
      );
    });

    res.status(201).json({ msg: "Student account created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "Failed to create student account. Please try again." });
  }
};

export const createEmployee = (role: Role) => {
  return async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const existingUser = await prisma.authentication.findUnique({
        where: { email: email },
        include: { roles: true },
      });
      if (existingUser) {
        const hasRole = existingUser.roles.some(r => r.role === role);
        if (hasRole) {
            res.status(400).json({ msg: `User already has the ${role} role` });
            return;
        }
            //promote the user to new role
            await prisma.roleAssignment.create({
                data: {
                    userId: existingUser.id,
                    role: role,
                }
            });

            await sendMailMessage(
                email,
                `You are assigned as ${role}.`
              );

            res.status(200).json({ msg: `Role ${role} assigned successfully` });
            return;
      }

      //transaction to rollback if email fails
      await prisma.$transaction(async (tx) => {
        const newUser = await tx.authentication.create({
          data: { email: email },
        });

        await tx.roleAssignment.create({
          data: {
            userId: newUser.id, // Associate with the newly created user
            role: role,
          },
        });

        // Send email (throws error if fails, so account won't be created)
        await sendMailMessage(
          email,
          `You are assigned as course ${role}. You can now signup with ${email}.`
        );
      });

      res.status(201).json({ msg: `${role} account created successfully` });
      return;
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ msg: `Failed to create ${role} account. Please try again.` });
    }
  };
};
