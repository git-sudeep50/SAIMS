import { Router } from "express";
import { addEmployeeData } from "../controllers/employee.controller";
import { getAllCourses, getCoursesByDepartment, getCoursesByProgramme, getCoursesBySemester, getCoursesByStudent, selectCourses } from "../controllers/course.controller";
import { getEmployeeOverview, getStudentOverview } from "../controllers/miscelleneous.controller";
import { authorizeRoles } from "../middlewares/access.middlewares";

const router = Router();

router.post("/enter-employee-data",addEmployeeData);
router.get("/get-all-courses",getAllCourses);
router.get("/get-student-courses", getCoursesByStudent)
router.get("/get-all-courses/:department",getCoursesByDepartment);
router.post("/select-courses",selectCourses);
router.post("/get-courses-by-programme",getCoursesByProgramme);
router.post("/get-courses-by-semester",getCoursesBySemester);
router.get("/get-overview", getStudentOverview);
router.get("/get-employee-overview/:email", getEmployeeOverview)

export default router;