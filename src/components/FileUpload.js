import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Paper,
  Card,
  CardContent,
  Fade,
  Zoom,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  Chat,
  Phone,
  AttachFile,
  CheckCircle,
  WhatsApp,
} from "@mui/icons-material";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import { keyframes } from "@mui/system";
import SuccessModal from "./SuccessModal";
import { useNavigate } from "react-router-dom";

const cookAnimation = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const bubbleAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [folderLink, setFolderLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

      // Redirect to /view with query parameters
      navigate(
        `/view?bin=${bin}&filename=${encodeURIComponent(sanitizedFileName)}`
      );
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating chat bubbles background */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          animation: `${floatAnimation} 3s ease-in-out infinite`,
        }}
      >
        <Chat sx={{ fontSize: 40, color: "rgba(255,255,255,0.1)" }} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          animation: `${floatAnimation} 3s ease-in-out infinite 1s`,
        }}
      >
        <Phone sx={{ fontSize: 30, color: "rgba(255,255,255,0.1)" }} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "15%",
          animation: `${floatAnimation} 3s ease-in-out infinite 2s`,
        }}
      >
        <AttachFile sx={{ fontSize: 35, color: "rgba(255,255,255,0.1)" }} />
      </Box>

      {/* Main content card */}
      <Fade in timeout={1000}>
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            {/* WhatsApp icon */}
            <Zoom in timeout={800}>
              <Box sx={{ mb: 3 }}>
                <WhatsApp
                  sx={{
                    fontSize: 60,
                    color: "#25D366",
                    animation: `${pulseAnimation} 2s ease-in-out infinite`,
                  }}
                />
              </Box>
            </Zoom>

            {/* Title */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#075E54",
                mb: 2,
                background: "linear-gradient(45deg, #25D366, #128C7E)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Upload Your WhatsApp Chat
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}
            >
              Share your WhatsApp conversations in a beautiful, readable format
            </Typography>

            {/* Upload area */}
            <label htmlFor="file-upload">
              <Box
                sx={{
                  border: "2px dashed #25D366",
                  borderRadius: 3,
                  p: 4,
                  mb: 3,
                  background:
                    "linear-gradient(135deg, rgba(37,211,102,0.05) 0%, rgba(18,140,126,0.05) 100%)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#128C7E",
                    background:
                      "linear-gradient(135deg, rgba(37,211,102,0.1) 0%, rgba(18,140,126,0.1) 100%)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {file ? (
                  <Fade in timeout={500}>
                    <Box>
                      <CheckCircle
                        sx={{
                          fontSize: 50,
                          color: "#25D366",
                          mb: 2,
                          animation: `${bubbleAnimation} 0.6s ease-out`,
                        }}
                      />
                      <Typography variant="h6" sx={{ color: "#25D366", mb: 1 }}>
                        File Selected!
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {file.name}
                      </Typography>
                    </Box>
                  </Fade>
                ) : (
                  <Box>
                    <CloudUpload
                      sx={{
                        fontSize: 50,
                        color: "#25D366",
                        mb: 2,
                        animation: `${floatAnimation} 2s ease-in-out infinite`,
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "#075E54", mb: 1 }}>
                      Choose Your Chat Export
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Select a .zip file exported from WhatsApp
                    </Typography>
                  </Box>
                )}
              </Box>
            </label>

            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AttachFile />}
                  sx={{
                    borderColor: "#25D366",
                    color: "#25D366",
                    "&:hover": {
                      borderColor: "#128C7E",
                      backgroundColor: "rgba(37,211,102,0.1)",
                    },
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {file ? "Change File" : "Choose File"}
                </Button>
              </label>

              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading || !file}
                startIcon={loading ? <CircularProgress size={20} /> : <Chat />}
                sx={{
                  background: "linear-gradient(45deg, #25D366, #128C7E)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #128C7E, #075E54)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(37,211,102,0.3)",
                  },
                  "&:disabled": {
                    background: "#ccc",
                    color: "#666",
                  },
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Uploading..." : "Upload & View"}
              </Button>
            </Box>

            {/* Instructions */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                backgroundColor: "rgba(37,211,102,0.1)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#075E54", fontWeight: "medium" }}
              >
                💡 How to export your WhatsApp chat:
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                1. Open WhatsApp → Settings → Chats → Chat History → Export Chat
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                2. Choose "Without Media" and save as .zip file
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>

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
    </Box>
  );
};

export default FileUpload;
