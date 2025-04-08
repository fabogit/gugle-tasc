import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task } from "./types/task";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import { useTheme } from "./hooks/useTheme";
import "./App.css";

/**
 * @constant {string} TASKS_STORAGE_KEY
 * @description Key used to store the tasks array in localStorage.
 */
const TASKS_STORAGE_KEY = "gugleTascTasks";

/**
 * @component App
 * @description The main application component. Manages the list of tasks,
 * the theme, and renders the UI structure. Handles persistence via localStorage.
 * @returns The rendered application container.
 */
function App() {
  // --- Theme Management ---
  const [themePreference, setThemePreference] = useTheme();

  // --- Task Management ---
  /**
   * @state tasks - An array containing all the task objects.
   * Initialized by loading from localStorage or defaulting to an empty array.
   * @state setTasks - Function to update the tasks array.
   */
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load initial tasks from localStorage during component initialization
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage:", error);
    }
    // Default to empty array if nothing is stored or parsing fails
    return [];
  });

  /**
   * @state newTaskText - Stores the current text entered in the add task input field.
   * @state setNewTaskText - Function to update the new task text.
   */
  const [newTaskText, setNewTaskText] = useState<string>("");

  // --- Effect to SAVE tasks to localStorage whenever the 'tasks' state changes ---
  useEffect(
    () => {
      try {
        // console.log("Saving tasks:", tasks);
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error);
      }
    },
    // Dependency array: This effect runs only when 'tasks' changes
    [tasks]
  );

  // --- Task Handler Functions ---

  /**
   * Creates a new task object and adds it to the tasks state array.
   * Generates a unique ID using uuid. Clears the input field afterwards.
   * Does nothing if the input text is empty or only whitespace.
   */
  const handleAddTask = () => {
    const trimmedText = newTaskText.trim();
    if (!trimmedText) return;
    const newTask: Task = {
      id: uuidv4(),
      text: trimmedText,
      isCompleted: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskText("");
  };

  /**
   * Toggles the `isCompleted` status of a task identified by its ID.
   * Creates a new array with the updated task.
   * @param {string} id - The ID of the task to toggle.
   */
  const handleToggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  /**
   * Removes a task identified by its ID from the tasks state array.
   * Creates a new array excluding the deleted task.
   * @param {string} id - The ID of the task to delete.
   */
  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };
  // --- End Handlers ---

  // --- JSX Rendering ---
  return (
    <div className="app-container">
      {/* Theme Selector */}
      <div className="theme-selector">
        <label htmlFor="theme-select">Theme:</label>
        <select
          id="theme-select"
          value={themePreference}
          onChange={(e) =>
            setThemePreference(e.target.value as "light" | "dark" | "system")
          }
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      <h1>Google Tasks Clone</h1>

      {/* Add Task Form */}
      <AddTaskForm
        newTaskText={newTaskText}
        onNewTaskTextChange={setNewTaskText}
        onAddTask={handleAddTask}
      />

      {/* Task List Display */}
      <div className="task-list-container">
        <h2>My Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one!</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;
