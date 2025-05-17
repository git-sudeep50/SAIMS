import { Request, Response, RequestHandler } from "express";
import { prisma } from "../db/postgres/prismaClient";

export const assignAdvisor:RequestHandler = async (req: Request, res: Response) => {
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

        res.status(200).json({ message: "Advisor assigned successfully" });
    }catch(error:any){
        res.status(500).json({ message: "Some error occurred",error });
    }
}

export const getAdvisorsByDepartment: RequestHandler = async (req: Request, res: Response) => {
  const { departmentId } = req.params;

  if (!departmentId) {
    res.status(400).json({ error: 'departmentId is required in URL params' });
    return;
  }

  try {
    const instructors = await prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        departmentId: string | null;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
      SELECT e.*
      FROM "Employee" e
      JOIN "Authentication" a ON a."employeeId" = e.id
      JOIN "RoleAssignment" r ON r."userId" = a.id
      WHERE r.role = 'ADVISOR'
        AND e."departmentId" = ${departmentId};
    `;

    res.status(200).json({ instructors });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
