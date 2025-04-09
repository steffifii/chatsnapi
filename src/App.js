import React, { useState } from "react";
import { Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
      <CssBaseline />
      <Container>
        <Router>
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/view" element={<Chat />} />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
