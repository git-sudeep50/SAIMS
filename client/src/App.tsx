import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Body from "./components/Body";

function App() {
  return (
    <>
      <div className="app">
        <Navbar />
        <Body />
      </div>
    </>
  );
}

export default App;
