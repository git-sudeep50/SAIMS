import { Router } from 'express';
import { changeCourses, getRegisteredCourses, selectCourses } from '../controllers/course.controller';

const router = Router();

router.post("/select-courses",selectCourses);
router.post("/get-registered-courses",getRegisteredCourses);
router.post("/unregister-courses", changeCourses);


export default router;