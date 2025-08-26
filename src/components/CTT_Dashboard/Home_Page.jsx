// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {  
//   Container, 
//   Box,  
//   CircularProgress,
//   Alert,
//   TextField, 
//   Autocomplete, 
//   Button 
// } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import CustomChart from "./CustomChart";
// import CTTHeader from "./CTT_Header";

// const HomePage = () => {
//   const navigate = useNavigate();
//   const [technologies, setTechnologies] = useState([]);
//   const [selectedTech, setSelectedTech] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTechnologies = async () => {
//       try {
//         const response = await fetch(
//           "https://development.stieahub.in/Codigniter_api/public/get_technologies"
//         );
//         if (!response?.ok) {
//           throw new Error("Failed to fetch technologies");
//         }
//         const data = await response?.json();
//         setTechnologies(data);
//       } catch (err) {
//         setError(err?.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTechnologies();
//   }, []);

//   const handleExplore = () => {
//     // if (selectedTech?.id === "21") {
//       navigate(`technology/${selectedTech.id}`);
//     // }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <CTTHeader />
//       <CustomChart />

//       <Container maxWidth="md" sx={{ py: 4 }}>
//         <Grid container spacing={2} alignItems="stretch">
//           <Grid item size={9}>
//             <Autocomplete
//               options={technologies || []}
//               getOptionLabel={(option) => option?.technology_name || ""}
//               onChange={(event, value) => setSelectedTech(value)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Search Technology"
//                   variant="outlined"
//                   fullWidth
//                  />
//               )}
//             />
//           </Grid>
//           <Grid item size={3}>
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               // disabled={!selectedTech}
//               onClick={handleExplore}
//               sx={{ height: "100%" }}
//             >
//               Explore
//             </Button>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };

// export default HomePage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  
  Container, 
  Box,  
  CircularProgress,
  Alert,
  TextField, 
  Autocomplete, 
  Button 
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CustomChart from "./CustomChart";
import CTTHeader from "./CTT_Header";

const HomePage = () => {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch(
          "https://development.stieahub.in/Codigniter_api/public/get_technologies"
        );
        if (!response?.ok) {
          throw new Error("Failed to fetch technologies");
        }
        const data = await response?.json();
        setTechnologies(data);
      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const handleExplore = () => {
    if (!selectedTech) {
      setShowError(true);
      return;
    }
    navigate(`technology/${selectedTech.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <CTTHeader />
      <CustomChart />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item size={9}>
            <Autocomplete
              options={technologies || []}
              getOptionLabel={(option) => option?.technology_name || ""}
              onChange={(event, value) => {
                setSelectedTech(value);
                setShowError(false); // reset error if selected
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Technology"
                  variant="outlined"
                  fullWidth
                  error={showError && !selectedTech}
                  helperText={showError && !selectedTech ? "Please select a technology" : ""}
                />
              )}
            />
          </Grid>
          <Grid item size={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleExplore}
              sx={{ height: "100%" }}
            >
              Explore
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;


