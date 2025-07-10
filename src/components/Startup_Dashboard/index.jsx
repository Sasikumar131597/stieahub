import React from "react";
import StartUpComponent from "./StartUpComponent";
import { Outlet } from "react-router-dom";



const StartupDashboardLayout = () => {
    return (
            <>
            <Outlet />
            {/* <StartUpComponent /> */}
            </>
    );
};

export default StartupDashboardLayout;
