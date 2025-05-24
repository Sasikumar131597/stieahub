import React from "react";
import Main from "./components/Main";
import GerdDashboardLayout from "./components/GerdDashboardLayout";
import GERD_Home from "./components/GERD_Dashboard/GERD_Home";
import PublicRnD from "./components/PublicRnD_Dashboard/PublicRnD";
import NotFoundPage from "./components/helpers/404";
import International from "./components/GERD_Dashboard/International";
import Central_Home from "./components/PublicRnD_Dashboard/CentralRnd_Dashboard/Central_Home";
import State_Home from "./components/PublicRnD_Dashboard/StateRnD_Dashboard/State_Home";

const routes = [
    { path: "/demo", element: <Main />, exact: true },
    {
        path: "/gerd_dashboard",
        element: <GerdDashboardLayout />,
        children: [
            { index: true, element: <GERD_Home /> },  // Default child for /gerd_dashboard
            { path:"international_gerd",element: <International />},
            {
                path: "public_rnd",
                element: <PublicRnD />,
                children: [
                ]
            },
            { path: "central_rnd", element: <Central_Home /> },
            {path : "state_rnd",element: <State_Home />},
        ]
    },
    { path: '*', element: <NotFoundPage /> }
];

export default routes;