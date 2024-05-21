import React, { useState } from 'react';
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

function createData(activity) {
  return { activity };
}

const rows = [
  createData('A link was accessed'),
  createData('A file or folder was downloaded via shared link'),
  createData('A file was viewed via a shared link'),
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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott'
];

const labelSwitch = { inputProps: { 'aria-label': 'Switch demo' } };
const labelCheckBox = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function Link(props) {

  const { setLinkMenu, selectedItemName } = props;

  // State variables for each switch
  const [lastUsedDateActive, setLastUsedDateActive] = useState(false);
  const [passwordProtectionActive, setPasswordProtectionActive] = useState(false);
  const [IPProtectionActive, setIPProtectionActive] = useState(false);
  const [customizeNotificationActive, setCustomizeNotificationActive] = useState(false);
  const [messageActive, setMessageActive] = useState(false);
  const [staticCopyActive, setStaticCopyActive] = useState(false);
  const [PGBEncryptionActive, setPGBEncryptionActive] = useState(false);
  const [linkWarningMessageTypeActive, setLinkWarningMessageTypeActive] = useState(false);

  const [instantPassword, setInstantPassword] = useState(false);
  const [password, setPassword] = useState('');

  const [personName, setPersonName] = useState([]);

  // State to track selected checkboxes in the table
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleCreate = () => {
    console.log(lastUsedDateActive);
    console.log(passwordProtectionActive);
    console.log(IPProtectionActive);
    console.log(customizeNotificationActive);
    console.log(messageActive);
    console.log(staticCopyActive);
    console.log(PGBEncryptionActive);
    console.log(linkWarningMessageTypeActive);
    console.log('Selected activities:', selectedActivities);
  };

  const handleClose = () => {
    setLinkMenu(false);
  };

  const handleCheckboxChange = (e) => {
    setInstantPassword(e.target.checked);
    if (e.target.checked) {
      setPassword('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handler for table checkboxes
  const handleTableCheckboxChange = (event, activity) => {
    const isChecked = event.target.checked;
    setSelectedActivities((prevSelected) =>
      isChecked
        ? [...prevSelected, activity]
        : prevSelected.filter((item) => item !== activity)
    );
  };

  return (
    <>
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
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            Permissions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControlLabel
              control={<Checkbox {...labelCheckBox} value="upload" />}
              label="upload"
            />
            <FormControlLabel
              control={<Checkbox {...labelCheckBox} value="download" />}
              label="download"
            />
            <FormControlLabel
              control={<Checkbox {...labelCheckBox} value="preview" />}
              label="preview"
            />
          </Box>
        </Box>
        <Divider sx={{ width: '100%' }} />
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker label="Basic date picker" />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']}>
                  <TimePicker label="Basic time picker" />
                </DemoContainer>
              </LocalizationProvider>
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
                onChange={(e) => setPasswordProtectionActive(e.target.checked)}
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
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    fullWidth
                  >
                    {names.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={personName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
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
                  {rows.map((row) => (
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
                              value="email"
                              onChange={(e) => handleTableCheckboxChange(e, `${row.activity} - Email`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell align="left">
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...labelCheckBox}
                              value="notification"
                              onChange={(e) => handleTableCheckboxChange(e, `${row.activity} - Notification`)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
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
          <Typography variant="subtitle1">PGB Encryption</Typography>
          <FormControlLabel
            control={
              <Switch
                {...labelSwitch}
                checked={PGBEncryptionActive}
                onChange={(e) => setPGBEncryptionActive(e.target.checked)}
              />
            }
          />
        </Box>
        {PGBEncryptionActive ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <FormGroup
              sx={{
                display: 'flex',
                flexDirection: 'column', // Ensure elements are stacked vertically
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%' // Ensure full width
              }}
            >
              <FormControl sx={{ m: 1, width: '50%'}}>
                <InputLabel id="demo-multiple-checkbox-label">Bit Types</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Bit Types" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                  fullWidth // Ensure the dropdown takes full width
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={personName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                name="Encryption Password"
                label="Encryption Password"
                type="password"
                id="encryption-password"
                autoComplete="encryption-password"
                sx={{
                  width: '50%',
                  display: 'block',
                  mt: 2 // Optional: Add margin top if needed for spacing
                }}
              />
            </FormGroup>
          </Box>
        ) : null}
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
                <InputLabel id="demo-multiple-checkbox-label">Message Type</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    fullWidth
                  >
                    {names.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={personName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
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
    </>
  );
}
