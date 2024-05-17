import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {

  const {
    title, 
    body, 
    dialogState, 
    setDialogState, 
    setIsOverwrite,
    setSelectedFiles,
    setSelectedFilesLength,
    currentFiles,
    modifiedFiles
  } = props;

  const handleAccept = () => {
    setIsOverwrite(true);
    setDialogState(false);
    setSelectedFiles(currentFiles);
    setSelectedFilesLength(0);
  }

  const handleReject = () => {
    setIsOverwrite(false);
    setDialogState(false);
    setSelectedFiles(modifiedFiles);
    setSelectedFilesLength(0);
  };

  const handleClose = () => {
    setDialogState(false);
  }

  return (
    <React.Fragment>
      <Dialog
        open={dialogState}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {body}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccept}>ACCEPT</Button>
          <Button onClick={handleReject} autoFocus>
            REJECT
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
