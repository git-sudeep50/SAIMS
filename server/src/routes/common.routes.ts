import { Router } from "express";
import { addEmployeeData } from "../controllers/employee.controller";

const router = Router();

router.post("/enter-employee-data",addEmployeeData);

export default router;