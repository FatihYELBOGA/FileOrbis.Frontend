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
import { Await, useNavigate } from 'react-router-dom';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import BASE_URL from '../Constants/Constant';
import { v4 as uuidv4 } from 'uuid';

export default function NewNavbar(props) {

  const {
    userInfo,
    setActiveMenuItem, 
    setNewMenuItem, 
    isItemCreated, 
    setIsItemCreated,
    setProgressBar,
    setFileName,
    setProgressValue,
    directoryPath,
    setGuid
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

  function generateGuid() {
    return uuidv4();
  }

  async function uploadControl(file, guid){
    try {
      const body = JSON.stringify
      (
        {
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
        }
      );
      const response = await fetch(BASE_URL + '/file-system/upload/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        body: body
      });

      const data = await response.json();

      if (data.Success) {
        alert("the file will upload now!");
        return true;
      } else {
        alert("Success: " + data.Success + ", Status: " + data.Message);
      }
      return false;
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  }

  async function upload(file, guid) {
    try {
      const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB
      const fileSize = file.size;
      if (fileSize > MAX_CHUNK_SIZE) {
        const totalChunks = Math.ceil(fileSize / MAX_CHUNK_SIZE);
        let start = 0;
        let end = MAX_CHUNK_SIZE;
        for (let i = 0; i < totalChunks; i++) {
          const chunk = file.slice(start, end);
          const formData = new FormData();
          formData.append("DType", 0);
          formData.append("DirectoryPath", directoryPath);
          formData.append("FolderId", "00000000-0000-0000-0000-000000000000");
          // formData.append("ItemRelativePath", null);
          formData.append("ItemName", file.name);
          formData.append("ItemId", guid);
          formData.append("ItemSize", fileSize);
          formData.append("file", chunk);
          // formData.append("Overwrite", null);
          // formData.append("Classification", null);
  
          const response = await fetch(BASE_URL + '/file-system/upload', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + userInfo.Token
            },
            body: formData
          });
  
          const data = await response.json();
          if (data.FileSystemOperationStatus === 103) {
            setProgressValue(100);
            return true;
          } 
          else if (data.FileSystemOperationStatus !== 101) {
            alert("File System Operation Status: " + data.FileSystemOperationStatus + ", Status: " + data.Message);
            return false;
          }
  
          start = end;
          end = Math.min(start + MAX_CHUNK_SIZE, fileSize);

          const progress = ((i + 1) / totalChunks) * 100;
          setProgressValue(progress);
        }
      } else {
        const formData = new FormData();
        formData.append("DType", 0);
        formData.append("DirectoryPath", directoryPath);
        formData.append("FolderId", "00000000-0000-0000-0000-000000000000");
        // formData.append("ItemRelativePath", null);
        formData.append("ItemName", file.name);
        formData.append("ItemId", guid);
        formData.append("ItemSize", file.size);
        formData.append("file", file);
        // formData.append("Overwrite", null);
        // formData.append("Classification", null);
  
        const response = await fetch(BASE_URL + '/file-system/upload', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + userInfo.Token
          },
          body: formData
        });
  
        const data = await response.json();
        if (data.FileSystemOperationStatus === 103) {
          setProgressValue(100);
          return true;
        } 
        else {
          alert("File System Operation Status: " + data.FileSystemOperationStatus + ", Status: " + data.Message);
        }
      }
      return false;
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  }

  async function uploadResult(guid){
    try {
      const body = JSON.stringify
      (
        {
          "itemId": guid
        }
      );
      const response = await fetch(BASE_URL + '/file-system/upload/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        body: body
      });

      const data = await response.json();

      if (data.Success) {
        return true;
      } else {
        alert("Success: " + data.Success + ", Status: " + data.Message);
      }
      return false;
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    var guid = generateGuid();
    setGuid(guid);
    var canUpload = await uploadControl(file, guid);
    if(canUpload){
      setProgressValue(0);
      setNewMenuItem(false);
      setProgressBar(true);
      var isUploaded = await upload(file, guid);
      
      // to display the "virus scanning message", wait 1.5 seconds
      setTimeout(async () => {
        setProgressBar(false);
        if(isUploaded){
          var uploadDone = await uploadResult(guid);
          if(uploadDone){
            alert("The file uploaded successfully!");
            setIsItemCreated(!isItemCreated);
          }
        }
      }, 1500);
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
      </div>
    </div>
  );
}