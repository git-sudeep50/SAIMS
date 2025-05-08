import { Request, Response } from "express";
import { prisma } from "../db/postgres/prismaClient";

export const createProgramme = async (req: Request, res: Response) => {
  try {
    const { name, duration, deptName } = req.body;

    if(!name || !duration ||!deptName){
      res.status(400).json({
        msg:"All fields are required"
      });
      return;
    }
    const existingData = await prisma.programme.findFirst({
      where: {
        name: name,
        department: {
          is: {
            name: deptName,
          },
        },
      },
      include: {
        department: true,
      },
    });

    if (existingData) {
      res.status(400).json({
        message: `Programme ${name} of ${deptName} already exists`,
      });
      return;
    }

    const deptInfo = await prisma.department.findFirst({
      where: {
        name: deptName,
      },
    });

    if (!deptInfo) {
      res.status(404).json({
        message: `Department ${deptName} not found`,
      });
      return;
    }

    const newProgramme = await prisma.programme.create({
      data: {
        name,
        duration,
        department: {
          connect: { id: deptInfo.id },
        },
      },
    });
    let i = 0;
    const semesters = [];
    while(i<2*duration){
      semesters.push(++i);
    }

    const data = semesters.map((semNo)=>({
      programmeId: newProgramme.id,
      semesterNo: semNo,
      name: semNo,
    }));

    await prisma.semester.createMany({
      data,
      skipDuplicates: true
    })
    

    res.status(201).json({
      msg: "Programme data entered successfully",
      data: newProgramme,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Some error occurred",
      error: err.message,
    });
  }
};

// export const createDepartment = async (req:Request, res: Response) =>{
//   try{
//     const { } = req.body;

//   }catch(err:any){

//   }
// }

export const getStudentOverview = async (req: Request, res: Response) => {
  const  email  = req.query.email as string;

  try{
    const studentData = await prisma.student.findUnique({
      where:{
        email: email
      },
      include:{
        currentSemester: {
          select:{
            semesterNo: true
          }
        },
        department: {
          select:{
            name: true
          }
        }
      }
    })

    if(!studentData){
      res.status(404).json({
        message: "Student not found"
      })
      return;
    }

    const programmeData = await prisma.programme.findUnique({
      where:{
        id: studentData.programmeId
      }
    })

    const coursesCompleted = await prisma.studentCourses.count({
      where:{
        studentId: studentData.enrollmentNumber,
        status: "completed"
      }
    })

    const completedCourses = await prisma.studentCourses.findMany({
      where: {
        studentId: studentData.enrollmentNumber,
        status: "completed",
      },
      include: {
        course: {
          select: {
            credits: true,
          },
        },
      },
    });

    const totalCreditsCompleted = completedCourses.reduce((sum, sc) => {
      return sum + (sc.course?.credits || 0);
    }, 0);

    if(!programmeData){
      res.status(404).json({
        message: "Programme not found"
      })
      return;
    }

    res.status(200).json({
      studentData,
      programmeData,
      coursesCompleted,
      totalCreditsCompleted
    })
  }catch(error:any){
      res.status(500).json({
        message: "Some error occurred"
      })
  }
};
