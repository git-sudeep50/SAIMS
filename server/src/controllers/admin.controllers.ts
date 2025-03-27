import { Request, Response, RequestHandler } from "express";
import { prisma } from "../db/postgres/prismaClient";
import { sendMailMessage } from "./mail.controller";


export const createStudent: RequestHandler = async (req:Request, res:Response) => {
    try {
        const { rollNo } = req.body;
        const email = rollNo.toLowerCase() + "@tezu.ac.in";

        const existingUser = await prisma.authentication.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ msg: "Student account already exists" });
            return;
        }

        //transaction to rollback if email fails
        await prisma.$transaction(async (tx) => {
            const newUser = await tx.authentication.create({ data: { email } });

            // Send email (throws error if fails, so account won't be created)
            await sendMailMessage(email, `Your account was created with roll number ${rollNo.toUpperCase()}.`);
        });

        res.status(201).json({ msg: "Student account created successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: "Failed to create student account. Please try again." });
    }
};
