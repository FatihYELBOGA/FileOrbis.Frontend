import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, } from 'react';
import BackgroundImage from '../Images/fileorbis_cover.jpeg';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../Constants/Constant.js'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login(props) {

  const {setUserInfo, setCurrentNavbar} = props;      

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const body = JSON.stringify({ "username": username, "password": password });

    const response = await fetch(BASE_URL + '/login', {
      headers: {
      'Content-Type': 'application/json'
      },
      method: 'POST',
      body: body
    });

    const data = await response.json();

    if(data.Success){
        setUserInfo(data.Data);
        setCurrentNavbar("My FileOrbis");
        navigate("/My FileOrbis");
    } else {
        alert(data.Message);
    }
  };

  return (
    <div style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover', 
        width: '100%',
        height: '100vh', 
        position: 'fixed', 
        top: 0,
        left: 0
    }}>

      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid black',
              borderRadius: '8px',
              backgroundColor: '#F9F9F9',
              padding: '40px',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={handleEmailChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password} 
                onChange={handlePasswordChange}
              />
              <Button
                id="signin"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, height: "40px" }}
                onClick={handleSubmit}
              >
                Sign In
              </Button>
              <Copyright sx={{ mt: 2, mb: 2 }} />
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
