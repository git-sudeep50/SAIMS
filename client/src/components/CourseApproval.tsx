import React, { useEffect } from 'react'
import axios from 'axios';
import {useSelector} from 'react-redux';
import styles from "./css/CourseApproval.module.css"
import { useNavigate } from 'react-router';

const baseURL = "http://localhost:7000/api";

const CourseApproval = () => {
  const navigate = useNavigate();
  const [students, setStudents] = React.useState([]);
  const programmeId = useSelector((state: any) => state?.overview?.overviewData?.advisedSemesters[0]?.semester?.programmeId);
  const semester = useSelector((state: any) => state?.overview?.overviewData?.advisedSemesters[0]?.semester?.semesterNo);
  const handleViewClick = (rollNo: string, semesterNo: number, email: string) => {
    navigate(`/course-approval/${rollNo}?semester=${semesterNo}&email=${encodeURIComponent(email)}&programmeId=${programmeId}`);
  };
  useEffect(() => {
    if (!programmeId || !semester) return;
    
    axios
    .get(`${baseURL}/advisor/get-students-by-semester`, {
      params: {
        programmeId,
        semester,
      },
    })
    .then((response) => {
      setStudents(response.data);
      console.log("STUDENTS", response.data);
    })
    .catch((error) => {
      console.error('Error fetching students:', error);
    });
  },[programmeId,semester]);

  return (
    <div>
      <div className={`${styles.container} w-[100%] h-[90vh] overflow-y-auto`}>
        {students.map((student: any) => (
          <div className={`${styles.card} w-[300px] h-[300px] rounded-lg shadow-lg p-4 m-4 flex flex-col items-center justify-center gap-2`}>
            <h2 className="text-lg text-white font-semibold mb-2">Name:{" "+student.name}</h2>
            <p className="text-gray-600">Email:{" "+student.email}</p>
            <p className="text-gray-600">Roll No.:{" "+student.enrollmentNumber}</p>
            <p className="text-gray-600">Semester:{" "+student.currentSemesterNo}</p>
            <button onClick={() => handleViewClick(student.enrollmentNumber, student.currentSemesterNo, student.email)} className={`${styles.btn} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}>View</button>  
          </div>
        ))}
        
      </div>
      
    </div>
  )
}

export default CourseApproval
