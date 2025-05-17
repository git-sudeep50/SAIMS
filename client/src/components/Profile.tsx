import React from "react";
import styles from "./css/Profile.module.css";
import image from "../assets/react.svg";
import { useSelector } from "react-redux";

const Profile = () => {
    const h2_style:string = "text-sm text-white font-light";
    const desc_style:string = "text-lg text-white font-semibold";
    const data = useSelector((state: any) => state?.overview?.overviewData);
  return (
    <>
      <div
        className={`${styles.container} width-full h-[95vh] flex flex-col gap-1`}
      >
        <div className={`${styles.header} flex gap-3 items-center w-[70%]`}>
          <div
            className={`${styles.photo} rounded-full w-[100px] h-[100px] flex justify-center items-center`}
          >
            <img src={image} alt="" className="size-28" />
          </div>
          <div>
            <h1 className="text-4xl text-white font-semibold">
              {data?.studentData?.name.toUpperCase()}
            </h1>
            <h2 className="text-2xl text-white font-semibold">
              {data?.programmeData?.name.toUpperCase()} IN {data?.programmeData?.domain.toUpperCase()}
            </h2>
          </div>
        </div>
        <div className={`${styles.info} flex gap-1`}>
          <div
            className={`${styles["academic-info"]} relative bg-[var(--overlay-color)] h-[100%] w-[50%] overflow-y-auto flex flex-col`}
          >
            <h1 className="text-xl text-white font-semibold absolute top-0  bg-opacity-100 z-20 p-4 text-center w-[100%]">
              ACADEMIC INFORMATION
            </h1>
            <h2 className={h2_style} >PROGRAMME:</h2>
            <h3 className={desc_style}>{data?.programmeData?.name.toUpperCase()}</h3>
            <h2 className={h2_style}>BRANCH:</h2>
            <h3 className={desc_style}>{data?.programmeData?.domain.toUpperCase()}</h3>
            <h2 className={h2_style}>ROLL NO:</h2>
            <h3 className={desc_style}>{data?.studentData?.enrollmentNumber}</h3>
            <h2 className={h2_style}>DEPARTMENT: </h2>
            <h3 className={desc_style}>{data?.studentData?.department?.name}</h3>
            <h2 className={h2_style}>SCHOOL:</h2>
            <h3 className={desc_style}> {data?.studentData?.department?.school?.name}</h3>
            <h2 className={h2_style}>SEMESTER:</h2>
            <h3 className={desc_style}>{data?.studentData?.currentSemesterNo}</h3>
            <h2 className={h2_style}>CGPA:</h2>
            <h3 className={desc_style}>{data?.studentData?.cgpa}</h3>
            <h2 className={h2_style}>ENROLLMENT YEAR:</h2>
            <h3 className={desc_style}>{data?.studentData?.enrollmentYear}</h3>
          </div>

          <div
            className={`${styles["other-info"]} bg-[var(--overlay-color)] relative h-[100%] w-[50%] overflow-y-auto flex flex-col`}
          >
            <h1 className="text-xl text-white font-semibold absolute top-0  bg-opacity-100 z-20 p-4 text-center w-[100%]">
              OTHER INFORMATION
            </h1>
            <h2 className={h2_style} >DOB:</h2>
            <h3 className={desc_style}>{data?.studentData?.dob.split("T")[0].split("-").reverse().join("-")}</h3>
            <h2 className={h2_style} >GENDER:</h2>
            <h3 className={desc_style}>{data?.studentData?.gender}</h3>
            <h2 className={h2_style}>ADDRESS:</h2>
            <h3 className={desc_style}>{data?.studentData?.address}</h3>
            <h2 className={h2_style}>PHONE</h2>
            <h3 className={desc_style}>{data?.studentData?.phoneNumber}</h3>
            <h2 className={h2_style}>EMAIL: </h2>
            <h3 className={desc_style}>{data?.studentData?.email}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
