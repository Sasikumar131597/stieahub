import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Button,
  InputAdornment,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";

import CTTHeader from "./CTT_Header";
import HamletWordCloud from "./HamletWordCloud";

import "./css/HomePage.css";   // <-- NEW CSS IMPORT
// import PublicationPatentRatio from "./PublicationPatentRatio";
// import TrendPublicationsPatents from "./TrendPublicationsPatents";

const HomePage = () => {
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [technologies, setTechnologies] = useState([]);
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedSubTech, setSelectedSubTech] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [dropdownCoords, setDropdownCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const res = await fetch(
          "https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies"
        );

        const data = await res.json();
        setTechnologies(data);
        setFilteredTechs(data);
      } catch {
        setError("Failed to fetch technologies.");
      } finally {
        setLoading(false);
      }
    };

    fetchTech();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTechs(technologies);
      return;
    }

    const lower = search.toLowerCase();

    const result = technologies
      .map((tech) => ({
        ...tech,
        sub_techs:
          tech.sub_techs?.filter((s) =>
            s.sub_tech_name.toLowerCase().includes(lower)
          ) || [],
      }))
      .filter(
        (tech) =>
          tech.technology_name.toLowerCase().includes(lower) ||
          tech.sub_techs.length > 0
      );

    setFilteredTechs(result);
  }, [search, technologies]);

  const openDropdown = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setShowDropdown(true);
  };

  useEffect(() => {
    const close = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSelectSub = (sub, tech) => {
    setSelectedTech(tech);
    setSelectedSubTech(sub);
    setSearch(sub.sub_tech_name);
    setShowDropdown(false);
  };

  const explore = () => {
    if (!selectedSubTech) {
      alert("Please select a sub-technology first!");
      return;
    }
    navigate(`/ctt_dashboard/technology/${selectedSubTech.sub_tech_id}`);
  };

  if (loading)
    return (
      <Box className="center-loader">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" className="error-alert">
        {error}
      </Alert>
    );

  return (
    <>
      <CTTHeader />

      <Box className="wc-section">
        <Box className="wc-overlay">
          {/* <HamletWordCloud /> */}
        </Box>

        <Box className="search-container">
          <Grow in timeout={500}>
            <Paper className="search-card" elevation={6}>
              <Box className="search-row">

                <TextField
                  inputRef={inputRef}
                  placeholder="Search technology or sub-technology"
                  className="search-input"
                  fullWidth
                  value={search}
                  onClick={openDropdown}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    openDropdown();
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() =>
                            showDropdown ? setShowDropdown(false) : openDropdown()
                          }
                        >
                          <span
                            className={
                              showDropdown
                                ? "dropdown-arrow rotated"
                                : "dropdown-arrow"
                            }
                          >
                            ▼
                          </span>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button variant="contained" onClick={explore} className="explore-btn">
                  EXPLORE
                </Button>
              </Box>

              {selectedSubTech && (
                <Fade in timeout={400}>
                  <Typography className="selected-text">
                    Selected: {selectedSubTech.sub_tech_name}
                  </Typography>
                </Fade>
              )}
            </Paper>
          </Grow>
        </Box>
      </Box>

      {showDropdown && (
        <Fade in timeout={200}>
          <Paper
            ref={dropdownRef}
            className="dropdown-panel"
            elevation={10}
            style={{
              top: dropdownCoords.top,
              left: dropdownCoords.left,
              minWidth: dropdownCoords.width,
            }}
          >
            <Box className="dropdown-inner">

              <Box className="tech-list">
                <List disablePadding>
                  {filteredTechs.map((tech) => (
                    <ListItemButton
                      key={tech.tech_id}
                      onMouseEnter={() => setSelectedTech(tech)}
                      selected={selectedTech?.tech_id === tech.tech_id}
                      className="list-item"
                    >
                      <ListItemText
                        primary={<Typography className="list-item-title">{tech.technology_name}</Typography>}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>

              <Box className="subtech-list">
                <Typography className="subtech-title">
                  {selectedTech ? "Select Sub-Technology" : "Hover a category"}
                </Typography>

                <List disablePadding>
                  {selectedTech?.sub_techs?.map((sub) => (
                    <ListItemButton
                      key={sub.sub_tech_id}
                      onClick={() => handleSelectSub(sub, selectedTech)}
                      selected={selectedSubTech?.sub_tech_id === sub.sub_tech_id}
                      className="list-item"
                    >
                      <ListItemText
                        primary={<Typography className="list-sub">{sub.sub_tech_name}</Typography>}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>

            </Box>
          </Paper>
        </Fade>
      )}
      
      {/* <Box className="triple-graph-row">
        <Box className="graph-col same-size">
          <h2 className="trend-title">
                  Publications and Patents Trend (2003–2023)
                </h2>
          <div className="graph-wrapper">
            <TrendPublicationsPatents />
          </div>
        </Box>

      </Box> */}


    </>
  );
};

export default HomePage;


