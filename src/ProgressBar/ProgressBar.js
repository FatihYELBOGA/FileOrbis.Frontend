import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import BASE_URL from '../Constants/Constant.js';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

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
  
  const { 
    file, 
    userInfo, 
    directoryPath, 
    setIsItemCreated, 
    setNewMenuItem,
    setSelectedFilesLength,
    isOverwrite
  } = props;

  const [progressValue, setProgressValue] = useState(0);
  const [guid, setGuid] = useState(null);
  const cancelTokenSource = useRef(axios.CancelToken.source());

  function generateGuid() {
    return uuidv4();
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
          formData.append("ItemName", file.name);
          formData.append("ItemId", guid);
          formData.append("ItemSize", fileSize);
          formData.append("file", chunk);
          formData.append("Overwrite", isOverwrite.toString());

          const response = await axios.post(BASE_URL + '/file-system/upload', formData, {
            headers: {
              'Authorization': 'Bearer ' + userInfo.Token
            },
            cancelToken: cancelTokenSource.current.token
          });

          if (response.data.FileSystemOperationStatus === 103) {
            return true;
          } else if (response.data.FileSystemOperationStatus !== 101) {
            alert("File System Operation Status: " + response.data.FileSystemOperationStatus + ", Status: " + response.data.Message);
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
        formData.append("ItemName", file.name);
        formData.append("ItemId", guid);
        formData.append("ItemSize", file.size);
        formData.append("file", file);
        formData.append("Overwrite", isOverwrite.toString());

        const response = await axios.post(BASE_URL + '/file-system/upload', formData, {
          headers: {
            'Authorization': 'Bearer ' + userInfo.Token
          },
          cancelToken: cancelTokenSource.current.token
        });

        if (response.data.FileSystemOperationStatus === 103) {
          setProgressValue(100);
          return true;
        } else {
          alert("File System Operation Status: " + response.data.FileSystemOperationStatus + ", Status: " + response.data.Message);
        }
      }
      return false;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Upload aborted');
      } else {
        console.error('Error fetching data:', error);
      }
      return false;
    }
  }

  async function uploadResult(guid) {
    try {
      const body = JSON.stringify({ "itemId": guid });
      const response = await axios.post(BASE_URL + '/file-system/upload/result', body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        cancelToken: cancelTokenSource.current.token
      });

      if (response.data.Success) {
        return true;
      } else {
        alert("Success: " + response.data.Success + ", Status: " + response.data.Message);
      }
      return false;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Upload result aborted');
      } else {
        console.error('Error fetching data:', error);
      }
      return false;
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleProcess = async (file) => {
    const guid = generateGuid();
    setGuid(guid);
    setNewMenuItem(false);
      setProgressValue(0);
      const isUploaded = await upload(file, guid);

      if (isUploaded) {
        setProgressValue(100);
        await delay(2500);
        const uploadDone = await uploadResult(guid);
        if (uploadDone) {
          setProgressValue(101);
          await delay(2500);
          setIsItemCreated(prevState => !prevState);
          setSelectedFilesLength(prevState => prevState + 1);
        }
      }
  };

  const handleCancel = async () => {
    try {
      cancelTokenSource.current.cancel('Operation canceled by the user.');
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
        setProgressValue(102);
        await delay(2500);
      } else {
        alert("Success: " + data.Success + ", Status: " + data.Message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSelectedFilesLength(prevState => prevState + 1);
  };

  useEffect(() => {
    handleProcess(file);
  }, []);

  return (
    <div 
      style={{ 
        border: '2px solid grey', 
        padding: '0px 12px', 
        borderRadius: '20px',
        padding: '0px 12px', 
        borderRadius: '20px', 
        display: 'inline-flex', 
        marginRight: '15px',
        marginTop: '10px'
      }}
    >
      {
        progressValue === 100 ?
        <Typography
          sx={{
            margin: "12px",
            fontSize: 14
          }}
        >
          Virus scanning is in progress...
        </Typography> :
        progressValue === 101 ?
        <Typography
          sx={{
            margin: "12px",
            fontSize: 14
          }}
        >
          The file upload completed
        </Typography> :
        progressValue === 102 ?
        <Typography
          sx={{
            margin: "12px",
            fontSize: 14
          }}
        >
          The file upload aborted
        </Typography> :
        <>
          <CircularProgressWithLabel value={progressValue} fileName={file.name} />
          <IconButton
            onClick={handleCancel}
            style={{ 
              marginLeft: '10px'
            }}
          >
            <CancelIcon />
          </IconButton>
        </>
      }
    </div>
  );
}
