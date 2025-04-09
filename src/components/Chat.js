import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Chat = () => {
  const location = useLocation();
  const [chatContent, setChatContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const bin = queryParams.get("bin");
    const filename = queryParams.get("filename") || "";

    if (bin && filename) {
      console.log(
        `Fetching chat content for bin: ${bin}, filename: ${filename}`
      );

      // Make API call to fetch the file
      axios
        .get(`https://filebin.net/${bin}/${filename}`, { responseType: "blob" }) // Set responseType to 'blob'
        .then((response) => {
          console.log("API response:", response);
          // Create a URL for the blob and download it
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = filename; // Set the filename for download
          document.body.appendChild(a);
          a.click();
          a.remove();
          setChatContent("File downloaded successfully.");
        })
        .catch((error) => {
          console.error("Error fetching chat content:", error);
          setError("Failed to fetch chat content.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const extractName = (filename) => {
    if (!filename) return "Unknown";
    const match = filename.match(/WhatsAppChat-(.*?)(\(\d+\))?\.zip/);
    if (match && match[1]) {
      return match[1].replace(/([A-Z])/g, " $1").trim();
    }
    return "Unknown";
  };

  const profileName = extractName(location.search.split("filename=")[1]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatTimestamp = (index) => {
    return index % 2 === 0 ? "12:00 AM" : "12:01 AM";
  };

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#111", borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{
            mr: 2,
            width: 56,
            height: 56,
            backgroundColor: "#ccc",
          }}
        />
        <Typography variant="h6" sx={{ color: "#fff" }}>
          {profileName}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ color: "#fff" }}>
        {chatContent}
      </Typography>

      {chatContent?.split("\n").map((line, index) => {
        const isSender = index % 2 === 0;
        const timestamp = formatTimestamp(index);
        const dateChip = index === 0 || index % 5 === 0;

        return (
          <React.Fragment key={index}>
            {dateChip && (
              <Box sx={{ textAlign: "center", mb: 1 }}>
                <Chip
                  label={formatDate("2023-03-31")}
                  sx={{ backgroundColor: "#555", color: "#fff" }}
                />
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: isSender ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  maxWidth: "70%",
                  backgroundColor: isSender ? "#005c4b" : "#202c33",
                  color: "#fff",
                  borderRadius: 2,
                  textAlign: "left",
                  position: "relative",
                }}
              >
                <Typography variant="body2">{line}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 8,
                    color: "#ccc",
                    fontSize: "0.75rem",
                  }}
                >
                  {timestamp}
                </Typography>
              </Box>
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default Chat;
