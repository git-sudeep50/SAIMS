import { Router } from 'express';
import { getRegisteredCourses, rejectCourses, verifyCourses } from '../controllers/course.controller';
import { getStudentsBySemester } from '../controllers/student.controller';
const router = Router();

router.post("/verify-courses", verifyCourses);
router.post("/reject-courses", rejectCourses);
router.get("/get-students-by-semester",getStudentsBySemester);
router.post("/get-registered-courses", getRegisteredCourses);

export default router;