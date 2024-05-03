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

  const getToken = async () => {
    try {
      const body = JSON.stringify
      (
        {
          "model": {
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
      return data.Success;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } 

 
  const handleRowDoubleClick = async () => {
    if(!isFile){
      var fullPath = selectedItemName;
      if(directoryPath != ""){
        fullPath = directoryPath + "/" + selectedItemName;
      }
      setDirectoryPath(fullPath);
      navigate("/My FileOrbis/" + fullPath);
    } else {
      // firstly, get the token of the file
      // secondly, get the bytes of the file with this token
      var token = getToken();
    }
  }

  const handleRowClick = (itemName, isFile) => {
    setSelectedItemName(itemName);
    setIsFile(isFile);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
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
          setCloudItems(data.Data.CloudItems);
        } else {
          alert("Success: " + data.Data.Success + ", Status: " + data.Data.Status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  
      setLoading(false);
    };
    fetchData();
  }, [directoryPath, isItemCreated]); 
  
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
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "25px" }}>
        <TableContainer sx={{ maxHeight: 480 }}>
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
