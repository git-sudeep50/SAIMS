import { Request, Response, RequestHandler } from "express";
import { prisma } from "../db/postgres/prismaClient";


export const createCourse: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { name, code, credits, description, department, L, T, P, courseType } =
    req.body;
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
    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred",
    });
  }
};

export const getAllCourses: RequestHandler = async (req: Request, res: Response) => {
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
}

export const getCoursesByDepartment: RequestHandler = async (req: Request, res: Response) => {
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
}

export const selectCourses: RequestHandler = async (req: Request, res: Response) => {
  const { rollNo, selectedCourses, semester } = req.body;
  
  if(!rollNo || !selectedCourses || !semester){
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try{
    const student = await prisma.student.findUnique({
      where:{
        enrollmentNumber: rollNo
      },
    });

    if(!student){
      res.status(400).json({ message: "Student not found" });
      return;
    }

    const courses = await prisma.course.findMany(
      {
        where:{
          code: {
            in: selectedCourses
          }
        }
      }
    );

    const foundCourses = courses.map((course)=>course.code);
    const notFoundCourses = selectedCourses.filter((course:any)=>!foundCourses.includes(course));

    if(notFoundCourses.length > 0){
      res.status(400).json({ message: `Courses ${notFoundCourses} not found` });
      return;
    }

    const data = selectedCourses.map((code:String)=>(
      {studentId:rollNo, courseCode:code, semesterId:semester}
    ));

    const newCourses = await prisma.studentCourses.createMany({
      data,
      skipDuplicates: true
    }
    );

    res.status(200).json({
      message: "Courses selected successfully",
    });

  }catch(error:any){
    res.status(500).json({ message: "Some error occurred",error });
  }
}




