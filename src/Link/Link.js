import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormGroup from '@mui/material/FormGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';
import BASE_URL from '../Constants/Constant.js'
import LinkURL from '../LinkURL/LinkURL.js';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';


function createData(activity, label) {
  return { activity,label };
}

const rows = [
  createData('A link was accessed', 'linkAccessed'),
  createData('A file or folder was added via a shared link', 'itemAdded'),
  createData('A file or folder was downloaded via shared link', 'itemDownloaded'),
  createData('A file was previewed via a shared link', 'itemPreviewed')
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const labelSwitch = { inputProps: { 'aria-label': 'Switch demo' } };
const labelCheckBox = { inputProps: { 'aria-label': 'Checkbox demo' } };

const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

export default function Link(props) {

  const { 
    setLinkMenu, 
    selectedItemName, 
    setClicked, 
    userInfo,
    directoryPath,
    isFile
  } = props;

  const [linkURLActive, setLinkURLActive] = useState(false);
  const [link, setLink] = useState("");

  const [linkDisclaimers, setLinkDisclaimers] = useState([]);
  const [IPAdresses, setIPAdresses] = useState([]);

  // State variables for each switch
  const [lastUsedDateActive, setLastUsedDateActive] = useState(false);
  const [passwordProtectionActive, setPasswordProtectionActive] = useState(false);
  const [IPProtectionActive, setIPProtectionActive] = useState(false);
  const [customizeNotificationActive, setCustomizeNotificationActive] = useState(false);
  const [messageActive, setMessageActive] = useState(false);
  const [staticCopyActive, setStaticCopyActive] = useState(false);
  const [linkWarningMessageTypeActive, setLinkWarningMessageTypeActive] = useState(false);

  const [instantPassword, setInstantPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [linkName, setLinkName] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadLimit, setDownloadLimit] = useState(0);
  const [uploadLimit, setUploadLimit] = useState(0);
  const [encryptionType, setEncryptionType] = useState("1");

  const [IPAdress, setIPAdress] = useState([]);

  const [linkWarningMessageType, setLinkWarningMessageType] = React.useState('');

  // State variables for date and time
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

   // State for permissions checkboxes
   const [permissions, setPermissions] = useState({
    upload: false,
    download: false,
    preview: false,
  });
  
  // State for activities of the mail & notifications
  const [activities, setActivities] = useState({
    linkAccessedOfMail: false,
    itemAddedOfMail: false,
    itemDownloadedOfMail: false,
    itemPreviewedOfMail: false,
    linkAccessedOfNotification: false,
    itemAddedOfNotification: false,
    itemDownloadedOfNotification: false,
    itemPreviewedOfNotification: false
  });

  const handleLinkWarningMessageType = (event) => {
    setLinkWarningMessageType(event.target.value);
  };

  const handleIPAdresses = (event) => {
    const {
      target: { value },
    } = event;
    setIPAdress(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handlePermissionChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.value]: event.target.checked,
    });
  };

  const calculatePermissionValue = () => {
    const { download, upload, preview } = permissions;
    if (!preview && !download && !upload) return 0;
    if (preview && !download && !upload) return 1;
    if (!preview && download && !upload) return 2;
    if (preview && download && !upload) return 3;
    if (!preview && !download && upload) return 4;
    if (preview && !download && upload) return 5;
    if (!preview && download && upload) return 6;
    if (preview && download && upload) return 7;
    return -1; // Default case if none of the above conditions match
  };

  const handleCreate = async () => {
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
          ],
          "linkSettings": {
            "name": linkName,
            "linkAuthority": calculatePermissionValue(),
            "live": staticCopyActive,
            "expirationDate": lastUsedDateActive && selectedDate!=null && selectedTime!=null ? `${dayjs(selectedDate).format('YYYY-MM-DD')}T${dayjs(selectedTime).format('HH:mm:ss')}.000Z` : '',
            "downloadLimit": permissions.download ? downloadLimit : null,
            "uploadQuota": permissions.upload ? uploadLimit * 1024 * 1024 : null,
            "mails": [],
            "phones": [],
            "encryptionType": passwordProtectionActive ? encryptionType : "1",
            "password": encryptionType == "2" ? password : null,
            "linkType": 0,
            "message": messageActive ? message : null,
            "permittedIps": IPProtectionActive ? IPAdress : null,
            "notificationSetting": customizeNotificationActive ? {
              "linkAccessed": {
                "category": 0,
                "mail": activities.linkAccessedOfMail,
                "notification": activities.linkAccessedOfNotification
              },
              "linkFilePreviewed": {
                "category": 0,
                "mail": activities.itemPreviewedOfMail,
                "notification": activities.itemPreviewedOfNotification
              },
              "linkItemDownloaded": {
                "category": 0,
                "mail": activities.itemDownloadedOfMail,
                "notification": activities.itemDownloadedOfNotification
              },
              "linkItemAdded": permissions.upload ? {
                "category": 0,
                "mail": activities.itemAddedOfMail,
                "notification": activities.itemAddedOfNotification
              } : null
            } : null
          },
          "linkDisclaimer": linkWarningMessageTypeActive ? linkWarningMessageType : null
        }
      );
      const response = await fetch(BASE_URL + '/link/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        },
        body: body
      });

      const data = await response.json();

      if (data.Success) {
        alert("link created successfully!");
        setLink(data.Data.AccessLinkCollection);
        setLinkURLActive(true);
      }
      else {
        alert("Success: " + data.Success + ", Status: " + data.Status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  };

  const handleClose = () => {
    setLinkMenu(false);
    setClicked(false);
  };

  const handleCheckboxChange = (e) => {
    setInstantPassword(e.target.checked);
    if (e.target.checked) {
      setPassword('');
      setEncryptionType("3");
    } else {
      setEncryptionType("2");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  }

  const handleLinkName = (e) => {
    setLinkName(e.target.value);
  }

  // Handler for table checkboxes
  const handleTableCheckboxChange = (event) => {
    setActivities({
      ...activities,
      [event.target.value]: event.target.checked,
    });
  };

  const getSystemConfigData = async () => {
    try {
      const response = await fetch(BASE_URL + '/app/system-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.Token
        }
      });

      const data = await response.json();

      if (data.Success) {
        setLinkDisclaimers(data.Data.Link.Disclaimer.LinkDisclaimerConfigs);
        setIPAdresses(data.Data.Link.CreationConfig.IP.Definitions);
      } else {
        alert("Success: " + data.Data.Success + ", Status: " + data.Data.Status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    setLinkName(selectedItemName);
    getSystemConfigData();
  }, []); 

  return (
    <>
    {
      linkURLActive ? 
      <LinkURL
        setClicked={setClicked}
        setLinkMenu={setLinkMenu}
        setLinkURLActive={setLinkURLActive}
        link={link}
      />
      :
      <Box
        sx={{
          position: 'relative',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          bgcolor: 'background.paper',
          boxShadow: 4,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          marginBottom: 10
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Create Link
        </Typography>
        <Divider sx={{ width: '100%', mb: 1 }} />
        <TextField
          required
          id="outlined-required"
          label="Link name"
          placeholder="Link name"
          defaultValue={selectedItemName}
          sx={{ mb: 1, width: '100%' }}
          value={linkName}
          onChange={handleLinkName}
        />
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            Permissions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {
              !isFile ? 
              <FormControlLabel
                control={<Checkbox {...labelCheckBox} value="upload" onChange={handlePermissionChange} />}
                label="upload"
              />
              : null
            }
            <FormControlLabel
              control={<Checkbox {...labelCheckBox} value="download" onChange={handlePermissionChange} />}
              label="download"
            />
            <FormControlLabel
              control={<Checkbox {...labelCheckBox} value="preview" onChange={handlePermissionChange} />}
              label="preview"
            />
          </Box>
        </Box>
        <Divider sx={{ width: '100%' }} />
        {
          permissions.download ?
          <>
            <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Typography variant="subtitle1" width={150}>
              Download Limit
            </Typography>
            <NumberInput
              min={0}
              aria-label="Demo number input"
              placeholder="Download Limit"
              value={downloadLimit}
              onChange={(event, val) => setDownloadLimit(val)}
            />
            </Box>
            <Divider sx={{ width: '100%' }} />
          </> 
          : null
        }
        {
          permissions.upload ?
          <>
            <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Typography variant="subtitle1" width={150}>
              Upload Limit - MB
            </Typography>
            <NumberInput
              min={0}
              aria-label="Demo number input"
              placeholder="Upload Limit"
              value={uploadLimit}
              onChange={(event, val) => setUploadLimit(val)}
            />
            </Box>
            <Divider sx={{ width: '100%' }} />
          </>
          : null
        }
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            Last Used Date
          </Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={lastUsedDateActive}
                onChange={(e) => setLastUsedDateActive(e.target.checked)}
              />
            }
          />
        </Box>
        {
          lastUsedDateActive ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                gap: 12
              }}
            >
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'TimePicker']}>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={(newDate) => setSelectedDate(newDate)}
                    />
                    <TimePicker
                      label="Select Time"
                      value={selectedTime}
                      onChange={(newTime) => setSelectedTime(newTime)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </>
            </Box>
          ) : null
        }
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="subtitle1">Password Protection</Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={passwordProtectionActive}
                onChange={(e) => {
                  setPasswordProtectionActive(e.target.checked);
                  if(e.target.checked){
                    setEncryptionType("2");
                  }
                }}
              />
            }
          />
        </Box>
        {passwordProtectionActive ? (
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Set direction to column
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <FormGroup
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={instantPassword}
                  onChange={handleCheckboxChange}
                />
              }
              label="Instant Password"
            />
          </FormGroup>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            disabled={instantPassword}
            sx={{
              width: '50%', // Ensure full width
              display: 'block'
            }}
          />
        </Box>
        
        ) : null}
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="subtitle1">IP Protection</Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={IPProtectionActive}
                onChange={(e) => setIPProtectionActive(e.target.checked)}
              />
            }
          />
        </Box>
        {
          IPProtectionActive
            ?
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                gap: 2
              }}
            >
              <FormControl sx={{ m: 1, width: '50%' }}>
                <InputLabel id="demo-multiple-checkbox-label">IP Adresses</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={IPAdress}
                    onChange={handleIPAdresses}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    fullWidth
                  >
                    {IPAdresses.map((item) => (
                      <MenuItem key={item.Name} value={item.Name}>
                        <Checkbox checked={IPAdress.indexOf(item.Name) > -1} />
                        <ListItemText primary={item.Name} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>    
          : null
        }
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="subtitle1">Customize Notifications</Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={customizeNotificationActive}
                onChange={(e) => setCustomizeNotificationActive(e.target.checked)}
              />
            }
          />
        </Box>
        {
          customizeNotificationActive
            ?
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Link Activities</TableCell>
                    <TableCell align="left">E-mail</TableCell>
                    <TableCell align="left">Notifications</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    index !== 1 || permissions.upload ?
                    <TableRow
                      key={row.activity}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="left">
                        {row.activity}
                      </TableCell>
                      <TableCell align="left">
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...labelCheckBox}
                              value={`${row.label}OfMail`}
                              onChange={(e) => handleTableCheckboxChange(e)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell align="left">
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...labelCheckBox}
                              value={`${row.label}OfNotification`}
                              onChange={(e) => handleTableCheckboxChange(e)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow> : null
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            : null
        }
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="subtitle1">Message</Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={messageActive}
                onChange={(e) => setMessageActive(e.target.checked)}
              />
            }
          />
        </Box>
        {
          messageActive
            ?
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <TextField
                id="standard-multiline-flexible"
                label="Link Message"
                multiline
                maxRows={5}
                variant="standard"
                placeholder="Please add a message for the link"
                sx={{
                  width: '50%', 
                }}
                value={message}
                onChange={handleMessage}
              />
            </Box>
            : null
        }
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="subtitle1">Static Copy</Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={staticCopyActive}
                onChange={(e) => setStaticCopyActive(e.target.checked)}
              />
            }
          />
        </Box>
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="subtitle1">Link Warning Message Type</Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={linkWarningMessageTypeActive}
                onChange={(e) => setLinkWarningMessageTypeActive(e.target.checked)}
              />
            }
          />
        </Box>
        {
          linkWarningMessageTypeActive
            ?
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                gap: 2
              }}
            >
              <FormControl sx={{ m: 1, width: '50%' }}>
                <InputLabel id="demo-simple-select-label">Message Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={linkWarningMessageType}
                  label="Link-Disclaimer"
                  onChange={handleLinkWarningMessageType}
                >
                  {
                    linkDisclaimers.map((linkDisclaimer) => {
                      return (
                        <MenuItem value={linkDisclaimer.Id}>
                          {linkDisclaimer.Name}
                        </MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
            </Box>    
          : null
        }
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#2B7EFF', '&:hover': { bgcolor: '#0F6DFF' } }}
            onClick={handleCreate}
          >
            Create
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#CFCFCF', color: 'gray', '&:hover': { bgcolor: '#B6B6B6' } }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    }
    </>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);

const StyledButton = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }
  & .arrow {
    transform: translateY(-1px);
  }
`,
);
