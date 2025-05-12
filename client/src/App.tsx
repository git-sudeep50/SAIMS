import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import { useSelector } from "react-redux";
import Auth  from "./components/Auth";

function App() {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  return (
    <>
      <div className="app">
        {isAuthenticated ? (
          <>
            <Navbar />
            <Body />
          </>
        ) : (
          <Auth />
        )}
      </div>
    </>
  );
}

export default App;
