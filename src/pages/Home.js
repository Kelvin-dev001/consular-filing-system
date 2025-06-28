import React from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Paper elevation={4} sx={{ p: 5, minWidth: 350, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom color="primary">Welcome!</Typography>
        <Typography variant="h6" gutterBottom>
          This is your Consular Services Portal.<br />
          Please log in or register to access all features.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate("/register")}>
            Register
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}