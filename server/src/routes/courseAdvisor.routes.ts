import { Router } from 'express';
import { verifyCourses } from '../controllers/course.controller';
const router = Router();

router.post("/verify-courses", verifyCourses);

export default router;