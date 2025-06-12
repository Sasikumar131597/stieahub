import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import routes from "./router";
// Import Icons
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// Import Components
import Header from "./components/header_sidebar_components/Header";
import SideBar from "./components/header_sidebar_components/SideBar";
import Main from "./components/Main";
import GERD_Home from "./components/GERD_Dashboard/GERD_Home";

function App() {
  return (
    <Router>
      <Header />
      <SideBar />
      <Routes>
             {routes?.map((config) => {
          return (
            <Route path={config?.path} element={config?.element}>
              {config?.children?.map((child) => {
                return <Route path={child?.path} element={child?.element} />;
              })}
            </Route>
          );
        })}
            </Routes>
    </Router>
  );
}

export default App;
