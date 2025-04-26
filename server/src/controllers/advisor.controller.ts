import { Request, Response, RequestHandler } from "express";
import { prisma } from "../db/postgres/prismaClient";

export const assignAdvisors:RequestHandler = async (req: Request, res: Response) => {
    const { employeeId, programmeId, semesterNo} = req.body;

    if(!employeeId || !programmeId || !semesterNo){
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    try{
        const advisor = await prisma.employee.findUnique({where:{id: employeeId}});
        if(!advisor){
            res.status(400).json({ message: "Advisor not found" });
            return;
        }

        const programme = await prisma.programme.findUnique({where:{id: programmeId}});
        if(!programme){
            res.status(400).json({ message: "Programme not found" });            
            return;
        }

        await prisma.advisorMapping.create({
            data:{
                advisor:{
                    connect:{id: employeeId}
                },
                programme:{
                    connect:{id: programmeId}
                },
                semester:{
                    connect:{
                        semesterNo_programmeId:{
                            semesterNo: semesterNo,
                            programmeId: programmeId
                        }
                    }
                }
            }
        })
    }catch(error:any){
        res.status(500).json({ message: "Some error occurred",error });
    }
}
