import { createSlice } from "@reduxjs/toolkit";

const overviewSlice = createSlice({
    name: "overview",
    initialState: {
        studentData: {
            id: "",
            name: "",
            email:  "",
            phoneNumber: "",
            dob: "",
            address: "",
            gender: "",
            rollNumber: "",
            enrollmentYear: "",
            programme: "",
            deptName: "",
            semester: "",
            cgpa: 0,
            totalCreditsCompleted: 0,
            coursesCompleted: 0,
            departmentId: "",
            currentSemesterNo: 0, 
        },
        programmeData:{
            id: "",
            name: "",
            duration: 0,
            maximumCredits: 0,
            minimumCredits: 0
        },
        overviewData: {},
    },
    reducers: {
        setStudentData: (state, action) => {
            state.studentData = action.payload;
        },
        setProgrammeData: (state, action) => {
            state.programmeData = action.payload;
        },
        setOverviewData: (state, action) => {
            state.overviewData = action.payload;
        },
    },
});

export const { setStudentData, setProgrammeData, setOverviewData } = overviewSlice.actions;
export default overviewSlice.reducer;