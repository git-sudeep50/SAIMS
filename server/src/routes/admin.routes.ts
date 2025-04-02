import { Router } from 'express';
import { createEmployee, createStudent } from '../controllers/accounts.controllers';
import { addEmployeeData } from '../controllers/employee.controllers';

const router = Router();


router.post('/create-student',createStudent);
router.post('/create-advisor',createEmployee("ADVISOR"));
router.post('/create-instructor',createEmployee("INSTRUCTOR"));
router.post("/enter-employee-data",addEmployeeData);


export default router;