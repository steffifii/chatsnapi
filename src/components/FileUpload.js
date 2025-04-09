import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Paper, Container } from '@mui/material';
import JSZip from 'jszip';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [filebinId, setFilebinId] = useState('');
  const [chatContent, setChatContent] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name);

    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      console.log('Uploading to filebin.net...');
      const bin = 'your-bin-id'; // Replace with actual bin ID
      const response = await axios.post(`https://filebin.net/${bin}/${file.name}`, formData, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      console.log('Upload successful:', response);
      const location = response.headers['location'];
      const filebinId = location.replace('/', '');
      setFilebinId(filebinId);

      console.log('Extracting chat content...');
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const txtFile = Object.keys(zipContent.files).find((name) => name.endsWith('.txt'));
      const chatText = await zipContent.files[txtFile].async('text');
      setChatContent(chatText);
      console.log('Chat content extracted');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', backgroundColor: '#424242', color: '#fff' }}>
        <Typography variant="h3" gutterBottom>
          Upload Your WhatsApp Chat
        </Typography>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            color="secondary"
            sx={{ mb: 3, backgroundColor: '#ff4081', '&:hover': { backgroundColor: '#f50057' } }}
          >
            Choose File
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mb: 3 }}
        >
          Upload
        </Button>
        {filebinId && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            To share this chat with others, share www.localhost/zip={filebinId}
          </Typography>
        )}
        {chatContent && (
          <Box sx={{ mt: 4, textAlign: 'left', backgroundColor: '#333', p: 2, borderRadius: 2 }}>
            <Typography variant="h6">Chat Content:</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {chatContent}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FileUpload; 