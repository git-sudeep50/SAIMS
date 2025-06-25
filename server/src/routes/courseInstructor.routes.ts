import { Router } from 'express';
import { getOngoingCourseStudents, gradeStudent, markStudentAttendance } from '../controllers/course.controller';
const router = Router();

router.post("/grade-student-course", gradeStudent);
router.post("/mark-student-attendance", markStudentAttendance);
router.post("/get-ongoing-course-students", getOngoingCourseStudents);


export default router;