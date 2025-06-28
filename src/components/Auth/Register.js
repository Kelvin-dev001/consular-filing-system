import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { setToken } from "../../utils/auth";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/register", form);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Paper elevation={4} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Full Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} required />
          <TextField label="Username" name="username" fullWidth margin="normal" value={form.username} onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={form.email} onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={handleChange} required />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
        <Button color="inherit" fullWidth sx={{ mt: 1 }} onClick={() => navigate("/login")}>Already have an account? Login</Button>
      </Paper>
    </Box>
  );
}