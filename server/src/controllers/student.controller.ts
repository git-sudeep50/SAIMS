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
      res.status(404).json({
        message: `Programme '${programme}' not found under department '${deptName}'`,
      });
      return;
    }

    // Get department ID
    const departmentId = programmeInfo.department.id;

    // Get semester ID (validate if semester exists)
    const semesterInfo = programmeInfo.semesters[0];
    if (!semesterInfo) {
      res.status(404).json({
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

export const getStudentDataByRollNumber = async (
  req: Request,
  res: Response
) => {
  console.log("Admin Routes");
  const { rollNo } = req.params;
  if (!rollNo) {
    res.status(400).json({ message: "Roll number is required" });
    return;
  }
  try {
    const student = await prisma.student.findUnique({
      where: { enrollmentNumber: rollNo },
      include: {
        programme: {
          include: {
            department: true,
          },
        },
        currentSemester: true,
      },
    });
    res.status(200).json(student);
  } catch (error: any) {
    console.log(error); // Important to log full error
    res.status(500).json({
      message: "Some error occurred",
      error,
    });
  }
};

export const getStudentsBySemester = async (req: Request, res: Response) => {
  try {
    const { semester, programmeId } = req.query;

    if (!semester || !programmeId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const students = await prisma.$queryRaw`
      SELECT * FROM "Student"
      WHERE "programmeId" = ${programmeId}
        AND "currentSemesterNo" = ${Number(semester)}
    `;

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSemester = async (req: Request, res: Response) => {
  const { departmentId } = req.body;

  if (!departmentId) {
    return res.status(400).json({ message: "departmentId is required" });
  }

  try {
    await prisma.$executeRaw`
      UPDATE "Student"
      SET "currentSemesterNo" = "currentSemesterNo" + 1
      WHERE "departmentId" = ${departmentId}
    `;

    res.status(200).json({ message: `Semesters updated successfully for department ${departmentId}.` });
  } catch (error) {
    console.error("Error updating semesters:", error);
    res.status(500).json({ message: "Failed to update semesters." });
  }
};
