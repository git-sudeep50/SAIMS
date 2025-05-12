import { Request, Response, RequestHandler } from "express";
import { prisma } from "../db/postgres/prismaClient";

export const createCourse: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const {
    name,
    code,
    credits,
    description,
    department,
    L,
    T,
    P,
    courseType,
    programmeId,
    semester,
  } = req.body;
  console.log(req.body);

  const requiredFields = [
    name,
    code,
    credits,
    description,
    department,
    L,
    T,
    P,
    courseType,
    programmeId,
    semester,
  ];
  const missing = requiredFields.some((field) => field === undefined);

  if (missing) {
    console.log("All fields are required");
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try {
    console.log("Creating course");
    const existingCourse = await prisma.course.findFirst({
      where: {
        code: code,
        department: {
          is: {
            name: department,
          },
        },
      },
      include: {
        department: true,
      },
    });

    if (existingCourse) {
      res.status(400).json({
        message: `Course ${name} of ${department} already exists`,
      });
      return;
    }

    const departmentInfo = await prisma.department.findFirst({
      where: {
        name: department,
      },
    });
    if (!departmentInfo) {
      res.status(400).json({
        message: `Department with name ${department} does not exist`,
      });
      return;
    }

    const newCourse = await prisma.course.create({
      data: {
        name: name,
        code: code,
        credits: Number(credits),
        description: description,
        department: {
          connect: {
            id: departmentInfo.id,
          },
        },
        lecture: Number(L),
        tutorial: Number(T),
        practical: Number(P),
        courseType: courseType,
      },
    });

    const newSemesterCourse = await prisma.semesterCourses.create({
      data: {
        course: {
          connect: {
            code: newCourse.code,
          },
        },
        programme: {
          connect: {
            id: programmeId,
          },
        },
        semester: {
          connect: {
            semesterNo_programmeId: {
              programmeId: programmeId,
              semesterNo: Number(semester),
            },
          },
        },
      },
    });
    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
      newSemesterCourse: newSemesterCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred",
    });
  }
};

export const addSemesterCourses:RequestHandler = async(req:Request, res:Response) =>{
  const { semester, programmeId, selectedCourses } = req.body;
  console.log(req.body);

  if(!semester || !programmeId || selectedCourses.length === 0){
    console.log("All fields are required");
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try{
    const courses = await prisma.course.count({
      where:{
        code: {
          in: selectedCourses
        }
      }
    });

    if(courses !== selectedCourses.length){
      res.status(400).json({ message: "One or more selected courses do not exist" });
      return;
    }
    const existingCourse = await prisma.semesterCourses.count({
      where:{
        programmeId: programmeId,
        courseCode:{
          in: selectedCourses
        }
      }
    });

    if(existingCourse > 0){
      res.status(400).json({ message: "Course already exists" });
      return;
    }

    const newSemesterCourses = await prisma.semesterCourses.createMany({
      data: selectedCourses.map((courseCode: string) => ({
        courseCode: courseCode,
        programmeId: programmeId,
        semesterNo: Number(semester),
      })),
    });
    res.status(201).json({ message: "Course added successfully", newSemesterCourses });

  }catch(error: any){
    res.status(500).json({ message: "Some error occurred", error });
  }
}

export const getAllCourses: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: true,
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred",
    });
  }
};

export const getCoursesByDepartment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { department } = req.params;
  try {
    const courses = await prisma.course.findMany({
      where: {
        department: {
          is: {
            name: department,
          },
        },
      },
      include: {
        department: true,
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred",
    });
  }
};

export const getCoursesByProgramme: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { programmeId } = req.body;
  try {
    const courses = await prisma.semesterCourses.findMany({
      where: {
        programmeId: programmeId,
      },
      include: {
        course: true,
      },
    });

    res.status(200).json({
      message: "Success",
      courses: courses,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to get courses",
    });
  }
};

export const selectCourses: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const {
    rollNo,
    selectedCourses,
    semester,
    programmeId,
  }: {
    rollNo: string;
    selectedCourses: string[];
    semester: number;
    programmeId: string;
  } = req.body;

  if (!rollNo || !selectedCourses || !semester) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try {
    const student = await prisma.student.findUnique({
      where: {
        enrollmentNumber: rollNo,
      },
    });

    if (!student) {
      res.status(400).json({ message: "Student not found" });
      return;
    }

    const programme = await prisma.programme.findUnique({
      where: {
        id: programmeId,
      },
    });

    if (!programme) {
      res.status(400).json({ message: "Programme not found" });
      return;
    }

    const courses = await prisma.course.findMany({
      where: {
        code: {
          in: selectedCourses,
        },
      },
    });

    const foundCourses = courses.map((course) => course.code);
    const notFoundCourses = selectedCourses.filter(
      (course: any) => !foundCourses.includes(course)
    );

    if (notFoundCourses.length > 0) {
      res.status(400).json({ message: `Courses ${notFoundCourses} not found` });
      return;
    }

    const data = selectedCourses.map((code: string) => ({
      studentId: rollNo,
      courseCode: code,
      semesterId: semester,
      programmeId: programmeId,
    }));

    const newCourses = await prisma.studentCourses.createMany({
      data,
      skipDuplicates: true,
    });

    res.status(200).json({
      message: "Courses selected successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: "Some error occurred", error });
  }
};



export const verifyCourses: RequestHandler = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);
  const {
    rollNo,
    semester,
    programmeId,
    selectedCourses,
  }: {
    rollNo: string;
    semester: number;
    programmeId: string;
    selectedCourses: string[];
  } = req.body;

  if (!rollNo || !semester || !programmeId || !selectedCourses) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const present = await prisma.studentCourses.findMany({
      where: {
        studentId: rollNo,
        semesterId: semester,
      },
    });

    console.log(present);

    if (present.length < 1) {
      res.status(400).json({ message: "Student not found" });
      return;
    }

    const result = await prisma.studentCourses.updateMany({
      where: {
        studentId: rollNo,
        programmeId: programmeId,
        semesterId: semester,
        courseCode: {
          in: selectedCourses,
        },
      },
      data: {
        isVerified: true,
      },
    });

    res.status(200).json({ message: "Courses verified successfully", result });
  } catch (error: any) {
    res.status(500).json({ message: "Some error occurred", error });
  }
};

export const getCoursesByStudent: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const email  = req.query.email as string;
  const rollNo = email.split('@')[0].toUpperCase();
  try {
    const courses = await prisma.studentCourses.findMany({
      where: {
        studentId: rollNo,
      },
      select: {
        grade: true,
        status: true,
        course: {
          select:{
            code: true,
            name: true,
            credits: true,
            description: true,
            lecture: true,
            tutorial: true,
            practical: true,
            courseType: true,

          }
        },
      },
    });

    res.status(200).json({ message: "Success", courses });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get courses", error });
  }
};

export const gradeStudent: RequestHandler = async ( req: Request, res: Response) => {
  const { rollNo, courseCode, grade, marks } = req.body;
  if( !rollNo || !courseCode || !grade || !marks){
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try{
    const result = await prisma.studentCourses.updateMany({
      where: {
        studentId: rollNo,
        courseCode: courseCode,
      },
      data: {
        grade: grade,
        marks: marks,
        status: grade > 0 ? "completed" : "failed",
      },
    });

    res.status(200).json({ message: "Graded successfully", result });
  }catch (error: any) {
    res.status(500).json({ message: "Some error occurred", error });
  }
}

export const markStudentAttendance:RequestHandler = async ( req: Request, res: Response) => {
  const { rollNo, courseCode, semester, classesAttended} = req.body;
  let classesTaken = req.body.classesTaken;
  if( !rollNo || !courseCode || !semester || !classesAttended){
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try{
    const currentAttendance = await prisma.studentCourses.findUnique({
      where:{
        studentId_semesterId_courseCode:{
          studentId: rollNo,
          courseCode: courseCode,
          semesterId: semester
        }
      },
      select:{
        classesAttended: true,
        classesTaken: true,
        studentId: true,
        courseCode: true,
      }
    });

    if(!currentAttendance){
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if(currentAttendance.classesTaken === null && !classesTaken){
      res.status(400).json({ message: "Classes taken is required" });
      return;
    }else if(currentAttendance.classesTaken){
      classesTaken = currentAttendance.classesTaken + 1;
    }
    

    const newAttendance = await prisma.studentCourses.update({
      where:{
        studentId_semesterId_courseCode:{
          studentId: rollNo,
          courseCode: courseCode,
          semesterId: semester
        },
      },
      data:{
        classesAttended: classesAttended,
        classesTaken: classesTaken
      }
    })

    res.status(200).json({ message: "Attendance marked successfully", newAttendance });

    
  }catch (error: any) {
    res.status(500).json({ message: "Some error occurred", error });
  }
}




