import { Router } from 'express';
import { createEmployee, createStudent } from '../controllers/accounts.controller';
import { addEmployeeData } from '../controllers/employee.controller';
import { createProgramme } from '../controllers/miscelleneous.controller';
import { addStudentData, getStudentDataByRollNumber } from '../controllers/student.controller';
import { addSemesterCourses, createCourse } from '../controllers/course.controller';
import { assignCourseToInstructor } from '../controllers/courseInstructor.controller';

const router = Router();


router.post('/create-student',createStudent);
router.post('/create-advisor',createEmployee("ADVISOR"));
router.post('/create-instructor',createEmployee("INSTRUCTOR"));
router.post('/enter-employee-data',addEmployeeData);
router.post('/create-programme', createProgramme);
router.post('/add-student-data',addStudentData);
router.post('/add-course',createCourse);
router.post('/add-semester-courses', addSemesterCourses);
router.post('/assign-course',assignCourseToInstructor);
router.get('/get-student-data/:rollNo',getStudentDataByRollNumber);


export default router;