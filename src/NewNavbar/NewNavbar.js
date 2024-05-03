import * as React from 'react';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import './NewMenu.css'
import Button from '@mui/material/Button';
import { useState } from 'react';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import NoteAddTwoToneIcon from '@mui/icons-material/NoteAddTwoTone';
import NewFolderForm from './NewFolderForm';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewNavbar(props) {

  const {
    userInfo,
    setActiveMenuItem, 
    setNewMenuItem, 
    isItemCreated, 
    setIsItemCreated,
    directoryPath
  } = props;

  const [hovered, setHovered] = useState(null);
  const [newFolderClick, setNewFolderClick] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();
 
  const handleNewFolderMenu = () => {
    setNewFolderClick(true);
  }

  const handleFileUploadMenu = () => {
    inputRef.current.click();
  }
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
  };

  return (
    <div className="modal-new">
      <div className="modal-content-new">
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          {
            newFolderClick 
            ? 
              <NewFolderForm 
                userInfo={userInfo}
                setActiveMenuItem={setActiveMenuItem} 
                setNewFolderClick={setNewFolderClick} 
                setNewMenuItem={setNewMenuItem} 
                isItemCreated={isItemCreated} 
                setIsItemCreated={setIsItemCreated} 
                directoryPath={directoryPath}
              /> 
            :
              <MenuList>
                {/* new folder list item */}
                <MenuItem 
                  id='new-folder'
                  onClick={handleNewFolderMenu}
                  onMouseEnter={() => setHovered(0)}
                  onMouseLeave={() => setHovered(null)}
                  style={{backgroundColor: hovered === 0 ? '#e0e0e0' : 'transparent', paddingTop: '15px', paddingBottom: '15px'}}
                >
                  <ListItemIcon>
                    <CreateNewFolderTwoToneIcon/>
                  </ListItemIcon>
                  <ListItemText>New Folder</ListItemText>
                </MenuItem>
                {/* file upload list item */}
                <input
                  id='file-input'
                  type="file"
                  ref={inputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <MenuItem 
                  id='new-file'
                  onClick={handleFileUploadMenu}
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(null)}
                  style={{backgroundColor: hovered === 1 ? '#e0e0e0' : 'transparent', paddingTop: '15px', paddingBottom: '15px'}}
                >
                  <ListItemIcon>
                    <NoteAddTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText>File Upload</ListItemText>
                </MenuItem>               
                {/* Cancel button */}
                <div  style={{ display: 'flex', justifyContent: 'center', marginBottom: 5, marginTop: 12}}>
                  <Button
                    id='cancel-button'
                    type="button"
                    variant="contained"
                    onClick={() => {setNewMenuItem(false);}}
                    sx={{backgroundColor: "#878787"}}
                  >
                    Cancel
                  </Button>
                </div>
              </MenuList>
          }
        </Paper>      
      </div>
    </div>
  );
}