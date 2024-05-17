import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import BASE_URL from '../Constants/Constant.js'
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import Toolbar from '@mui/material/Toolbar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import AppBar from '@mui/material/AppBar';

// name, size, last modified date, creation date columns
const columns = [
  { id: 'name', label: 'Name', minWidth: 450 },
  {
    id: 'size',
    label: 'Size',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'last-modified',
    label: 'Last modified date',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'creation',
    label: 'Creation date',
    minWidth: 170,
    align: 'left'
  }
];

export default function MyFileOrbis(props) 
{
  const { 
    userInfo, 
    directoryPath, 
    setDirectoryPath, 
    isItemCreated,
    searchText
  } = props;  

  const [cloudItems, setCloudItems] = useState([]);
  const [loading, setLoading] = useState(null); 
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [isFile, setIsFile] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  
  // when the user clicks the path at the top (breadcrumbs), it will work
  const handleBreadCrumbs = (e) => {
    setDirectoryPath(e.target.id);
    navigate("/My FileOrbis/" + e.target.id);
  }

  const handleMainFolderNameClick = () => {
    setDirectoryPath("");
    navigate("/My FileOrbis");
  }

  async function getDownloadToken(){
    try {
      const body = JSON.stringify
      (
        {
          "requestModel": {
            "dType": 0,
            "directoryPath": directoryPath
          },
          "itemNameCollection": [
            selectedItemName
          ]
        }
      );
      const response = await fetch(BASE_URL + '/file-system/download/token/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        body: body
      });

      const data = await response.json();

      if (data.Success) {
        var token = data.Data;
        return token;
    }
     else {
      alert("Success: " + data.Success + ", Status: " + data.Status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const downloadItem = async (token) => {
    try {
      alert("the item will download now!");
      const response = await fetch(BASE_URL + '/file-system/download/token?token=' + token, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + userInfo.Token
          }
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
          
        isFile ? link.setAttribute('download', selectedItemName) : link.setAttribute('download', selectedItemName + ".zip");
          
        document.body.appendChild(link);          
        link.click();
        document.body.removeChild(link);
      } else {
        alert("HTTP status: " + response.status);
      }
    } catch (error) {
      alert("Error message: " + error);
    }
  }

  const handleRowDoubleClick = async () => {
    setClicked(false);
    if(!isFile){
      var fullPath = selectedItemName;
      if(directoryPath != ""){
        fullPath = directoryPath + "/" + selectedItemName;
      }
      setDirectoryPath(fullPath);
      navigate("/My FileOrbis/" + fullPath);
    }
  }

  const handleRowClick = (itemName, isFile) => {
    if(selectedItemName != null) { 
      if(selectedItemName != itemName){
        if(document.getElementById(selectedItemName) != null){
          document.getElementById(selectedItemName).style.backgroundColor = "";
        }
      }
    }
    if(selectedItemName != itemName){
      document.getElementById(itemName).style.backgroundColor = "#A9DDFF";
      setClicked(true);
    } 
    else {
      if(document.getElementById(itemName).style.backgroundColor != ""){
        document.getElementById(itemName).style.backgroundColor = "";
      } else {
        document.getElementById(itemName).style.backgroundColor = "#A9DDFF";
      }
      setClicked(!clicked);
    }

    setSelectedItemName(itemName);
    setIsFile(isFile);
  }

  const handleDelete = async () => {
    try {
      const body = JSON.stringify
      (
        {
          "requestModel": {
            "dType": 0,
            "directoryPath": directoryPath
          },
          "itemNameCollection": [
            selectedItemName
          ]
        }
      );
      const response = await fetch(BASE_URL + '/file-system/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        body: body
      });

      const data = await response.json();

      if(!data.Success) {
        alert("Success: " + data.Success + ", Status: " + data.Status);
      } else {
        alert("the item successfully deleted!");
        setRefresh(!refresh);
        setClicked(!clicked);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSelectedItemName(null);
      setClicked(false);
  
      try {
        const body = JSON.stringify({ "DType": 0, "DirectoryPath": directoryPath });
        const response = await fetch(BASE_URL + '/file-system/navigate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userInfo.Token
          },
          body: body
        });
  
        const data = await response.json();
  
        if (data.Success) {
          const filteredCloudItems = data.Data.CloudItems.filter(item => item.ItemName.includes(searchText));
          setCloudItems(filteredCloudItems);
        } else {
          alert("Success: " + data.Data.Success + ", Status: " + data.Data.Status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  
      setLoading(false);
    };
    fetchData();
  }, [directoryPath, isItemCreated, refresh, searchText]); 
  
  return (
    <div style={{marginTop: "25px"}}>
      {/* constant "my fileorbis" header path */}
      <Typography 
        id="my-fileorbis" 
        sx={{ fontSize: 15, display: "inline", cursor: 'pointer' }}
        onClick={() => {handleMainFolderNameClick();}}
      >
        My FileOrbis
      </Typography>
      {
        directoryPath != "" ? 
          <KeyboardArrowRightTwoToneIcon sx={{ verticalAlign: 'middle' }} /> : null
      }
      {/* create each path (breadcrumbs) */}
      {
        directoryPath.split("/").map((p, index) => {
          const eachFolderPath = directoryPath.split("/").slice(0, index+1).join("/");
          if(eachFolderPath !== ""){
            return (
              <div style={{ display: 'inline-block' }}>
                <Typography 
                  key={eachFolderPath}
                  id={eachFolderPath} 
                  onClick={handleBreadCrumbs} 
                  sx={{ fontSize: 15, display: "inline", cursor: 'pointer' }}
                >
                  {p} 
                </Typography>
                {index !== directoryPath.split("/").length - 1 && <KeyboardArrowRightTwoToneIcon sx={{ verticalAlign: 'middle'}} />}
              </div>
            )  
          }
        })
      }
      <AppBar
        position='relative'
        sx={{
          width: { sm: `calc(100%)` },
          height: 40,
          backgroundColor: "#EEEEEE",
          borderRadius: 4,
          marginTop: '15px',
          color: "black",
          justifyContent: 'center',
          marginTop: "14px",
          marginBottom: "14px"
        }}
      >   
        {
          clicked ? 
          <Toolbar sx={{ display: 'flex', alignItems: 'center'}}>
            <CloseTwoToneIcon 
              sx={{cursor:'pointer', marginRight: '10px' }} 
              onClick={()=>{
                setClicked(false);
                document.getElementById(selectedItemName).style.backgroundColor = "";
              }}
            />  
            <span style={{cursor: 'default', fontSize: 15}}>1 selected</span>
            <DownloadOutlinedIcon 
              id="download-button"
              sx={{marginLeft:'50px', marginRight: '25px', cursor:'pointer' }} 
              onClick={async () => {
                var downloadToken = await getDownloadToken();
                await downloadItem(downloadToken);
              }}
            />
            <DeleteOutlineIcon 
              id="trash-button"
              sx={{cursor:'pointer'}} 
              onClick={handleDelete}
            />
          </Toolbar> : 
          // constant "no selected item" text 
          <Toolbar sx={{ display: 'flex'}}>
            <span style={{cursor: 'default', fontSize: 15}}>no selected item</span>
          </Toolbar>
        }
      </AppBar>
      {
        loading ?
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh'
          }}
        >
          <CircularProgress />
        </Box> :
        cloudItems.length == 0 ? 
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh'
          }}
        > 
          <FolderCopyOutlinedIcon fontSize='large' />
          <Typography sx={{ fontSize: 15, marginTop: 3}}>Empty Folder</Typography>
          <Typography sx={{ fontSize: 13}}>There are no folders to choose from here</Typography>
        </Box> :  
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '400px', overflow: 'auto' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {/* create the columns */}
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ fontWeight: 'bold', backgroundColor: '#EAEAEA' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* create the cloud items */}
              {
                cloudItems.length == 0 ? <FolderCopyOutlinedIcon /> : 
                cloudItems.map((item) => {
                  return (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={item.ItemName} 
                      id={item.ItemName}  
                      onDoubleClick={handleRowDoubleClick}
                      onClick={() => {handleRowClick(item.ItemName, item.IsFile);}} 
                    >
                      {/* iterate each column and create cloud items columns under the related column */}
                      {columns.map((column) => {
                        // name column for the item
                        if(column.id === 'name'){
                          return (
                            <TableCell 
                              key={column.id} 
                              align={column.align} 
                              sx={{cursor: 'default', display: 'flex', alignItems: 'center'}}
                            >
                              {item.IsFile ? <FilePresentOutlinedIcon sx={{marginRight: 2}}/> : <FolderOutlinedIcon sx={{marginRight: 2}} /> } 
                              <span>{item.ItemName}</span>
                              {item.IsFavorited ? <StarBorderOutlinedIcon id="star-icon" sx={{marginLeft: "10px"}} fontSize='small' /> : null}
                            </TableCell>
                          );
                        }
                        // size column for the item
                        if(column.id === 'size'){
                          return (
                            <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                              {item.SizeText}
                            </TableCell>
                          );
                        }
                        // last-modified column for the item
                        if(column.id === 'last-modified'){
                          return (
                            <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                              {item.ModificationDate}
                            </TableCell>
                          );
                        }
                        // creation column for the item
                        if(column.id === 'creation'){
                          return (
                            <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                              {item.CreationDate}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
      }
    </div>  
  );
}
