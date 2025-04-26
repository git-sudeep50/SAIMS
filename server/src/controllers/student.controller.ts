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

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { enrollmentNumber: rollNumber },
    });

    if (existingStudent) {
      res.status(400).json({
        message: `Student already exists with the enrollment number ${rollNumber}`,
      });
      return;
    }

    // Fetch department, programme, and semester in a single query
    const programmeInfo = await prisma.programme.findFirst({
      where: {
        name: programme,
        department: { name: deptName },
      },
      include: {
        department: true, // Fetch related department info
        semesters: {
          where: { name: semester },
          select: { semesterNo: true },
        },
      },
    });

    console.log(programmeInfo);

    if (!programmeInfo) {
      res
        .status(404)
        .json({
          message: `Programme '${programme}' not found under department '${deptName}'`,
        });
      return;
    }

    // Get department ID
    const departmentId = programmeInfo.department.id;

    // Get semester ID (validate if semester exists)
    const semesterInfo = programmeInfo.semesters[0];
    if (!semesterInfo) {
      res
        .status(404)
        .json({
          message: `Semester '${semester}' not found in programme '${programme}'`,
        });
      return;
    }

    // Create student entry
    const dobDate = new Date(dob);
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        phoneNumber,
        dob: dobDate,
        address,
        gender,
        enrollmentNumber: rollNumber,
        enrollmentYear,
        programme: { connect: { id: programmeInfo.id } },
        department: { connect: { id: departmentId } },
        currentSemester: {
          connect: {
            semesterNo_programmeId: {
              semesterNo: semester,
              programmeId: programmeInfo.id,
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Student data entered successfully",
      data: newStudent,
    });
  } catch (err: any) {
    console.error("Error adding student:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

