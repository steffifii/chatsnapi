import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import { keyframes } from "@mui/system";
import SuccessModal from "./SuccessModal";

const cookAnimation = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
`;

const FileUpload = ({ setChatContent }) => {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [folderLink, setFolderLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    setLoading(true);
    const sanitizedFileName = file.name.replace(/\s+/g, "");
    console.log("File selected:", sanitizedFileName);

    const formData = new FormData();
    formData.append("file", file, sanitizedFileName);

    try {
      console.log("Uploading to filebin.net...");
      const bin = uuidv4(); 
      const response = await axios.post(
        `https://filebin.net/${bin}/${sanitizedFileName}`,
        formData,
        {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        }
      );

      console.log("Upload successful:", response);
      setUploadSuccess(true);
      const binId = response.data.bin.id;
      const filename = response.data.file.filename;
      setFolderLink(`https://filebin.net/${binId}`);
      setDownloadLink(
        `https://filebin.net/${binId}/${encodeURIComponent(filename)}`
      );

      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const txtFile = Object.keys(zipContent.files).find((name) =>
        name.endsWith(".txt")
      );
      const chatText = await zipContent.files[txtFile].async("text");
      setChatContent(chatText);
      console.log("Chat content extracted");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(`Missing filename request header: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleCloseSnackbar = () => {
    setError("");
  };

  const handleCloseDialog = () => {
    setUploadSuccess(false);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Upload Your WhatsApp Chat
      </Typography>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          color="secondary"
          sx={{
            mb: 3,
            backgroundColor: "#ff4081",
            "&:hover": { backgroundColor: "#f50057" },
          }}
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
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      <SuccessModal
        open={uploadSuccess}
        onClose={handleCloseDialog}
        folderLink={folderLink}
        downloadLink={downloadLink}
        handleCopy={handleCopy}
      />
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ animation: `${cookAnimation} 1s ease-in-out` }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileUpload;
