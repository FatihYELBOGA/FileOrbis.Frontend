import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import "./NewFolderForm.css"
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../Constants/Constant';

function NewFolderForm(props) {

  const {
    userInfo,
    setActiveMenuItem, 
    setNewFolderClick, 
    setNewMenuItem, 
    isItemCreated, 
    setIsItemCreated,
    directoryPath
  } = props

  const [newFolderName, setNewFolderName] = useState("Untitled folder");
  const navigate = useNavigate();
  
  const handleChange = (event) => {
    setNewFolderName(event.target.value);
  };

  const handleCancelClick = () => {
    setNewFolderClick(false);
  }

  const handleOKClick = async () => {
    try {
      const body = JSON.stringify(
        {
          "requestModel": {
            "dType": 0,
            "directoryPath": directoryPath
          },
          "itemName": newFolderName
        }
      );
      const response = await fetch(BASE_URL + '/file-system/create/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        body: body
      });

      const data = await response.json();

      if (data.Success) {
        alert("the folder was successfully added!");
        setNewMenuItem(false);

        // change createdFolder value
        if(isItemCreated){
          setIsItemCreated(false);
        }
        else{
          setIsItemCreated(true);
        } 
        
        setActiveMenuItem(1);
        navigate("/My FileOrbis/" + directoryPath);
      } else {
        alert("Success: " + data.Success + ", Status: " + data.Message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 1
          }}
        >
          {/* Rename header */}
          <Typography component="h1" variant="h5">
            Create folder
          </Typography>
          {/* new name text field */}
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="new-folder-text"
              label="New folder"
              name="newfolder"
              autoFocus
              value={newFolderName}
              onChange={handleChange}
            />
            {/* align the buttons (Cancel and OK buttons) */}
            <Box
              noValidate
              sx={{ 
                mt: 1,
                display: 'flex',
                gap: 25, // space between butons
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              {/* Cancel button */}
              <Button
                id="cancel-button"
                type="button"
                variant="contained"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              {/* OK button */}
              <Button
                id='OK-button'
                type="button"
                variant="contained"
                onClick={handleOKClick}
              >
                OK
              </Button>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default NewFolderForm;
