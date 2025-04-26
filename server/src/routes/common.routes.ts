import { Router } from "express";
import { addEmployeeData } from "../controllers/employee.controller";
import { getAllCourses, getCoursesByDepartment, selectCourses } from "../controllers/course.controller";

const router = Router();

router.post("/enter-employee-data",addEmployeeData);
router.get("/get-all-courses",getAllCourses);
router.get("/get-all-courses/:department",getCoursesByDepartment);
router.post("/select-courses",selectCourses);

export default router;