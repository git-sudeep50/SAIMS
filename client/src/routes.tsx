import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Overview from "./components/Overview";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children:[
        {index:true,path:"overview",element:<Overview />},
        {path:"course-registration",element:<div className="text-white">Course Registration</div>},
        {path:"profile",element:<div className="text-white">Profile</div>},
        {path:"analytics",element:<div className="text-white">Analytics</div>},
      ]
    },
  ]);