import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  
  Container, 
  Box,  
  Card, 
  CardContent, 
  Typography,
  CardActionArea,
  CircularProgress,
  Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import CustomChart from "./CustomChart";
import WorldMap from "./WorldMap";
import CTTHeader from "./CTT_Header";
import PopulationPyramidChart from "./PopulationPyramidChart";

// Styled card component with fixed height and color
const SmallCard = styled(Card)(({ theme }) => ({
  height: '70px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s',
  backgroundColor: '#c9c9ee',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[4]
  }
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
});

const TechnologyName = styled(Typography)({
  fontSize: '16px',
  textAlign: 'center',
  fontWeight: '550'
});

const HomePage = () => {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch('https://development.stieahub.in/Codigniter_api/public/get_technologies');
        if (!response?.ok) {
          throw new Error('Failed to fetch technologies');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
{/* navigate(`technology/${tech?.id}`) */}
      {/* Cards Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {technologies?.map((tech) => (
            <Grid key={tech?.id} size={3}>
              <CardActionArea onClick={() => tech?.id === '21' ? navigate(`technology/${tech?.id}`):''}>
                <SmallCard>
                  <StyledCardContent>
                    <TechnologyName gutterBottom variant="h6" component="h3">
                      {tech?.technology_name}
                    </TechnologyName>
                  </StyledCardContent>
                </SmallCard>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
      </Container>
      <WorldMap />
      <PopulationPyramidChart />

    </>
  );
};

export default HomePage;