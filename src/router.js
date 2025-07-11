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

// const routes = [
//     { path: "/", element: <Main />, exact: true },
//     {
//         path: "gerd_dashboard",
//         element: <GerdDashboardLayout />,
//         children: [
//             { index: true, element: <GERD_Home /> },  // Default child for /gerd_dashboard
//             { path:"international_gerd",element: <International />},
//             {
//                 path: "public_rnd",
//                 element: <PublicRnD />,
//                 // children: [
//                 // ]
//             },
//             { path: "central_rnd", element: <Central_Home /> },
//             {path : "state_rnd",element: <State_Home />},
//         ]
//     },
//     { path: '*', element: <NotFoundPage /> }
// ];



export const routes = [
  {
    path: "/",
    element:<Main />,
  }, 

  {
    path: "startup_dashboard",
    element: <StartupDashboardLayout />,
    children: [{
        path: "/startup_dashboard",
        element: <HomePageCards />,
    },
    {
        path: "industries",
        element: <IndustriesList />
    },
    {
        path: "geography",
        element: <Geographpage />
    }

    
    
    ]
  },
  {
    path: "gerd_dashboard",
    element: <GerdDashboardLayout />,
    children: [{
        path: "/gerd_dashboard",
        element: <GERD_Home />,
    },
    {
        path: "international_gerd",
        element: <International />
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
        element: <State_Home />
    }

    ]
  },
   { path: '*', element: <NotFoundPage /> },
//   {
//     path: "dashboard",
//     element: <Dashboard />,
//     children: [
//       {
//         path: "/dashboard",
//         element: (
//           <>
//           <Header />
//           <LanguageTranslation />
//           </>
//         )
//       },
//     ]    
//   },
];


export default routes;