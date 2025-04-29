import React,{ useState } from "react";
import styles from "./Navbar.module.css";
import image from "../assets/react.svg";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const Navbar: React.FC = () => {
  const [activeButton, setActiveButton] = useState("");
  const theme = useSelector((state: any) => state.theme.theme);
  const links:{
    id: string;
    label: string;
    icon: React.JSX.Element;
    route: string
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
      route:"/overview",
    },
    {
      id: "course-registration",
      label: "Course Registration",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-journals size-5"
          viewBox="0 0 16 16"
        >
          <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2" />
          <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0" />
        </svg>
      ),
      route:"/course-registration",
    },
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
      route:"/profile",
    },
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
      route:"/analytics",
    },
  ];
  return (
    <div className={`${styles["main-container"]} ${theme === "light" ? "bg-white" : "bg-[--bg-clr]"}`}>
      <div className={`${styles.profile} flex items-center gap-4`}>
        <div className={`${styles.image} rounded-2xl bg-amber-50`}>
          <img className="size-8" src={image} alt="profile-image" />
        </div>
        <h3 className={`${theme === "light" ? "text-black" : "text-white"}`}>Subhranandan Deka</h3>
      </div>
      <div className={`${styles["nav-links"]} bg-[var(white)]`}>
        <h3 className="text-[var(--text-color)] font-semibold">DASHBOARDS</h3>
        <div className={styles.links}>
          {links.map((link) => (
           <Link to={link.route}> <button
              key={link.id}
              className={`${styles["link-button"]} whitespace-nowrap text-[var(--text-color)] cursor-pointer flex items-center gap-1
              
        ${
          activeButton === link.id ? "bg-[#B5FF57] text-black" : ""
        } hover:bg-[#b1d87d] hover:text-black`}
              onClick={() => setActiveButton(link.id)}
            > 
              {link.icon}
              <span>{link.label}</span>
             
            </button> </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
