import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import App from "./App";
import Overview from "./components/Overview";
import Auth from "./components/Auth";
import CourseRegistration from "./components/CourseRegistration";
import Profile from "./components/Profile";
import CourseApproval from "./components/CourseApproval";
import EmployeeOverview from "./components/EmployeeOverview";
import StudentCourses from "./components/StudentCourses";
import Instructor from "./components/Instructor";
import RoleBasedRedirect from "./RoleBasedRedirect";
import GradeStudents from "./components/GradeStudents";
import Attendance from "./components/Attendance";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <RoleBasedRedirect />,
      },
      { path: "auth", element: <Auth /> },
      { path: "overview", element: <Overview /> },
      { path: "employee-overview", element: <EmployeeOverview /> },
      { path: "course-registration", element: <CourseRegistration /> },
      { path: "course-approval", element: <CourseApproval /> },
      { path: "course-approval/:rollNo", element: <StudentCourses /> },
      { path: "profile", element: <Profile /> },
      { path: "instructor", element: <Instructor /> },
      { path: "instructor/mark-attendance/:courseCode", element: <Attendance /> },
      { path: "instructor/grade-students/:courseCode", element: <GradeStudents /> },
      {
        path: "analytics",
        element: <div className="text-white">Analytics</div>,
      },
    ],
  },
]);
