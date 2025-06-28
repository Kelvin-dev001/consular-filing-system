import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Paper elevation={4} sx={{ p: 5, minWidth: 350, textAlign: "center" }}>
        <Typography variant="h2" color="error" gutterBottom>404</Typography>
        <Typography variant="h6" gutterBottom>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Paper>
    </Box>
  );
}