import './App.css';
import Login from './Login/Login.js';
import Navbar from './Navbar/Navbar.js';
import MyFileOrbis from './MyFileOrbis/MyFileOrbis.js'
import CorporateFileSystem from './CorporateFileSystem/CorporateFileSystem.js';
import PrivateNetworkFolders from './PrivateNetworkFolders/PrivateNetworkFolders.js';
import TeamFolders from './TeamFolders/TeamFolders.js'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

function App() {

  const [userInfo, setUserInfo] = useState(null);
  const [directoryPath, setDirectoryPath] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [isItemCreated, setIsItemCreated] = useState(false);

  if(userInfo == null){
    return(
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login setUserInfo={setUserInfo} />} />
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
  else{
    return(
      <Box sx={{ display: 'flex' }}>
        <BrowserRouter>
          {/* constant navbar menu */}
          <Navbar 
            userInfo={userInfo}
            setUserInfo={setUserInfo} 
            directoryPath={directoryPath}
            setDirectoryPath={setDirectoryPath} 
            setSearchText={setSearchText} 
            activeMenuItem={activeMenuItem} 
            setActiveMenuItem={setActiveMenuItem}
            isItemCreated={isItemCreated}
            setIsItemCreated={setIsItemCreated}
          />
          {/* (box and toolbar component) it represents the remaining free space outside the navbar */}
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${285}px)` } }}
          >
            <Toolbar />
            {/* left side menu bar links */}
            <Routes>
              <Route 
                exact path={'/My FileOrbis/' + directoryPath}  
                element={
                  <MyFileOrbis 
                    userInfo={userInfo} 
                    directoryPath={directoryPath}
                    setDirectoryPath={setDirectoryPath}
                    isItemCreated={isItemCreated}
                    searchText={searchText} 
                  />
                } 
              />
              <Route 
                exact path={'/Corporate File System/' + directoryPath}  
                element={
                  <CorporateFileSystem 
                    userInfo={userInfo} 
                    directoryPath={directoryPath}
                    setDirectoryPath={setDirectoryPath}
                    searchText={searchText} 
                  />
                } 
              />
              <Route 
                exact path={'/Private Network Folders/' + directoryPath}  
                element={
                  <PrivateNetworkFolders 
                    userInfo={userInfo} 
                    directoryPath={directoryPath}
                    setDirectoryPath={setDirectoryPath}
                    searchText={searchText} 
                  />
                } 
              />            
              <Route 
                exact path={'/Team Folders/' + directoryPath}  
                element={
                  <TeamFolders 
                    userInfo={userInfo} 
                    directoryPath={directoryPath}
                    setDirectoryPath={setDirectoryPath}
                    searchText={searchText} 
                  />
                } 
              />                                    
          </Routes>
          </Box>
        </BrowserRouter>
      </Box>
    )
  }
}

export default App;
