import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", formData);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userName", response.data.user.name);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField fullWidth label="Email" name="email" type="email" margin="normal" onChange={handleChange} required />
          <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Button onClick={() => navigate("/signup")} variant="text">
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
