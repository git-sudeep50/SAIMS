import { prisma } from "../db/postgres/prismaClient";
import { Request, Response, RequestHandler } from "express";

export const assignCourseToInstructor: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { courseCode, instructorId }:{courseCode: string, instructorId: string} = req.body;

  try {
    const course = await prisma.course.findUnique({
      where: {
        code: courseCode,
      },
    });

    if(!course){
        res.status(400).json({ message: "Course not found" });
        return;
    }

    const instructor = await prisma.employee.findUnique({
        where:{
            id: instructorId
        }
    });

    if(!instructor){
        res.status(400).json({ message: "Instructor not found" });
        return;
    }

    const courseInstructor = await prisma.instructorMapping.create({
        data:{
            course:{
                connect:{code: courseCode}
            },
            instructor:{
                connect:{id: instructorId}
            }
        }
    });

    res.status(200).json(courseInstructor);
  } catch (error: any) {
    res.status(500).json({
      message: "Some error occurred",
      error,
    });
  }
};
