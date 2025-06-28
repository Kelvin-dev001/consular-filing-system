import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { setToken } from "../../utils/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  function handleGoogleLogin() {
    window.location.href = "http://localhost:5000/api/auth/google";
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Paper elevation={4} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" name="email" fullWidth margin="normal"
            value={form.email} onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal"
            value={form.password} onChange={handleChange} required />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
        <Button
          color="inherit"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </Button>
      </Paper>
    </Box>
  );
}