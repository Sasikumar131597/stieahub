import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Button, 
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

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: theme.spacing(0, 1),
  '&.active': {
    fontWeight: 'bold',
    borderBottom: '2px solid white'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

// Styled title button
const TitleButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontSize: '16px',
  marginRight: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'transparent'
  }
}));

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
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#5f6f80', mb: 3 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Left side - Title */}
            <TitleButton 
              onClick={() => navigate('/ctt_dashboard')}
              disableRipple
            >
              Critical Technology Tracker
            </TitleButton>
            
            {/* Right side - Navigation buttons */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <NavButton 
                onClick={() => navigate('')}
              >
                Home
              </NavButton>
              <NavButton 
                onClick={() => navigate('')}
              >
                About Us
              </NavButton>
              <NavButton 
                onClick={() => navigate('')}
              >
                FAQ
              </NavButton>
              <NavButton 
                onClick={() => navigate('')}
              >
                Contact
              </NavButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
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

    </>
  );
};

export default HomePage;