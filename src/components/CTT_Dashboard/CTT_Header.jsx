// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Button,
//   Container,
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
//   Typography
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { styled } from "@mui/material/styles";

// const NavButton = styled(Button)(({ theme }) => ({
//   color: "white",
//   margin: theme.spacing(0, 1),
//   "&.active": {
//     fontWeight: "bold",
//     borderBottom: "2px solid white"
//   },
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 0.1)"
//   }
// }));

// const TitleButton = styled(Button)(({ theme }) => ({
//   color: "white",
//   fontSize: "16px",
//   marginRight: theme.spacing(2),
//   "&:hover": {
//     backgroundColor: "transparent"
//   }
// }));

// const CTTHeader = () => {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);

//   const openMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const closeMenu = () => {
//     setAnchorEl(null);
//   };

//   const handleNav = (path) => {
//     navigate(path);
//     closeMenu();
//   };

//   return (
//     <AppBar position="static" sx={{ backgroundColor: "#5f6f80", mb: 3 }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters sx={{ display: "flex", alignItems: "center" }}>

//           {/* Title */}
//           <TitleButton
//             onClick={() => navigate("/ctt_dashboard")}
//             disableRipple
//             sx={{ display: { xs: "none", md: "flex" } }}
//           >
//             Critical Technology Tracker
//           </TitleButton>

//           {/* Mobile title centered */}
//           <Typography
//             variant="h6"
//             sx={{
//               flexGrow: 1,
//               display: { xs: "flex", md: "none" },
//               color: "white",
//               fontSize: "16px"
//             }}
//             onClick={() => navigate("/ctt_dashboard")}
//           >
//             CTT
//           </Typography>

//           {/* Desktop Navigation */}
//           <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
//             <NavButton onClick={() => navigate("/home")}>Home</NavButton>
//             <NavButton onClick={() => navigate("/about-us")}>About Us</NavButton>
//             <NavButton onClick={() => navigate("/faq")}>FAQ</NavButton>
//             <NavButton onClick={() => navigate("/contact")}>Contact</NavButton>
//           </Box>

//           {/* Mobile Menu Button */}
//           <IconButton
//             color="inherit"
//             sx={{ display: { xs: "flex", md: "none" } }}
//             onClick={openMenu}
//           >
//             <MenuIcon />
//           </IconButton>

//           {/* Mobile Menu Drawer */}
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={closeMenu}
//           >
//             <MenuItem onClick={() => handleNav("/home")}>Home</MenuItem>
//             <MenuItem onClick={() => handleNav("/about-us")}>About Us</MenuItem>
//             <MenuItem onClick={() => handleNav("/faq")}>FAQ</MenuItem>
//             <MenuItem onClick={() => handleNav("/contact")}>Contact</MenuItem>
//           </Menu>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };

// export default CTTHeader;


import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography
} from "@mui/material";

const CTTHeader = () => {
  const navigate = useNavigate();

  return (
    <div>
    <AppBar sx={{ backgroundColor: "#5f6f80", mb: 3 }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >

          {/* Left Side Logo */}
          <Box
            component="img"
            src="https://psa.gov.in/CMS/web/sites/default/files/common/PSA25Logo.png"
            alt="Logo"
            sx={{
              height: 50,
              cursor: "pointer"
            }}
            onClick={() => navigate("/ctt_dashboard")}
          />

          {/* Right Side Title */}
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={() => navigate("/ctt_dashboard")}
          >
            Critical Technology Tracker
          </Typography>

        </Toolbar>
      </Container>
    </AppBar>
    </div>
  );
};

export default CTTHeader;

