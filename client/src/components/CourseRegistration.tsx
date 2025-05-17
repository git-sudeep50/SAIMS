import React, { use, useEffect, useState } from "react";
import styles from "./css/CourseRegistration.module.css";
import { useSelector } from "react-redux";
import {
  getCoursesBySemester,
  getRegisteredCourses,
  registerCourses,
  reselectCourses
} from "../utils/courseUtilityFunctions";

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

const CourseRegistration = () => {
  const semesterInfo = useSelector(
    (state: any) => state?.overview?.overviewData?.studentData
  );
  console.log("SEMESTER INFO", semesterInfo);
  const [givenCourses, setGivenCourses] = useState<CourseData[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CourseData[]>([]);
  const [courseRegistrationData, setCourseRegistrationData] = useState<any>();
  const [flag, setFlag] = useState(false);

  const handleRegister = async () => {
    try {
      const data = selectedCourses?.map((course: CourseData) => course?.code);
      const payload = {
        rollNo: semesterInfo?.enrollmentNumber,
        selectedCourses: data,
        semesterNo: semesterInfo?.currentSemesterNo,
        programmeId: semesterInfo?.programmeId,
      };
      const response = await registerCourses({ ...payload });
      setFlag(!flag);
      console.log("Response", response);
      window.alert("Registered Successfully Waiting for approval");
    } catch (err: any) {
      console.log(err);
      window.alert(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (!semesterInfo) return;
    (async () => {
      console.log("SEMESTER INFO", semesterInfo);
      const data = await getCoursesBySemester(
        semesterInfo?.currentSemesterNo,
        semesterInfo?.programmeId
      );
      setGivenCourses(data);
      const registrationData = await getRegisteredCourses(
        semesterInfo?.enrollmentNumber,
        semesterInfo?.currentSemesterNo
      );
      setCourseRegistrationData(registrationData);
      console.log("COURSE REG DATA", courseRegistrationData);
    })();

    console.log(givenCourses);
  }, [flag,semesterInfo]);

  const handleAddCourse = (course: CourseData) => {
    setSelectedCourses((prev: CourseData[]) =>
      prev.some((c) => c.code === course.code) ? prev : [...prev, course]
    );
    setGivenCourses((prev: CourseData[]) =>
      prev.filter((c) => c.code !== course.code)
    );
  };

  const handleRemoveCourse = (course: CourseData) => {
    setSelectedCourses((prev: CourseData[]) =>
      prev.filter((c) => c.code !== course.code)
    );
    setGivenCourses((prev: CourseData[]) => [...prev, course]);
  };

  const handleReselectCourse = () => {
    reselectCourses(semesterInfo?.enrollmentNumber, semesterInfo?.currentSemesterNo).then(() => {
      setFlag(!flag);
      setSelectedCourses([]);
      window.alert("Courses Unregistered Reselect Courses");
    })
  }

  if (courseRegistrationData?.hasRegisteredCourses) {
    return (
      <div className={``}>
        <div
          className={`${styles.header} flex flex-col justify-center relative items-center w-full h-20 border-slate-400`}
        >
          <h1 className={`text-3xl font-semibold text-white`}>
            You Have Registered For Courses
          </h1>
          <button
            onClick={() => handleReselectCourse()}
            className={`${styles["register-button"]} bg-red-400 absolute top-[30%] right-3 text-sm font-semibold text-white rounded-sm`}
          >
            Change Courses
          </button>
        </div>
        <div className={`flex flex-col gap-2 items-center`}>
          <h2 className={`text-2xl font-semibold text-white`}>
            Your Registered Couses
          </h2>
          <div
            className={`${styles["course-list"]} flex flex-col gap-2 w-[70%] h-[70vh] rounded-sm overflow-y-auto`}
          >
            {courseRegistrationData?.courses &&courseRegistrationData?.courses?.map((course: any) => (
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
    );
  } else
    return (
      <div>
        <div
          className={`${styles.header} flex flex-col justify-center relative items-center w-full h-20 border-slate-400`}
        >
          <h1 className={`text-3xl font-semibold text-white`}>
            Course Registration is closed
          </h1>
          <h2 className={`text-2xl text-white`}>
            Your Course Advisor is Bhabesh Nath
          </h2>
          <button
            onClick={() => handleRegister()}
            className={`${styles["register-button"]} bg-[var(--signature-color)] absolute top-[30%] right-3 text-sm font-semibold text-black rounded-sm`}
          >
            Register
          </button>
        </div>
        {/* If course registration is open */}
        <div className={`${styles["course-selection"]} w-full h-[79vh] flex`}>
          <div
            className={`${styles["courses"]} ${styles["given-courses"]}  w-[50%] h-[100%] flex flex-col items-center`}
          >
            <h2 className={`text-2xl text-white`}>Given Courses</h2>
            <div
              className={`${styles["course-list"]} flex flex-col gap-2 w-[100%] h-[95%] rounded-sm`}
            >
              {givenCourses?.length > 0 && givenCourses?.map((course) => (
                <Course
                  key={course.code}
                  {...course}
                  course={course}
                  onAdd={handleAddCourse}
                  component={"given"}
                />
              ))}
            </div>
          </div>
          <div
            className={`${styles["courses"]} ${styles["selected-courses"]} w-[50%] h-[100%] flex flex-col items-center`}
          >
            <h2 className={`text-2xl text-white`}>Selected Courses</h2>
            <div
              className={`${styles["course-list"]} flex flex-col gap-2  w-[100%] h-[95%] rounded-sm`}
            >
              {selectedCourses?.length > 0  && selectedCourses?.map((course) => (
                <Course
                  key={course.code}
                  {...course}
                  course={course}
                  component={"selected"}
                  onRemove={handleRemoveCourse}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};

export default CourseRegistration;
