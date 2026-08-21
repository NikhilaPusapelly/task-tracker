import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // THEME
    // =========================
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // Create / Edit form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Todo");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");

    const [editingId, setEditingId] = useState(null);

    // Filters
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [sortBy, setSortBy] = useState("");

    // Analytics
    const [analytics, setAnalytics] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        completionPercentage: 0
    });

    // =========================
    // FETCH TASKS
    // =========================
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTasks(response.data.tasks || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FETCH ANALYTICS
    // =========================
    const fetchAnalytics = async () => {
        try {
            const response = await api.get("/tasks/analytics", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAnalytics({
                total: response.data.totalTasks || 0,
                completed: response.data.completedTasks || 0,
                pending: response.data.pendingTasks || 0,
                completionPercentage:
                    response.data.completionPercentage || 0
            });
        } catch (error) {
            console.log("Analytics error:", error);
        }
    };

    // =========================
    // LOAD DATA
    // =========================
    useEffect(() => {
        fetchTasks();
        fetchAnalytics();
    }, []);

    // =========================
    // CREATE / UPDATE TASK
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const taskData = {
                title,
                description,
                status,
                priority,
                dueDate
            };

            if (editingId) {
                await api.put(
                    `/tasks/${editingId}`,
                    taskData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                await api.post(
                    "/tasks",
                    taskData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            clearForm();

            await fetchTasks();
            await fetchAnalytics();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save task"
            );
        }
    };

    // =========================
    // CLEAR FORM
    // =========================
    const clearForm = () => {
        setTitle("");
        setDescription("");
        setStatus("Todo");
        setPriority("Medium");
        setDueDate("");
        setEditingId(null);
        setError("");
    };

    // =========================
    // EDIT TASK
    // =========================
    const handleEdit = (task) => {
        setEditingId(task._id);

        setTitle(task.title || "");
        setDescription(task.description || "");
        setStatus(task.status || "Todo");
        setPriority(task.priority || "Medium");

        if (task.dueDate) {
            setDueDate(task.dueDate.substring(0, 10));
        } else {
            setDueDate("");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // DELETE TASK
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await fetchTasks();
            await fetchAnalytics();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // =========================
    // SEARCH + FILTER + SORT
    // =========================
    const filteredTasks = tasks
        .filter((task) => {

            const matchesSearch =
                task.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                !filterStatus ||
                task.status === filterStatus;

            const matchesPriority =
                !filterPriority ||
                task.priority === filterPriority;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        })
        .sort((a, b) => {

            // Sort by priority
            if (sortBy === "Priority") {

                const priorityOrder = {
                    High: 3,
                    Medium: 2,
                    Low: 1
                };

                return (
                    priorityOrder[b.priority] -
                    priorityOrder[a.priority]
                );
            }

            // Sort by due date
            if (sortBy === "Due Date") {
                return (
                    new Date(a.dueDate || 0) -
                    new Date(b.dueDate || 0)
                );
            }

            // Sort alphabetically
            if (sortBy === "Title") {
                return a.title.localeCompare(b.title);
            }

            return 0;
        });

    // =========================
    // RENDER
    // =========================
    return (
        <div className={`dashboard ${darkMode ? "dark-mode" : "light-mode"}`}>

            {/* =========================
                HEADER
            ========================= */}

            <div className="header">

                <div className="theme-toggle-container">
                    <span className="theme-icon">☀️</span>

                    <label className="theme-switch">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <span className="theme-slider"></span>
                    </label>

                    <span className="theme-icon">🌙</span>
                </div>

                <h1>
                    Task Tracker Dashboard
                </h1>

                <h2>
                    Welcome, {user?.name}!
                </h2>

                <p>
                    Email: {user?.email}
                </p>

                <button
                    className="logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* =========================
                ERROR MESSAGE
            ========================= */}

            {error && (
                <div className="section error-section">
                    <p>{error}</p>
                </div>
            )}

            {/* =========================
                CREATE / EDIT TASK
            ========================= */}

            <div className="section">

                <h2>
                    {editingId
                        ? "Edit Task"
                        : "Create New Task"}
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Title */}

                    <div className="form-group">

                        <label>
                            Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Enter task title"
                            required
                        />

                    </div>

                    {/* Description */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Enter task description"
                        />

                    </div>

                    {/* Status */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >

                            <option value="Todo">
                                Todo
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Done">
                                Done
                            </option>

                        </select>

                    </div>

                    {/* Priority */}

                    <div className="form-group">

                        <label>
                            Priority
                        </label>

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                        >

                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>

                        </select>

                    </div>

                    {/* Due Date */}

                    <div className="form-group">

                        <label>
                            Due Date
                        </label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(e.target.value)
                            }
                        />

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        {editingId
                            ? "Update Task"
                            : "Create Task"}
                    </button>

                    {/* Cancel Edit */}

                    {editingId && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    )}

                </form>

            </div>

            {/* =========================
                ANALYTICS
            ========================= */}

            <div className="section">

                <h2>
                    Task Analytics
                </h2>

                <div className="analytics">

                    <div className="analytics-card">

                        <h3>
                            Total Tasks
                        </h3>

                        <p>
                            {analytics.total}
                        </p>

                    </div>

                    <div className="analytics-card">

                        <h3>
                            Completed
                        </h3>

                        <p>
                            {analytics.completed}
                        </p>

                    </div>

                    <div className="analytics-card">

                        <h3>
                            Pending
                        </h3>

                        <p>
                            {analytics.pending}
                        </p>

                    </div>

                    <div className="analytics-card">

                        <h3>
                            Completion
                        </h3>

                        <p>
                            {analytics.completionPercentage}%
                        </p>

                    </div>

                </div>

            </div>

            {/* =========================
                SEARCH / FILTER / SORT
            ========================= */}

            <div className="section">

                <h2>
                    Find Tasks
                </h2>

                <div className="filters">

                    {/* Search */}

                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {/* Status Filter */}

                    <select
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(e.target.value)
                        }
                    >

                        <option value="">
                            All Statuses
                        </option>

                        <option value="Todo">
                            Todo
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Done">
                            Done
                        </option>

                    </select>

                    {/* Priority Filter */}

                    <select
                        value={filterPriority}
                        onChange={(e) =>
                            setFilterPriority(e.target.value)
                        }
                    >

                        <option value="">
                            All Priorities
                        </option>

                        <option value="Low">
                            Low
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="High">
                            High
                        </option>

                    </select>

                    {/* Sorting */}

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value)
                        }
                    >

                        <option value="">
                            Sort By
                        </option>

                        <option value="Priority">
                            Priority
                        </option>

                        <option value="Due Date">
                            Due Date
                        </option>

                        <option value="Title">
                            Title
                        </option>

                    </select>

                    {/* Clear */}

                    <button
                        type="button"
                        className="clear-btn"
                        onClick={() => {
                            setSearch("");
                            setFilterStatus("");
                            setFilterPriority("");
                            setSortBy("");
                        }}
                    >
                        Clear Filters
                    </button>

                </div>

            </div>

            {/* =========================
                TASK LIST
            ========================= */}

            <div className="section">

                <h2>
                    Your Tasks
                </h2>

                {loading && (
                    <p>
                        Loading tasks...
                    </p>
                )}

                {!loading &&
                    filteredTasks.length === 0 && (
                        <p>
                            No tasks found.
                        </p>
                    )}

                {!loading &&
                    filteredTasks.map((task) => (

                        <div
                            className="task-card"
                            key={task._id}
                        >

                            <h3>
                                {task.title}
                            </h3>

                            <p>
                                <strong>
                                    Description:
                                </strong>{" "}
                                {task.description ||
                                    "No description"}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}
                                {task.status}
                            </p>

                            <p>
                                <strong>
                                    Priority:
                                </strong>{" "}
                                {task.priority}
                            </p>

                            <p>
                                <strong>
                                    Due Date:
                                </strong>{" "}
                                {task.dueDate
                                    ? new Date(
                                        task.dueDate
                                    ).toLocaleDateString()
                                    : "No due date"}
                            </p>

                            {/* Edit */}

                            <button
                                className="edit-btn"
                                onClick={() =>
                                    handleEdit(task)
                                }
                            >
                                Edit
                            </button>

                            {/* Delete */}

                            <button
                                className="delete-btn"
                                onClick={() =>
                                    handleDelete(task._id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))}

            </div>

        </div>
    );
}

export default Dashboard;