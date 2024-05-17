import './App.css';
import Login from './Login/Login.js';
import Navbar from './Navbar/Navbar.js';
import MyFileOrbis from './MyFileOrbis/MyFileOrbis.js'
import CorporateFileSystem from './CorporateFileSystem/CorporateFileSystem.js';
import PrivateNetworkFolders from './PrivateNetworkFolders/PrivateNetworkFolders.js';
import TeamFolders from './TeamFolders/TeamFolders.js'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Profile from './Profile/Profile.js';
import ProgressBar from './ProgressBar/ProgressBar.js';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

function App() {

  const [userInfo, setUserInfo] = useState(null);
  const [directoryPath, setDirectoryPath] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [isItemCreated, setIsItemCreated] = useState(false);
  const [currentNavbar, setCurrentNavbar] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState(false); 
  const [selectedFilesLength, setSelectedFilesLength] = useState(0);
  const [isOverwrite, setIsOverwrite] = useState(null);
  const [dialogState, setDialogState] = useState(false);

  useEffect(() => {
    if (selectedFiles.length === selectedFilesLength) {
      setSelectedFiles([]);
    }
  }, [selectedFilesLength]); 

  if(userInfo == null){
    return(
      <div>
        <BrowserRouter>
          <Routes>
            <Route 
              exact path='/' 
              element={
                <Login 
                  setUserInfo={setUserInfo} 
                  setCurrentNavbar={setCurrentNavbar} 
                />
              } 
            />
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
  else {
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
            setIsItemCreated={setIsItemCreated}
            setSelectedFiles={setSelectedFiles}
            currentNavbar={currentNavbar}
            setCurrentNavbar={setCurrentNavbar}
            newMenuItem={newMenuItem}
            setNewMenuItem={setNewMenuItem}
            setSelectedFilesLength={setSelectedFilesLength}
            setIsOverwrite={setIsOverwrite}
            dialogState={dialogState}
            setDialogState={setDialogState}
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
              <Route 
                exact path={'/profile'}  
                element={
                  <Profile 
                    userInfo={userInfo.UserInfo} 
                  />
                } 
              />                                                        
            </Routes>
            {
            selectedFiles.length > 0 && (
              <Box 
                sx={{
                  position: 'relative',
                  border: '1px solid black',
                  borderRadius: 3,
                  marginTop: 5,
                  padding: 2,
                  backgroundColor: "#F6F6F6"
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    top: -20,
                    left: 10,
                    backgroundColor: 'white',
                    padding: '0 5px',
                  }}
                >
                  Uploading Details
                </Typography>

                {selectedFiles.map((file) => (
                  <ProgressBar 
                    key={file.name}
                    file={file}
                    userInfo={userInfo}
                    directoryPath={directoryPath}
                    setIsItemCreated={setIsItemCreated}
                    setNewMenuItem={setNewMenuItem}
                    setSelectedFilesLength={setSelectedFilesLength}
                    isOverwrite={isOverwrite}
                  />
                ))}
              </Box>
            )
          }
          </Box>
        </BrowserRouter>
      </Box>
    )
  }
}

export default App;
