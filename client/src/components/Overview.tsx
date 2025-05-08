import React, { useEffect, useState } from "react";
import styles from "./Overview.module.css";
import { useSelector } from "react-redux";
import { getCoursesByProgramme, getStudentCourses, getStudentOverview } from "../utils/overviewUtilityFunctions";

type CourseProps = {
  name: string;
  code: string;
  type: string;
  credits: number;
  lecture: number;
  tutorial: number;
  practical: number;
};

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

type ProgrammeData = {
  id: string,
  name: string,
  duration: number,
  departmentId: string,
  maximumCredits: number,
  minimumCredits: number
}

type StudentData = {
  cgpa: number
}
type OverviewData = {
  totalCreditsCompleted: number,
  programmeData: ProgrammeData,
  studentData: StudentData,
  coursesCompleted: number
}

const Course: React.FC<CourseProps> = ({
  name,
  code,
  type,
  credits,
  lecture,
  tutorial,
  practical,
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  return (
    <div
      className={`${
        styles["subject"]
      } flex gap-3 justify-space-between  items-center  w-full h-15 rounded-sm ${
        theme === "light" ? "bg-slate-300" : "bg-[var(--overlay-color)]"
      } `}
    >
      <div
        className={`${styles.circle} flex justify-center items-center h-12 w-12 rounded-full bg-amber-400`}
      >
        <h1 className="text-white text-lg font-medium">{code.slice(0, 2).toUpperCase()}</h1>
      </div>
      <div className="flex gap-3">
      <h1 className="text-white text-sm font-light">{code}</h1>
      <h1 className="text-white text-[12px] font-light">{name}</h1>
      <h1 className="text-white text-[12px] font-light">Credits:{credits}</h1>
      <h1 className="text-white text-[12px] font-light">Type: {type}</h1>
      </div>
      
      <div className="flex gap-2 text-[12px]">
        <div className="flex-col text-white text-[12px] font-light">
          <span>L</span>
          <span>{lecture}</span>
        </div>
        <div className="flex-col text-white font-light">
          <span>T</span>
          <span>{tutorial}</span>
        </div>
        <div className="flex-col text-white font-light">
          <span>P</span>
          <span>{practical}</span>
        </div>
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [data, setData] = useState<CourseData[]>([]);
  useEffect(() => {
    (async () => {
      const data: any = await getCoursesByProgramme(
        "63407c8c-ba27-41ff-9320-9940744e82ef"
      );
      setCourseData(data);
    })();

    (async () => {
      const overviewData: any = await getStudentOverview("csb22023@tezu.ac.in");
      setOverview(overviewData);
    })();

    (async () => {
      const courseData= await getStudentCourses("csb22023@tezu.ac.in");
      setData(courseData?.courses);
    })();
  }, []);

  console.log("COURSE DATA", data);
  console.log("Overview DATA", overview);

  const cards = [
    {
      id: 1,
      title: "Total Credits",
      value: overview?.programmeData?.minimumCredits,
    },
    {
      id: 2,
      title: "Credits Completed",
      value: overview?.totalCreditsCompleted,
    },
    {
      id: 3,
      title: "CGPA",
      value: overview?.studentData?.cgpa,
    },
    {
      id: 4,
      title: "Courses Completed",
      value: overview?.coursesCompleted,
    },
  ];

  return (
    <div
      className={`${styles["main-container"]} w-full h-[100%] ${
        theme === "light" ? "bg-white" : "bg-[var(--bg-clr)]"
      }`}
    >
      <div className="flex justify-between">
        <h1 className="text-white text-2xl font-semibold">Overview</h1>
        <h1 className="text-white text-2xl font-semibold">
          Roll Number: CSB22002
        </h1>
      </div>
      <div className={`${styles["credits-card-div"]} h-55 w-[100%]`}>
        {cards.map((card) => (
          <div key={card.id} className={`${styles["credits-card"]}`}>
            <h2 className="text-white text-10 font-semibold">{card.title}</h2>
            <h2 className="text-white text-8xl self-center font-semibold">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <div
        className={`${styles["courses-div"]} flex h-90 w-[100%] justify-between`}
      >
        <div
          className={`${styles["currently-enrolled"]} ${styles["courses-inside"]} h-86 w-[49%] rounded-md border-2 border-[var(--border-color)] p-1.5`}
        >
          <span>
            <h2 className="text-white text-xl font-semibold">
              Currently Enrolled Courses
            </h2>
          </span>
          <div className={`${styles["course"]} w-full h-[90%] `}>
            {data.length === 0 ? (
              <h2>Loading...</h2>
            ) : (
              data.filter(course => course.status?.trim().toLowerCase() === "ongoing").map((course) => {
                console.log("COURSE", course);
                return (
                  <Course
                    key={course.course.code}
                    name={course.course.name}
                    code={course.course.code}
                    type={course.course.courseType}
                    credits={course.course.credits}
                    lecture={course.course.lecture}
                    tutorial={course.course.tutorial}
                    practical={course.course.practical}
                  />
                );
              })
            )}
          </div>
        </div>

        <div
          className={`${styles["completed"]} ${styles["courses-inside"]}  h-86 w-[49.5%] rounded-md border-2 border-[var(--border-color)]`}
        >
          <span>
            <h2 className="text-white  text-xl font-semibold">
              Completed Courses
            </h2>
          </span>
          <div className={`${styles["course"]} w-full h-[90%]`}>
          {data.length === 0 ? (
              <h2>Loading...</h2>
            ) : (
              data.filter(course => course.status?.trim().toLowerCase() === "completed").map((course) => {
                return (
                  <Course
                    key={course.course.code}
                    name={course.course.name}
                    code={course.course.code}
                    type={course.course.courseType}
                    credits={course.course.credits}
                    lecture={course.course.lecture}
                    tutorial={course.course.tutorial}
                    practical={course.course.practical}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
