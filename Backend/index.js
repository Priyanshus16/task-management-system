const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Database Connection
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Database connected successfully`);
  } catch (error) {
    console.error(`Problem while connecting`);
  }
};
dbConnection();

// Schemas

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
  });
  
  const User = mongoose.model("User", userSchema);


const taskSchema = new mongoose.Schema({
  title: { required: true, type: String },
  description: { required: true, type: String },
  dueDate: { type: Date },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Store user ID
});


const Task = mongoose.model("Task", taskSchema);


// Register
app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
  
      if (existingUser) return res.status(400).json({ message: "Email already exists" });
  
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user" });
    }
  });
  
  // Login
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, password });
  
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
      res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });
  

// Create New Task

app.post("/newtask", async (req, res) => {
  try {
    const { title, description, dueDate, userId } = req.body; // ✅ Get userId from request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newTask = new Task({ title, description, dueDate, userId });
    await newTask.save();
    
    res.status(200).json({ message: "Task saved successfully", task: newTask });
  } catch (error) {
    console.error("Error while saving the task:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch Data

app.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tasks = await Task.find({ userId }); // ✅ Fetch tasks only for the logged-in user
    
    res.status(200).json({ message: "Fetch successful", task: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Problem while fetching" });
  }
});


// Delete Task
app.delete("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark as Priority
app.put("/task/priority/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { priority: "High" },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Priority updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark as Completed
app.put("/task/mark-complete/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task marked as completed", task: updatedTask });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//  Get Task by ID (For Task Details)
app.get("/task/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json({ task });
    } catch (error) {
      console.error("Error while fetching task by ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
