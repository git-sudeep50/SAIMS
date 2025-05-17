import { Router } from 'express';
import { rejectCourses, verifyCourses } from '../controllers/course.controller';
const router = Router();

router.post("/verify-courses", verifyCourses);
router.post("/reject-courses", rejectCourses);

export default router;