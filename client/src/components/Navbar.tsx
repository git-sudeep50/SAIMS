import React, { useEffect, useState } from "react";
import styles from "./css/Navbar.module.css";
import image from "../assets/react.svg";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../utils/authUtilityFunctions";
import { logout } from "../utils/authSlice";
import { useLocation } from "react-router";

const Navbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState("");
  const theme = useSelector((state: any) => state.theme.theme);
  const name = useSelector(
    (state: any) => state?.overview?.overviewData?.studentData?.name || state?.overview?.overviewData?.employee?.name
  );
  const user = useSelector((state: any) => state.auth.user);
  console.log("AUTH", user.roles.includes("STUDENT"));

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
  };
  const links: {
    id: string;
    label: string;
    icon: React.JSX.Element;
    route: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-window-stack size-5"
          viewBox="0 0 16 16"
        >
          <path d="M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M6 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
          <path d="M12 1a2 2 0 0 1 2 2 2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM2 12V5a2 2 0 0 1 2-2h9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1m1-4v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8zm12-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2z" />
        </svg>
      ),
      route: user.roles.includes("STUDENT") ? "/overview" : "/employee-overview",
    },
    ...(user.roles.includes("STUDENT") || user.roles.includes("ADVISOR")
      ? [
          {
            id: "course-registration",
            label: "Course Registration",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-book"
                viewBox="0 0 16 16"
              >
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
              </svg>
            ),
            route: user.roles.includes("STUDENT")
              ? "/course-registration"
              : "/course-approval",
          },
        ]
      : []),

    ...(user.roles.includes("STUDENT")
      ? [
          {
            id: "profile",
            label: "Profile",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-person size-5"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
              </svg>
            ),
            route: "/profile",
          },
        ]
      : []),
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-bar-chart size-5"
          viewBox="0 0 16 16"
        >
          <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z" />
        </svg>
      ),
      route: "/analytics",
    },
  ];
  if (!user) return null;
  else
    return (
      <div
        className={`${styles["main-container"]} ${
          theme === "light" ? "bg-white" : "bg-[--bg-clr]"
        }`}
      >
        <div className={`${styles.profile} flex items-center gap-4 relative`}>
          <div className={`${styles.image} rounded-2xl bg-amber-50`}>
            <img className="size-8" src={image} alt="profile-image" />
          </div>
          <h3 className={`${theme === "light" ? "text-black" : "text-white"}`}>
            {name}
          </h3>
          <button
            onClick={() => handleLogout()}
            className={`${styles.logout} absolute right-1 bg-amber-100 cursor-pointer rounded-md font-semibold`}
          >
            LOGOUT
          </button>
        </div>
        <div className={`${styles["nav-links"]} bg-[var(white)]`}>
          <h3 className="text-[var(--text-color)] font-semibold">DASHBOARDS</h3>
          <div className={styles.links}>
            {links.map((link) => (
              <Link to={link.route} key={link.id}>
                {" "}
                <button
                  key={link.id}
                  className={`${
                    styles["link-button"]
                  } whitespace-nowrap text-[var(--text-color)] cursor-pointer flex items-center gap-1
              
        ${
          activeButton === link.id || location.pathname === link.route
            ? "bg-[#B5FF57] text-black"
            : ""
        } hover:bg-[#b1d87d] hover:text-black`}
                  onClick={() => setActiveButton(link.id)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>{" "}
              </Link>
            ))}
            {user?.roles?.includes("INSTRUCTOR") && (
              <Link to={`/instructor`} key={`instructor`}>
                {" "}
                <button
                  key={`instructor`}
                  className={`${
                    styles["link-button"]
                  } whitespace-nowrap text-[var(--text-color)] cursor-pointer flex items-center gap-1
              
        ${
          activeButton === "instructor" || location.pathname === "/instructor"
            ? "bg-[#B5FF57] text-black"
            : ""
        } hover:bg-[#b1d87d] hover:text-black`}
                  onClick={() => setActiveButton("instructor")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pen"
                    viewBox="0 0 16 16"
                  >
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                  </svg>
                  <span>Instructor</span>
                </button>{" "}
              </Link>
            )}

            {user?.roles?.includes("ADMIN") && (
              <Link to={`/manage`} key={`manage`}>
                {" "}
                <button
                  key={`manage`}
                  className={`${
                    styles["link-button"]
                  } whitespace-nowrap text-[var(--text-color)] cursor-pointer flex items-center gap-1
              
        ${
          activeButton === "manage" || location.pathname === "/manage"
            ? "bg-[#B5FF57] text-black"
            : ""
        } hover:bg-[#b1d87d] hover:text-black`}
                  onClick={() => setActiveButton("manage")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pen"
                    viewBox="0 0 16 16"
                  >
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                  </svg>
                  <span>Manage</span>
                </button>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
};

export default Navbar;
