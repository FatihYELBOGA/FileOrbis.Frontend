import React from 'react';
import {
  Box, TextField, Avatar, Typography, Grid,
  createTheme, ThemeProvider
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2150eb',
    },
    secondary: {
      main: '#ffffff',
    }
  },
  components: {
    MuiInput: {
      styleOverrides: {
        underline: {
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: "none"
          },
          "&.Mui-focused:after": {
            borderBottom: "none"
          }
        },
        root: {
          "&:hover": {

            backgroundColor: "transparent"
          },
          "&:focus": {
            backgroundColor: "transparent"
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused fieldset": {
            borderColor: "transparent"
          }
        }
      }
    }
  }
});

const Profile = (props) => 
{
  const {userInfo} = props;

  // the profile page
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, marginTop: 2, borderRadius: 2, width: '60%', marginLeft: '20%', marginRight: '20%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', marginBottom: 3 }}>
          <Avatar sx={{ width: 80, height: 80}} />
          <Typography variant="h6" component="p" sx={{ color: '#000', textAlign: 'center', textShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)', fontFamily: 'Poppins', fontWeight: 300, fontSize: '32px' }}>{userInfo.Name}</Typography>
       </Box>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6}>
            <TextField  label="Username"  value={userInfo.Username} fullWidth/>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Full Name" value={userInfo.Name}  fullWidth/>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Mail" value={userInfo.Mail} fullWidth/>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Phone" value={userInfo.PhoneNumber ?? "-"} fullWidth/>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Language" value={userInfo.Language} fullWidth/>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Two Factor Authentication" value={userInfo.TwoFactorAuthenticationDetail ?? "-"} fullWidth/>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;