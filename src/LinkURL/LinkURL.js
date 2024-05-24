import React from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

export default function LinkURL(props) {
  const { 
    setClicked,
    setLinkMenu,
    setLinkURLActive,
    link
  } = props;

  const handleGoToLink = () => {
    window.open(link, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!'); // Optional: Provide user feedback
  };

  const handleClose = () => {
    //setClicked(false);
    //setLinkMenu(false);
    setLinkURLActive(false);
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300, // High zIndex to ensure it's above other elements
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '60vw',
          bgcolor: 'background.paper',
          boxShadow: 4,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8, // Changed from left to right
            color: 'gray'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mt: 1 }}>
          LINK
        </Typography>
        <Divider sx={{ width: '100%', mb: 1 }} />
        <Box
          sx={{
            width: '100%',
            p: 2,
            border: '1px solid gray',
            borderRadius: 1,
            bgcolor: '#f9f9f9',
            mb: 1
          }}
        >
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            {link}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#2B7EFF', '&:hover': { bgcolor: '#0F6DFF' } }}
            onClick={handleGoToLink}
          >
            Go to the Link
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#CFCFCF', color: 'gray', '&:hover': { bgcolor: '#B6B6B6' } }}
            onClick={handleCopyLink}
          >
            Copy the link
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
