import { Request, RequestHandler, Response } from "express";
import { prisma } from "../db/postgres/prismaClient";

export const createProgramme = async (req: Request, res: Response) => {
  try {
    const { name, duration, deptName, domain } = req.body;

    if(!name || !duration ||!deptName || !domain){
      res.status(400).json({
        msg:"All fields are required"
      });
      return;
    }
    const existingData = await prisma.programme.findFirst({
      where: {
        name: name,
        domain: domain,
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
        domain,
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

export const createDepartment = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { name, schoolId }:{name:string,schoolId:string} = req.body;

    if(!name){
      res.status(400).json({
        msg:"All fields are required"
      });
      return;
    }

    const existingData = await prisma.department.findFirst({
      where: {
        name: name,
        
      },
    });

    if (existingData) {
      res.status(400).json({
        message: `Department ${name} already exists`,
      });
      return;
    }

    const newDepartment = await prisma.department.create({
      data: {
        name,
        schoolId: schoolId
      },
    });

    res.status(200).json({
      msg: "Department data entered successfully",
      data: newDepartment,
    });

    } catch (err: any) {
      res.status(500).json({
        message: "Some error occurred",
        error: err.message,
      });
    }
}

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
            name: true,
            school:{
              select:{
                name: true
              }
            }
          },
          
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


export const getEmployeeOverview:RequestHandler = async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email) {
    res.status(400).json({ error: 'Missing email in URL params' });
    return;
  }

  try {
    // Get user and associated employee
    const user = await prisma.authentication.findUnique({
      where: { email: email },
      include: {
        roles: true,
        employee: true,
      },
    });

    if (!user || !user.employeeId || !user.employee) {
      res.status(404).json({ error: 'User or associated employee not found' });
      return;
    }

    const employeeId = user.employeeId;
    const roles = user.roles.map((r) => r.role);

    const result: any = {
      employee: user.employee,
    };

    if (roles.includes("INSTRUCTOR")) {
      const taughtCourses = await prisma.instructorMapping.findMany({
        where: { instructorId: employeeId },
        include: {
          course: true,
        },
      });

      result.instructorCourses = taughtCourses.map((m) => m.course);
    }

    // Fetch Advised Semesters
    if (roles.includes("ADVISOR")) {
      const advisedSemesters = await prisma.advisorMapping.findMany({
        where: { advisorId: employeeId },
        include: {
          semester: true,
          programme: true,
        },
      });

      result.advisedSemesters = advisedSemesters.map((s) => ({
        programme: s.programme,
        semester: s.semester,
      }));
    }

    // For Admin, you can just return employee info (already included)
    if (roles.includes("ADMIN")) {
      result.adminInfo = { note: 'Admin access granted', employeeId };
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error('Error in getEmployeeOverview:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

