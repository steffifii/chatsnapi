import React, { useState } from "react";
import { Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import FileUpload from "./components/FileUpload";
import Chat from "./components/Chat";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#303030",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

function App() {
  const [chatContent, setChatContent] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper
          elevation={6}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "#424242",
            color: "#fff",
          }}
        >
          <CssBaseline />
          <Container maxWidth="sm" sx={{ mt: 8 }}>
            <header className="App-header">
              {chatContent && <Chat chatContent={chatContent} />}
              <FileUpload setChatContent={setChatContent} />
            </header>
          </Container>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
