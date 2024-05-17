import * as React from 'react';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import './NewMenu.css'
import Button from '@mui/material/Button';
import { useState } from 'react';
import NewFolderForm from './NewFolderForm';
import { useRef } from 'react';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import BASE_URL from '../Constants/Constant.js';
import Dialog from '../Dialog/Dialog.js';

export default function NewNavbar(props) {

  const {
    userInfo,
    setActiveMenuItem, 
    setNewMenuItem, 
    setIsItemCreated,
    setSelectedFiles,
    directoryPath,
    setSelectedFilesLength,
    setIsOverwrite,
    dialogState,
    setDialogState
  } = props;

  const [hovered, setHovered] = useState(null);
  const [newFolderClick, setNewFolderClick] = useState(false);  
  const [failedUploads, setFailedUploads] = useState([]);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [modifiedFiles, setModifiedFiles] = useState([]);
  const inputRef = useRef(null);

  const handleNewFolderMenu = () => {
    setNewFolderClick(true);
  }

  const handleFileUploadMenu = () => {
    inputRef.current.click();
  }

  async function uploadControl(file) {
    try {
      const guid = uuidv4();
      const body = JSON.stringify({
        "requestModel": {
          "dType": 0,
          "directoryPath": directoryPath
        },
        "uploadItemCollection": [
          {
            "itemName": file.name,
            "itemSize": file.size,
            "itemId": guid
          }
        ]
      });

      const response = await axios.post(BASE_URL + '/file-system/upload/control', body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        }
      });

      if (response.data.Success) {
        return true;
      } else {
        return response.data.FailedItems[0].Item.SuggestedName;
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Upload control aborted');
      } else {
        console.error('Error fetching data:', error);
      }
      return false;
    }
  }

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    setCurrentFiles(files);

    const updatedFiles = [];
    const failedUploads = [];
    for (const file of files) {
        const success = await uploadControl(file);
        if (success != true) {      
          const updatedFile = new File([file], success, { type: file.type });
          updatedFiles.push(updatedFile);
          failedUploads.push(file.name);
        } else {
          updatedFiles.push(file);
        }
    }
    setModifiedFiles(updatedFiles);

    if (failedUploads.length > 0) {
      setFailedUploads(failedUploads);
      setDialogState(true);
    } else {
      setSelectedFiles(files);
      setSelectedFilesLength(0);
    }
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
                    <FolderOutlinedIcon/>
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
                  multiple={true}
                />
                <MenuItem 
                  id='new-file'
                  onClick={handleFileUploadMenu}
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(null)}
                  style={{backgroundColor: hovered === 1 ? '#e0e0e0' : 'transparent', paddingTop: '15px', paddingBottom: '15px'}}
                >
                  <ListItemIcon>
                    <FilePresentOutlinedIcon />
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
        {
          dialogState
            ? <Dialog 
                title="Overwrite Files"               
                body={
                  <>
                    Do you want to overwrite the existing files?
                    <br />
                    "{failedUploads.join(', ')}"
                  </>
                }
                dialogState={dialogState} 
                setDialogState={setDialogState} 
                setIsOverwrite={setIsOverwrite}
                setSelectedFiles={setSelectedFiles}
                setSelectedFilesLength={setSelectedFilesLength}
                currentFiles={currentFiles}
                modifiedFiles={modifiedFiles}
              />
            : null
        }
      </div>
    </div>
  );
}