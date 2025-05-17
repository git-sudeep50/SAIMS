import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import { useDispatch, useSelector } from "react-redux";
import Auth  from "./components/Auth";
import useAuth from "./utils/useAuth";
import { useNavigate } from "react-router";
import { getStudentCourses, getStudentOverview } from "./utils/overviewUtilityFunctions";
import { setOverviewData } from "./utils/overviewSlice";

type ProgrammeData = {
  id: string,
  name: string,
  duration: number,
  departmentId: string,
  maximumCredits: number,
  minimumCredits: number
}

type StudentData = {
  enrollmentNumber: string,
  cgpa: number
}
type OverviewData = {
  totalCreditsCompleted: number,
  programmeData: ProgrammeData,
  studentData: StudentData,
  coursesCompleted: number
}

type Course = {
  id: string;
  name: string;
  code: string;
  credits: number;
  description: string;
  lecture: number;
  tutorial: number;
  practical: number;
  courseType: string;
};

type CourseData = {
  status: string;
  id: string;
  programmeId: string;
  semesterNo: number;
  courseCode: string;
  course: Course;
};

function App() {
  useAuth();
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const email = useSelector((state: any) => state.auth.user.email);
  // if(!user.email) return null;
  // const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [data, setData] = useState<CourseData[]>([]);
  useEffect(() => {
    if (!email) return;
    (async () => {
      console.log("email", email);
      const overviewData: any = await getStudentOverview(email);
      setOverview(overviewData);
      dispatch(setOverviewData(overviewData));
    })();

    (async () => {
      const courseData= await getStudentCourses(email);
      setData(courseData?.courses);
    })();
  }, [user, email]);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useSelector((state: any) => state.auth);
  

  // useEffect(() => {
  //   if (!isLoading){
  //     if (isAuthenticated) {
  //       navigate("/overview");
  //     } else {
  //       navigate("/auth"); 
  //     }
  //   }
  // }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <div className="app">
        {isAuthenticated ? (
          <>
            <Navbar />
            <Body />
          </>
        ) : (
          <Auth />
        )}
      </div>
    </>
  );
}

export default App;
function dispatch(arg0: { payload: any; type: "overview/setOverviewData"; }) {
  throw new Error("Function not implemented.");
}

