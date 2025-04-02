import { Request, Response, RequestHandler } from "express";
import { prisma } from "../db/postgres/prismaClient";

export const addEmployeeData = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, deptName } = req.body;

    const existingData = await prisma.employee.findUnique({
      where: { email: email },
    });

    if (existingData) {
      res.status(400).json({
        msg: "Employee data already exists",
      });
      return;
    }

    const deptInfo = await prisma.department.findFirst({
      where: {
        name: deptName,
      },
    });
    if (!deptInfo) {
      res.status(400).json({
        msg: `Department with name ${deptName} does not exist`,
      });
      return;
    }

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.employee.create({
        data: {
          name,
          email,
          phone,
          departmentId: deptInfo.id,
        },
      });

      await tx.authentication.update({
        where: { email },
        data: { employeeId: newUser.id },
      });

      return newUser;
    });

    res.status(201).json({
      msg: "Data Entered Successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({
      msg: err.message,
    });
  }
};
