const Task = require("../models/Task");

// Create a task
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: req.user
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get logged-in user's tasks
const getTasks = async (req, res) => {
    try {
            const { status, priority, search, sortBy, page = 1, limit = 5 } = req.query;
        const filter = {
            user: req.user
        };

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }
        if (search) {
    filter.title = {
        $regex: search,
        $options: "i"
    };
}

let sortOption = { createdAt: -1 };

if (sortBy === "dueDate") {
    sortOption = { dueDate: 1 };
}

if (sortBy === "priority") {
    sortOption = { priority: 1 };
}

const skip = (page - 1) * limit;

const tasks = await Task.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

const totalTasks = await Task.countDocuments(filter);
        res.status(200).json({
    tasks,
    currentPage: Number(page),
    totalPages: Math.ceil(totalTasks / limit),
    totalTasks
});

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            _id: id,
            user: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const { title, description, status, priority, dueDate } = req.body;

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.status = status ?? task.status;
        task.priority = priority ?? task.priority;
        task.dueDate = dueDate ?? task.dueDate;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Delete a task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
// Get task analytics
const getTaskAnalytics = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({
            user: req.user
        });

        const completedTasks = await Task.countDocuments({
            user: req.user,
            status: "Done"
        });

        const pendingTasks = totalTasks - completedTasks;

        const completionPercentage = totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            completionPercentage
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Export functions
module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskAnalytics
};