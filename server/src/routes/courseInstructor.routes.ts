import { Router } from 'express';
import { gradeStudent, markStudentAttendance } from '../controllers/course.controller';
const router = Router();

router.post("/grade-student-course", gradeStudent);
router.post("/mark-student-attendance", markStudentAttendance);


export default router;