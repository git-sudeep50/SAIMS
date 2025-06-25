import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./css/Attendance.module.css";
import { useNavigate, useParams, useSearchParams } from "react-router";

const baseURL = "http://localhost:7000/api";

const Attendance = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const courseCode = searchParams.get("courseCode");
  useEffect(() => {
    (async () => {
      const fetchedData = await axios.post(
        `${baseURL}/instructor/get-ongoing-course-students`,
        { courseCode },
        { withCredentials: true }
      );
      setData(fetchedData?.data?.result);
      console.log(fetchedData?.data?.result);
    })();
  }, [courseCode]);

  const handleAttendance = async (rollNo: string) => {};
  return (
    <div className={`${styles.container} flex flex-col w-[100%] h-[90vh] gap-1`} >
      {data.map((student: any) => (
        <div className={`${styles.card} w-[70%] h-[10vh] relative bg-slate-500 rounded-lg shadow-md p-4 m-4 flex items-center gap-2 font-semibold`}>
          <h2>Roll No:{" "+student?.studentId}</h2>
          <h2>Total Classes:{" "+student?.classesTaken}</h2>
          <h2>Classes Attended:{" "+student?.classesAttended}</h2>
          <h2>Percentage:{" "+((student?.classesAttended / student?.classesTaken * 100) || 0 )+ "%"}</h2>
          <button className={`${styles.button} absolute top-[25%] right-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`}>Mark</button>
        </div>
      ))}
    </div>
  );
};

export default Attendance;
