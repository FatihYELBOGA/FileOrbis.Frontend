import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import BASE_URL from '../Constants/Constant.js'

function CircularProgressWithLabel(props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography fontSize={14} align="center" style={{ marginRight: '12px' }}>
        {props.fileName.length > 20 ? `${props.fileName.slice(0, 20)}...` : props.fileName}
      </Typography>
      <div style={{ padding: "10px", borderRadius: '10px', marginRight: "12px" }}>
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <CircularProgress variant="determinate" {...props} />
          <Box
            sx={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(props.value)}%`}
            </Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  fileName: PropTypes.string.isRequired,
};

export default function ProgressBar(props) {
  const { value, fileName, setProgressBar, guid, userInfo } = props;

  const handleCancel = async () => {
    setProgressBar(false);
    try {
      const body = JSON.stringify
      (
        {
          "itemId": guid
        }
      );
      const response = await fetch(BASE_URL + '/file-system/upload/abort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        body: body
      });

      const data = await response.json();

      if (data.Success) {
        alert("the file aborted successfully!");
      } else {
        alert("Success: " + data.Success + ", Status: " + data.Message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div 
      style={{ 
        border: '2px solid grey', 
        padding: '0px 12px', 
        borderRadius: '20px', 
        display: 'inline-flex', 
        marginTop: '20px',
        marginRight: '15px'
      }}
    >
      {
        value == 100 ?
        <Typography
          sx={{
            margin: "12px",
            fontSize: 14
          }}
        >
          Virus scanning is in progress...
        </Typography> :
        <>
          <CircularProgressWithLabel value={value} fileName={fileName} />
          <IconButton
            onClick={handleCancel}
            style={{ marginLeft: '10px', backgroundColor: 'white' }}
          >
            <CancelIcon />
          </IconButton>
        </>
      }
    </div>
  );
}
