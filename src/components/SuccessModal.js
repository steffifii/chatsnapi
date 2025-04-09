import React from 'react';
import { Modal, Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const SuccessModal = ({ open, onClose, folderLink, downloadLink, handleCopy }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      width: 400, 
      bgcolor: '#333', // Dark background color
      color: '#fff', // Light text color
      boxShadow: 24, 
      p: 4 
    }}>
      <Typography variant="h6" component="h2">
        Your file upload was successful!
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        To view your folder visit:
        <TextField
          fullWidth
          value={folderLink}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleCopy(folderLink)}>
                  <ContentCopyIcon sx={{ color: '#fff' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mt: 1, mb: 2, input: { color: '#fff' } }}
        />
        To share the download link:
        <TextField
          fullWidth
          value={downloadLink}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleCopy(downloadLink)}>
                  <ContentCopyIcon sx={{ color: '#fff' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mt: 1, input: { color: '#fff' } }}
        />
      </Typography>
    </Box>
  </Modal>
);

export default SuccessModal; 