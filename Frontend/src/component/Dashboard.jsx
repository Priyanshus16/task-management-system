import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Fab,
  Box,
  IconButton,
  Pagination
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeleteIcon from "@mui/icons-material/Delete";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DoneIcon from "@mui/icons-material/Done";

function Dashboard() {
  const navigate = useNavigate();
  const [task, setTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  const getData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dashboard/${userId}`);

      const sortedTasks = response.data.task
        ? response.data.task.sort((a, b) => {
          if (a.status !== "Completed" && b.status !== "Completed") {
            if (a.priority === "High" && b.priority !== "High") return -1;
            if (b.priority === "High" && a.priority !== "High") return 1;
          }
          if (a.status === "Completed" && b.status !== "Completed") return 1;
          if (b.status === "Completed" && a.status !== "Completed") return -1;
          return 0;
        })
        : [];

      setTask(sortedTasks);
    } catch (error) {
      console.error("Error while fetching tasks", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/task/${taskId}`);
      setTask(task.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error while deleting task", error);
    }
  };

  const handlePriorityChange = async (taskId, taskStatus) => {
    if (taskStatus === "Completed") {
      alert("You cannot change priority for completed tasks.");
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/task/priority/${taskId}`, { priority: "High" });

      setTask((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, priority: "High" } : task
        )
      );
    } catch (error) {
      console.error("Error while updating priority", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/task/mark-complete/${taskId}`);

      setTask((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: "Completed" } : task
        )
      );
    } catch (error) {
      console.error("Error while updating task status", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = task.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Task Management
        </Typography>

        <Grid container spacing={8}>
          {currentTasks.map((taskItem) => (
            <Grid item xs={12} sm={6} mt={4} mb={2} md={4} key={taskItem._id}>
              <Card
                sx={{
                  backgroundColor: taskItem.status === "Completed"
                    ? "#E3FCEF"
                    : taskItem.priority === "High"
                      ? "#E0F7FA"
                      : "#FFF3E0",
                  borderLeft: `6px solid ${taskItem.status === "Completed"
                      ? "green"
                      : taskItem.priority === "High"
                        ? "#0277BD"
                        : "orange"
                    }`,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.02)", boxShadow: 3 },
                  borderRadius: 2,
                  p: 2,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                    {taskItem.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ display: "flex", alignItems: "center", mt: 1, fontWeight: "bold" }}
                  >
                    {taskItem.status === "Completed" ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <PendingActionsIcon color="warning" sx={{ mr: 1 }} />
                    )}
                    {taskItem.status}
                  </Typography>

                  {/* Buttons for Actions */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <IconButton
                      color="success"
                      size="small"
                      onClick={() => handleCompleteTask(taskItem._id)}
                      disabled={taskItem.status === "Completed"}
                    >
                      <DoneIcon />
                    </IconButton>

                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => handlePriorityChange(taskItem._id, taskItem.status)}
                      disabled={taskItem.priority === "High"}
                    >
                      <PriorityHighIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(taskItem._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mt: 2, width: "100%" }}
                    onClick={() => navigate(`/task/${taskItem._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination Controls */}
        {task.length > tasksPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(task.length / tasksPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {/* Floating Add Task Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#115293" },
          }}
          onClick={() => navigate("/newtask")}
        >
          <AddIcon />
        </Fab>
      </Container>
    </div>
  );


}



export default Dashboard;
