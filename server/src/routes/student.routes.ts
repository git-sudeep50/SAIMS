import { Router } from 'express';
import { selectCourses } from '../controllers/course.controller';

const router = Router();

router.post("/select-courses",selectCourses);

export default router;