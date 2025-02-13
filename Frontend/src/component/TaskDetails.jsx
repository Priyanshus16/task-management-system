import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardContent, CircularProgress, Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:4000/task/${id}`)
      .then((response) => {
        setTask(response.data.task);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching task details", error);
        setLoading(false);
      });
  }, [id]);

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      {/* Back Button */}
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        onClick={() => navigate(-1)}
      >
        Back to Dashboard
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      ) : task ? (
        <Card
          sx={{
            p: 3,
            boxShadow: 5,
            borderRadius: 3,
            backgroundColor: task.status === "Completed" ? "#E3FCEF" : "#FFF3E0",
            borderLeft: `8px solid ${task.status === "Completed" ? "green" : "orange"}`,
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic", color: "gray" }}>
              {task.description}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                mt: 2,
                color: task.status === "Completed" ? "green" : "orange",
              }}
            >
              {task.status === "Completed" ? (
                <CheckCircleIcon sx={{ mr: 1, color: "green" }} />
              ) : (
                <PendingActionsIcon sx={{ mr: 1, color: "orange" }} />
              )}
              {task.status}
            </Typography>

            {/* Due Date */}
            {task.dueDate && (
              <Typography variant="subtitle1" sx={{ mt: 2, color: "gray" }}>
                📅 Due Date: {new Date(task.dueDate).toDateString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" color="error">
          Task not found!
        </Typography>
      )}
    </Container>
  );
}

export default TaskDetails;
