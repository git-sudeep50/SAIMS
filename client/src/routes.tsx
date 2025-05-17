import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import App from "./App";
import Overview from "./components/Overview";
import Auth from "./components/Auth";
import CourseRegistration from "./components/CourseRegistration";
import Profile from "./components/Profile";
import CourseApproval from "./components/CourseApproval";
import EmployeeOverview from "./components/EmployeeOverview";
import RoleBasedRedirect from "./RoleBasedRedirect";

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
      { path: "profile", element: <Profile /> },
      {
        path: "analytics",
        element: <div className="text-white">Analytics</div>,
      },
    ],
  },
]);
