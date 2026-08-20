const express = require("express");

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskAnalytics
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create task
router.post("/", protect, createTask);

// Get all logged-in user's tasks
router.get("/", protect, getTasks);

// Update task
router.put("/:id", protect, updateTask);

// Delete task
router.delete("/:id", protect, deleteTask);

// Get task analytics
router.get("/analytics", protect, getTaskAnalytics);

module.exports = router;