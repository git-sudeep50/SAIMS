import React from "react";
import styles from "./Overview.module.css";
import { useSelector } from "react-redux";

const Course: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);
  return (
    <div className={`${styles["subject"]} flex gap-3  items-center  w-full h-15 rounded-sm ${theme === "light" ? "bg-slate-300" : "bg-[var(--overlay-color)]"} `}>
      <div className={`${styles.circle} flex justify-center items-center h-12 w-12 rounded-full bg-amber-400`}>
        <h1 className="text-white text-lg font-medium">CO</h1>
      </div>
      <h1 className="text-white text-sm font-light">Computer Organization</h1>
      <h1 className="text-white text-sm font-light">Credits: 4</h1>
      <h1 className="text-white text-sm font-light">Type: C</h1>
      <div className="flex gap-2">
        <div className="flex-col text-white font-light"><span>L</span><span>3</span></div>
        <div className="flex-col text-white font-light"><span>T</span><span>0</span></div>
        <div className="flex-col text-white font-light"><span>P</span><span>1</span></div>
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  const theme = useSelector((state: any) => state.theme.theme);

  const cards = [
    {
      id: 1,
      title: "Total Credits",
      value: 100,
    },
    {
      id: 2,
      title: "Credits Completed",
      value: 50,
    },
    {
      id: 3,
      title: "CGPA",
      value: 8.55,
    },
    {
      id: 4,
      title: "Courses Completed",
      value: 10,
    },
  ];

  return (
    <div className={`${styles["main-container"]} w-full h-[100%] ${theme === "light" ? "bg-white" : "bg-[var(--bg-clr)]"}`}>
      <div className="flex justify-between">
      <h1 className="text-white text-2xl font-semibold">Overview</h1>
      <h1 className="text-white text-2xl font-semibold">Roll Number: CSB22002</h1>
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

      <div className={`${styles["courses-div"]} flex h-90 w-[100%] justify-between`}>
        <div className={`${styles["currently-enrolled"]} ${styles["courses-inside"]} h-86 w-[49%] rounded-md border-2 border-[var(--border-color)] p-1.5`}>
            <span><h2 className="text-white text-xl font-semibold">Currently Enrolled Courses</h2></span>
            <div className={`${styles["course"]} w-full h-[90%] `}>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
            </div>
        </div>

        <div className={`${styles["completed"]} ${styles["courses-inside"]}  h-86 w-[49.5%] rounded-md border-2 border-[var(--border-color)]`}>
        <span><h2 className="text-white text-xl font-semibold">Completed Courses</h2></span>
        <div className={`${styles["course"]} w-full h-[90%]`}>
        <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
              <Course/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
