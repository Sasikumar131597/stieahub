import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box
} from '@mui/material';
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

const CTTHeader = () => {
  const navigate = useNavigate();

  return (
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
              onClick={() => navigate('/home')}
            >
              Home
            </NavButton>
            <NavButton 
              onClick={() => navigate('/about-us')}
            >
              About Us
            </NavButton>
            <NavButton 
              onClick={() => navigate('/faq')}
            >
              FAQ
            </NavButton>
            <NavButton 
              onClick={() => navigate('/contact')}
            >
              Contact
            </NavButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default CTTHeader;