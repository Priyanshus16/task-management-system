import React,{useState} from 'react'
import Header from './Header'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from "@mui/material";

function AddNewTaks() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
    })

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("userId"); // ✅ Get userId from localStorage
            const taskData = { ...formData, userId }; // ✅ Include userId in request
            await axios.post("http://localhost:4000/newtask", taskData);
            console.log("API call successful");
            navigate("/dashboard");
        } catch (error) {
            console.error("There is a problem while API call");
        }
    };
    


    return (
        <div>
            <Header />
            <Container maxWidth="sm">
                <Box
                    sx={{
                        mt: 5,
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: "white",
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                        Create New Task
                    </Typography>
                    <form>
                        <TextField
                            fullWidth
                            label="Title"
                            name='title'
                            variant="outlined"
                            margin="normal"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <TextField 
                            fullWidth
                            name='description'
                            label="Description"
                            value={formData.description}
                            variant="outlined"
                            margin="normal"
                            onChange={handleChange}
                            multiline
                            rows={6}
                        />
                        <TextField
                            fullWidth
                            label="Due date"
                            name='dueDate'
                            value={formData.dueDate}
                            type="date"
                            variant="outlined"
                            margin="normal"
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                        
                        
                    </form>
                </Box>
            </Container>

        </div>
    )
}

export default AddNewTaks
