import React from "react";
import { Outlet } from "react-router-dom";

const CTTDashboardLayout = () => {
    return (
            <>
            <Outlet />
            {/* <StartUpComponent /> */}
            </>
    );
};

export default CTTDashboardLayout;
