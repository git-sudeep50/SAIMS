import axios from "axios";

const baseURL = "http://localhost:7000/api";

export async function getCoursesByProgramme(programmeId: string) {
    try{
        const response = await axios.post(
            `${baseURL}/common/get-courses-by-programme`,
            {
              programmeId: programmeId,
            },
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
          );
          
          return response.data.courses;
    }catch(err){
        console.log(err);
    }
}

export async function getStudentOverview(email: string) {
    try{
        const response = await axios.get(
            `${baseURL}/common/get-overview?email=${email}`,{withCredentials: true}
          );
          
          return response.data;
    }catch(err){
        console.log(err);
    }
}

export async function getEmployeeOverview(email: string) {
    try{
        const response = await axios.get(
            `${baseURL}/common/get-employee-overview/${email}`,{withCredentials: true}
          );
          
          return response.data;
    }catch(err){
        console.log(err);
    }
}

export async function getStudentCourses(email: string) {
    try{
        const response = await axios.get(
            `${baseURL}/common/get-student-courses?email=${email}`,{withCredentials: true}
          );
          
          return response.data;
    }catch(err){
        console.log(err);
    }
}
