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

export const createDepartment = async (req:Request, res: Response) =>{
  try{
    const { } = req.body;

  }catch(err:any){

  }
}
