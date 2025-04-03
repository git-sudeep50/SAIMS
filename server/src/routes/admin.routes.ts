import { Router } from 'express';
import { createEmployee, createStudent } from '../controllers/accounts.controller';
import { addEmployeeData } from '../controllers/employee.controller';
import { createProgramme } from '../controllers/miscelleneous.controller';
import { addStudentData } from '../controllers/student.controller';

const router = Router();


router.post('/create-student',createStudent);
router.post('/create-advisor',createEmployee("ADVISOR"));
router.post('/create-instructor',createEmployee("INSTRUCTOR"));
router.post("/enter-employee-data",addEmployeeData);
router.post("/create-programme", createProgramme);
router.post("/add-student-data",addStudentData);


export default router;