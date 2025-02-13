import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/register", formData);
            alert("Signup successful. Please login.");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Error signing up");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSignup}>
                    <TextField fullWidth label="Name" name="name" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Email" name="email" type="email" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} required />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Sign Up
                    </Button>
                </form>
                <Typography align="center" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <Button onClick={() => navigate("/")} variant="text">
                        Login
                    </Button>
                </Typography>
            </Paper>
        </Container>
    );
}

export default Signup;
