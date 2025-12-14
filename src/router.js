import React from "react";
import Main from "./components/Main";
import GerdDashboardLayout from "./components/GerdDashboardLayout";
import GERD_Home from "./components/GERD_Dashboard/GERD_Home";
import PublicRnD from "./components/PublicRnD_Dashboard/PublicRnD";
import NotFoundPage from "./components/helpers/404";
import International from "./components/GERD_Dashboard/International";
import Central_Home from "./components/PublicRnD_Dashboard/CentralRnd_Dashboard/Central_Home";
import State_Home from "./components/PublicRnD_Dashboard/StateRnD_Dashboard/State_Home";
import StartupDashboardLayout from "./components/Startup_Dashboard";
import IndustriesList from "./components/Startup_Dashboard/IndustriesList";
import HomePageCards from "./components/Startup_Dashboard/HomePageCards";
import Geographpage from "./components/Startup_Dashboard/Geographpage";
import CTTDashboardLayout from "./components/CTT_Dashboard";
import HomePage from "./components/CTT_Dashboard/Home_Page";
import TechnologyPage from "./components/CTT_Dashboard/TechnologyPage";
import Publications from "./components/CTT_Dashboard/Publications";
import Patents from "./components/CTT_Dashboard/Patents";


export const routes = [
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "ctt_dashboard",
    element: <CTTDashboardLayout />,
    children: [
      {
        path: "/ctt_dashboard",
        element: <HomePage />,
      },
      {
        path: "technology/:sub_tech_id",
        element: <TechnologyPage />
      },
      {
        path: "publications/:sub_tech_id",
        element: <Publications />
      },
      {
        path: "patents/:sub_tech_id",
        element: <Patents />
      },
    ],
  },
  {
    path: "startup_dashboard",
    element: <StartupDashboardLayout />,
    children: [
      {
        path: "/startup_dashboard",
        element: <HomePageCards />,
      },
      {
        path: "industries",
        element: <IndustriesList />,
      },
      {
        path: "geography",
        element: <Geographpage />,
      },
    ],
  },
  {
    path: "gerd_dashboard",
    element: <GerdDashboardLayout />,
    children: [
      {
        path: "/gerd_dashboard",
        element: <GERD_Home />,
      },
      {
        path: "international_gerd",
        element: <International />,
      },
      {
        path: "public_rnd",
        element: <PublicRnD />,
      },
      {
        path: "central_rnd",
        element: <Central_Home />,
      },
      {
        path: "state_rnd",
        element: <State_Home />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
 
];

export default routes;
