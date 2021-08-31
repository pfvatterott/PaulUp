import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import taskView from "./pages/taskView";
import welcome from "./pages/welcome"
import CustomSideNav from "./components/CustomSideNav";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <CustomSideNav></CustomSideNav> */}
      <Route exact path="/" component={welcome} />
      <Route exact path="/taskView" component={taskView} />
    </div>
  );
}


export default App;
