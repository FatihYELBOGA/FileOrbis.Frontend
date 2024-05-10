import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FileOrbisIcon from '../Images/icon.png'
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NewNavbar from '../NewNavbar/NewNavbar.js';
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone';
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import GroupsIcon from '@mui/icons-material/Groups';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const drawerWidth = 285;

function Navbar(props) 
{
  const { 
    userInfo,
    setUserInfo, 
    directoryPath,
    setDirectoryPath, 
    setSearchText, 
    activeMenuItem, 
    setActiveMenuItem, 
    isItemCreated, 
    setIsItemCreated, 
    setProgressBar,
    setFileName,
    setProgressValue,
    currentNavbar,
    setCurrentNavbar,
    guid,
    setGuid,
    window 
  } = props;
          
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    setActiveMenuItem(1);  
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // when the user clicks the new button, it will work
  const handleNewButtonClick = () => {
    if(currentNavbar == "My FileOrbis"){
      setNewMenuItem(true);
    } else {
      alert("new navbar is only active at 'My FileOrbis'")
    }
  }

  // when the user clicks the any menu item, it will work
  const handleMenuItemClick = (index, text) => {
    setActiveMenuItem(index);
    if(text != null){
      setDirectoryPath("");
      navigate("/" + text);
      setCurrentNavbar(text);
    }
  };

  const handleLogOut = () => {
    setUserInfo(null);
    navigate("/");
  }

  // left menu bar
  const drawer = (
    <div>
      {/* fileorbis icon */}
      <img 
        src={FileOrbisIcon} 
        alt="icon" 
        style={{ 
          width: '180px', 
          height: '100px', 
          cursor: 'pointer',
          display: 'block', 
          margin: 'auto' 
        }} 
        onClick={() => {
          setDirectoryPath("");
          navigate("/My FileOrbis");
          setCurrentNavbar("My FileOrbis")
          setActiveMenuItem(1);
        }} 
      />

      <List sx={{ marginTop: "25px" }}>
        <ListItem disablePadding id="New">
          <ListItemButton
            onClick={() => handleNewButtonClick()}
           >
            <ListItemIcon>
              <AddCircleOutlineRoundedIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="New" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      {/* my fileorbis, corporate file system, private network folders, team folders */}
      <List>
        {['My FileOrbis', 'Corporate File System', 'Private Network Folders', 'Team Folders'].map((text, index) => (
          <ListItem id={text} key={text} disablePadding>
            <ListItemButton 
              sx={{ 
                backgroundColor: activeMenuItem === index + 1 ? '#A9DDFF' : 'inherit',
                '&:hover': {
                  backgroundColor: activeMenuItem === index + 1 ? '#A9DDFF' : '#EEEEEE', 
                }
              }} 
              onClick={() => handleMenuItemClick(index + 1, text)}
            >
              <ListItemIcon>
                {
                  index === 0 ? <CloudOutlinedIcon /> : 
                  index === 1 ? <CorporateFareOutlinedIcon /> :
                  index === 2 ? <WifiOutlinedIcon /> : 
                  index === 3 ? <GroupsIcon /> : null
                }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* top white menu */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' }, 
                backgroundColor: "#A9DDFF",
                '&:hover': {
                  backgroundColor: '#356FFF'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="search-bar"
              className="text"
              label="Search in FileOrbis"
              variant="outlined"
              placeholder="Search..."
              size="small"
              sx={{ width: '600px', height: '40px', borderRadius: "100px" }}
              onChange={(e) => { setSearchText(e.target.value); }}
              InputProps={{
                endAdornment: (
                  <IconButton aria-label="search" edge="end" style={{ cursor: 'default' }}>
                    <SearchIcon style={{ fill: "blue" }} />
                  </IconButton>
                ),
              sx: { borderRadius: '25px' },
              }}
            />
          </div>
          <Typography variant="h6" noWrap component="div" sx={{color:'black'}}>
            <Link style={{ textDecoration: 'none', color: 'inherit'}} to="/profile">
              <AccountCircleOutlinedIcon fontSize='large' 
                sx={{cursor: 'pointer'}}
                onClick={() => {
                  setCurrentNavbar("profile");
                  setActiveMenuItem(null);
                }}
              />
            </Link>
            <ExitToAppTwoToneIcon fontSize='large' 
              sx={{marginLeft: "16px", cursor: 'pointer'}} 
              onClick={handleLogOut}
            />
          </Typography>
        </Toolbar>
      </AppBar>
      {/* drawer menu */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >          
          {newMenuItem ? 
            <NewNavbar 
              userInfo={userInfo}
              setActiveMenuItem={setActiveMenuItem} 
              setNewMenuItem={setNewMenuItem} 
              isItemCreated={isItemCreated} 
              setIsItemCreated={setIsItemCreated}
              setProgressBar={setProgressBar}
              setFileName={setFileName}
              setProgressValue={setProgressValue}
              directoryPath={directoryPath}
              setGuid={setGuid}
            /> : null}
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
