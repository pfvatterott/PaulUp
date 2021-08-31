import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import taskView from "./pages/taskView";
import welcome from "./pages/welcome"
import CustomSideNav from "./components/CustomSideNav";
import "./App.css";

function App() {
  const { pathname } = useLocation();
  const pathway = pathname.split("/")
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      setSidebar(false)
    }
    else {
      setSidebar(true)
    }
  }, [pathname])

  return (
    <div className="App">
      { sidebar ? (<CustomSideNav></CustomSideNav>) : null }
      <Route exact path="/" component={welcome} />
      <Route exact path="/taskView" component={taskView} />
    </div>
  );
}


export default App;
