import React from "react";
import Header from "../header_sidebar_components/Header";
import { Outlet } from "react-router-dom";
import StartUpComponent from "./StartUpComponent";



const StartupDashboardLayout = () => {
    return (
            <>
            {/* <Outlet />
            <h5>Welcome</h5> */}
            <StartUpComponent />
            </>
    );
};

export default StartupDashboardLayout;
