import { Request, Response } from "express";
import { prisma } from "../db/postgres/prismaClient";

export const addStudentData = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      dob,
      address,
      gender,
      rollNumber,
      enrollmentYear,
      programme,
      deptName,
      semester,
    }: {
      name: string;
      email: string;
      phoneNumber: string;
      dob: Date;
      address: string;
      gender: string;
      rollNumber: string;
      enrollmentYear: number;
      programme: string;
      deptName: string;
      semester: number;
    } = req.body;
    const existingStudent = await prisma.student.findUnique({
      where: {
        enrollmentNumber: rollNumber,
      },
    });

    if (existingStudent) {
      res.status(400).json({
        message: `Student already exists with the enrollment number ${rollNumber}`,
      });
      return;
    }

    const deptInfo = await prisma.department.findFirst({
        where: {
          name: deptName,
        },
      });
  
      if (!deptInfo) {
        res.status(404).json({ message: `Department ${deptName} not found` });
        return;
      }

    const programmeInfo = await prisma.programme.findFirst({
      where: {
        name: programme,
        department: { id: deptInfo.id },
      },
    });

    if (!programmeInfo) {
      res.status(404).json({ message: `Programme ${programme} not found` });
      return;
    }

    const semesterInfo = await prisma.semester.findFirst({
      where: {
        name: semester,
        programmeId: programmeInfo.id,
      },
    });

    const dobDate = new Date(dob);


    const newStudent = await prisma.student.create({
      data: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        dob: dobDate,
        address: address,
        gender: gender,
        enrollmentNumber: rollNumber,
        enrollmentYear: enrollmentYear,
        programme: { connect: { id: programmeInfo?.id } },
        department: { connect: { id: deptInfo?.id } },
        currentSemester: { connect: { id: semesterInfo?.id } },
      },
    });

    res.status(201).json({
      message: "Student data entered successfully",
      data: newStudent,
    });
  } catch (err: any) {
        res.status(500).json({
            msg: err.message,
        })
  }
};
