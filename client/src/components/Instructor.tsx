import React from 'react';
import { useSelector } from 'react-redux';
import courseStyles from "./css/CourseRegistration.module.css";
import styles from "./css/Instructor.module.css"
import {useNavigate } from "react-router";

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
}) => {
  // const theme = useSelector((state: any) => state.theme.theme);

  const navigate = useNavigate();
  const handleMarkAttendance = (courseCode: string, semesterNo: number) => {
    navigate(`/instructor/mark-attendance/${courseCode}?courseCode=${courseCode}&semester=${semesterNo}`);
  };

  const handleGrade = (courseCode: string, semesterNo: number) => {
    navigate(`/instructor/grade-students/${courseCode}?courseCode=${courseCode}&semester=${semesterNo}`);
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
      className={`${courseStyles["main-div"]} w-[100%] h-20 bg-[var(--overlay-color)] rounded-sm flex items-center gap-0.5 relative`}
    >
      <div
        className={`${courseStyles.circle} ${subjectColor} h-17 w-17 rounded-full flex justify-center items-center text-white text-xl`}
      >
        {code.slice(0, 2).toUpperCase()}
      </div>
      <div className={`${courseStyles.content} h-17 w-[87%]  flex flex-col gap-0.5`}>
        <div
          className={`${courseStyles["course-data"]} h-[50%] w-[100%]  flex items-center gap-2`}
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
          className={`${courseStyles["course-name"]} h-[50%] w-[100%]  flex items-center`}
        >
          <h1 className={`text-sm font-semibold text-white`}>{name}</h1>
        </div>


          <button
            onClick={() => handleMarkAttendance(code, 1)}
            className={`${
              courseStyles.button
            } absolute top-[30%] right-44 text-sm font-semibold text-black  bg-[var(--signature-color)]`}
          >
            Mark Attendance
          </button>  
        
          <button
          onClick={() => handleGrade(code, 1)}
            className={`${
              courseStyles.button
            } absolute top-[30%] right-3 text-sm font-semibold text-black  bg-blue-300`}
          >
            Grade Students
          </button>
      </div>
    </div>
  );
};

const Instructor = () => {
    const navigate = useNavigate();
    const courses = useSelector((state: any) => state?.overview?.overviewData?.instructorCourses);
    console.log(courses);
    const handleMarkAttendance = (courseCode: string, semesterNo: number) => {
    navigate(`/instructor/mark-attendance/${courseCode}?courseCode=${courseCode}&semester=${semesterNo}`);
  };
  return (
    <div>
        <div
          className={`${courseStyles.header} flex flex-col justify-center relative items-center w-full h-20 border-slate-400`}
        >
          <h1 className={`text-3xl font-semibold text-white`}>
            Courses Taught
          </h1>
        </div>
        <div className={`${styles.container} w-[100%] h-[79vh] overflow-y-auto`}>
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
  )
}

export default Instructor
