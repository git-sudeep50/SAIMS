import axios from "axios";

const baseURL = "http://localhost:7000/api";

export const getCoursesBySemester = async (
  semester: number,
  programmeId: string
) => {
  try {
    const response = await axios.post(
      `${baseURL}/common/get-courses-by-semester`,
      { semester: semester, programmeId: programmeId },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return response.data.courses;
  } catch (err) {
    console.log(err);
  }
};

export const registerCourses = async ({
  rollNo,
  selectedCourses,
  semesterNo,
  programmeId,
}: {
  rollNo: string;
  selectedCourses: string[];
  semesterNo: number;
  programmeId: string;
}) => {
    console.log(rollNo, selectedCourses, semesterNo, programmeId);
  try {
    const response = await axios.post(
      `${baseURL}/common/select-courses`,
      {
        rollNo: rollNo,
        selectedCourses: selectedCourses,
        semester: semesterNo,
        programmeId: programmeId,
      },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    console.log("RESPONSE",response);

    return response.data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getRegisteredCourses = async (rollNo: string, semesterNo: number) => {
  try {
    const response = await axios.post(
      `${baseURL}/student/get-registered-courses`,
      { rollNo: rollNo, semesterNo: semesterNo },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const reselectCourses = async (rollNo: string, semesterNo: number) => {
  try {
    const response = await axios.post(
      `${baseURL}/student/unregister-courses`,
      { rollNo: rollNo, semesterNo: semesterNo },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
