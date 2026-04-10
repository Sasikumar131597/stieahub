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
    <div style={{marginBottom: "55x"}}> 
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

