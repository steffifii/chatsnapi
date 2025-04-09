import React from "react";
import { Box, Typography, Chip } from "@mui/material";

const Chat = ({ chatContent }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#111", borderRadius: 2 }}>
      {chatContent.split("\n").map((line, index) => {
        const isSender = index % 2 === 0;
        const timestamp = "12:00 AM"; // Replace with actual timestamp logic
        const dateChip = index === 0 || index % 5 === 0; // Example logic for date chip

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
