import React from "react";
import { useParams, useSearchParams } from "react-router";
import styles from "./css/CourseRegistration.module.css";
import axios from "axios";
import { getRegisteredCourses } from "../utils/courseUtilityFunctions";

const baseURL = "http://localhost:7000/api";

type CourseData = {
  name: string;
  code: string;
  courseType: string;
  credits: number;
  lecture: number;
  tutorial: number;
  practical: number;
};

type CourseProps = CourseData & {
  course: CourseData;
  onAdd?: (course: CourseData) => void;
  onRemove?: (course: CourseData) => void;
  component: string;
};

const Course: React.FC<CourseProps> = ({
  name,
  code,
  courseType,
  credits,
  lecture,
  tutorial,
  practical,
  component,
  onAdd,
  onRemove,
}) => {
  // const theme = useSelector((state: any) => state.theme.theme);
  const handleAddClick = () => {
    if (onAdd) {
      onAdd({
        name,
        code,
        courseType,
        credits,
        lecture,
        tutorial,
        practical,
      });
    }
    if (onRemove) {
      onRemove({
        name,
        code,
        courseType,
        credits,
        lecture,
        tutorial,
        practical,
      });
    }
  };

  const colorClass = {
    C: "bg-red-400",
    E: "bg-amber-400",
    A: "bg-green-400",
    MOOCS: "bg-gray-400",
  };

  const subjectColor =
    colorClass[
      (courseType?.split(" ")[1] || courseType) as keyof typeof colorClass
    ] || "bg-blue-400";

  return (
    <div
      className={`${styles["main-div"]} w-[100%] h-20 bg-[var(--overlay-color)] rounded-sm flex items-center gap-0.5 relative`}
    >
      <div
        className={`${styles.circle} ${subjectColor} h-17 w-17 rounded-full flex justify-center items-center text-white text-xl`}
      >
        {code.slice(0, 2).toUpperCase()}
      </div>
      <div className={`${styles.content} h-17 w-[87%]  flex flex-col gap-0.5`}>
        <div
          className={`${styles["course-data"]} h-[50%] w-[100%]  flex items-center gap-2`}
        >
          <h1 className={`text-sm font-semibold text-white`}>
            Code: {" " + code}
          </h1>
          <h1 className={`text-sm font-semibold text-white`}>
            Type: {" " + courseType}
          </h1>
          <h1 className={`text-sm font-semibold text-white`}>
            Credits: {" " + credits}
          </h1>
          <h1 className={`text-sm font-semibold text-white`}>
            L: {" " + lecture}
          </h1>
          <h1 className={`text-sm font-semibold text-white`}>
            T: {" " + tutorial}
          </h1>
          <h1 className={`text-sm font-semibold text-white`}>
            P: {" " + practical}
          </h1>
        </div>
        <div
          className={`${styles["course-name"]} h-[50%] w-[100%]  flex items-center`}
        >
          <h1 className={`text-sm font-semibold text-white`}>{name}</h1>
        </div>
        {component !== "none" && (
          <button
            onClick={handleAddClick}
            className={`${
              styles.button
            } absolute top-[30%] right-3 text-sm font-semibold text-black  ${
              component === "given"
                ? "bg-[var(--signature-color)]"
                : "bg-red-400 text-white"
            }`}
          >
            {onAdd ? "Add" : "Remove"}
          </button>
        )}
      </div>
    </div>
  );
};

const StudentCourses = () => {
  const { rollNo } = useParams();
  const [searchParams] = useSearchParams();

  const semester = Number(searchParams.get("semester"));
  const email = searchParams.get("email");
  const programmeId = searchParams.get("programmeId");
  const [courses, setCourses] = React.useState<CourseData[]>([]);

  const handleVerify = async() =>{
    const selectedCourses = courses.map((course) => course.code);
    console.log(selectedCourses);
    await axios.post(`${baseURL}/advisor/verify-courses`, {rollNo,semester, programmeId, selectedCourses},{withCredentials: true});
    alert("Verified Successfully");
  }

  const handleReject = async() =>{
    await axios.post(`${baseURL}/advisor/reject-courses`, {rollNo,semesterNo:semester},{withCredentials: true});
    alert("Rejected Successfully"); 
  }

  React.useEffect(() => {
    if (!rollNo || !semester) return;

    (async () => {
      const data = await getRegisteredCourses(rollNo, Number(semester));
      setCourses(data?.courses);
    })();

    
  }, [rollNo, semester]);

  return (
    <div>
      <div className={``}>
        <div
          className={`${styles.header} flex flex-col justify-center relative items-center w-full h-20 border-slate-400`}
        >
          <span className={` absolute top-[30%] left-3 text-3xl font-semibold text-white`}>Credits: {courses?.reduce((acc, course) => acc + course.credits, 0)}</span>  
          <h1 className={`text-3xl font-semibold text-white`}>
            {courses?.length >0? `${rollNo} has registered for courses`: `No Courses Registered by ${rollNo}`}
          </h1>
          <button
            onClick={handleVerify}
            className={`${styles["register-button"]} bg-[var(--signature-color)] absolute top-[30%] right-3 text-sm font-semibold text-black rounded-sm`}
          >
            Verify
          </button>

          <button
            onClick={handleReject}
            className={`${styles["reject-button"]} bg-red-400 absolute top-[30%] right-36 text-sm font-semibold text-black rounded-sm`}
          >
           Reject
          </button>
        </div>
        <div className={`flex flex-col gap-2 items-center`}>
          <h2 className={`text-2xl font-semibold text-white`}>
            Registered Courses
          </h2>
          <div
            className={`${styles["course-list"]} flex flex-col gap-2 w-[70%] h-[70vh] rounded-sm overflow-y-auto`}
          >
            {courses?.map((course: any) => (
              <Course
                key={course.code}
                {...course}
                course={course}
                component={"none"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
