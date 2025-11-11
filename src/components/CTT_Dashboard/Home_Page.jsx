import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CTTHeader from "./CTT_Header";

const HomePage = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [technologies, setTechnologies] = useState([]);
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedSubTech, setSelectedSubTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await fetch(
          "https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies"
        );
        if (!res.ok) throw new Error("Failed to fetch technologies");
        const data = await res.json();
        setTechnologies(data || []);
        setFilteredTechs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTechs(technologies);
      return;
    }
    const lower = search.toLowerCase();
    const results = technologies
      .map((tech) => ({
        ...tech,
        sub_techs: tech.sub_techs?.filter((sub) =>
          sub.sub_tech_name.toLowerCase().includes(lower)
        ),
      }))
      .filter(
        (tech) =>
          tech.technology_name.toLowerCase().includes(lower) ||
          tech.sub_techs?.length > 0
      );
    setFilteredTechs(results);
    setShowDropdown(true);
  }, [search, technologies]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubTechSelect = (subTech, mainTech) => {
    setSelectedSubTech(subTech);
    setSelectedTech(mainTech);
    setSearch(subTech.sub_tech_name);
    setShowDropdown(false);
  };

  const handleExplore = () => {
    if (selectedSubTech) {
      navigate(`/ctt_dashboard/technology/${selectedSubTech.sub_tech_id}`);
    } else {
      alert("Please select a sub-technology first!");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <>
      <CTTHeader />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Search and Explore */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search technology or sub-technology"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onClick={() => setShowDropdown(true)} // 👈 show dropdown when clicked
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowDropdown((p) => !p)}
                    edge="end"
                    size="small"
                  >
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "18px",
                        transition: "transform 0.3s",
                        transform: showDropdown
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </span>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleExplore}
            sx={{ height: "56px", textTransform: "none" }}
          >
            Explore
          </Button>
        </Box>

        {/* Dropdown */}
        {showDropdown && filteredTechs.length > 0 && (
          <Paper
            ref={dropdownRef}
            elevation={5}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                height: 400,
              }}
            >
              {/* Left: Main Technologies */}
              <Box
                sx={{
                  width: "50%",
                  overflowY: "auto",
                  borderRight: "1px solid #e0e0e0",
                  bgcolor: "#fafafa",
                }}
              >
                <List disablePadding>
                  {filteredTechs.map((tech) => (
                    <ListItemButton
                      key={tech.tech_id}
                      onMouseEnter={() => setSelectedTech(tech)}
                      selected={selectedTech?.tech_id === tech.tech_id}
                      sx={{
                        py: 1.2,
                        px: 2,
                        "&.Mui-selected": {
                          bgcolor: "#1976d2",
                          color: "white",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: 15,
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {tech.technology_name}
                          </Typography>
                        }
                      />
                      <span style={{ marginLeft: "auto" }}>→</span>
                    </ListItemButton>
                  ))}
                </List>
              </Box>

              {/* Right: Sub-Techs */}
              <Box sx={{ width: "50%", overflowY: "auto", bgcolor: "#fff" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    p: 2,
                    fontWeight: 600,
                    color: "#555",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {selectedTech
                    ? "Select Sub-Technology"
                    : "Hover a category"}
                </Typography>
                <Divider />
                <List disablePadding>
                  {selectedTech?.sub_techs?.length > 0 ? (
                    selectedTech.sub_techs.map((sub) => (
                      <ListItemButton
                        key={sub.sub_tech_id}
                        onClick={() => handleSubTechSelect(sub, selectedTech)}
                        sx={{
                          py: 1,
                          px: 2,
                          "&:hover": { bgcolor: "#e3f2fd" },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#333",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {sub.sub_tech_name}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    ))
                  ) : (
                    <Typography sx={{ p: 2, color: "#888" }}>
                      No sub-technologies
                    </Typography>
                  )}
                </List>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default HomePage;
