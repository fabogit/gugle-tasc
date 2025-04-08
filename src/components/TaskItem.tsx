import React from "react";
import { Task } from "../types/task";

/**
 * @interface TaskItemProps
 * @description Props for the TaskItem component.
 */
interface TaskItemProps {
  /**
   * @property {Task} task - The task object to display.
   */
  task: Task;
  /**
   * @property {(id: string) => void} onToggleComplete - Callback function invoked when the task's completion status should be toggled.
   * @param {string} id - The ID of the task to toggle.
   */
  onToggleComplete: (id: string) => void;
  /**
   * @property {(id: string) => void} onDeleteTask - Callback function invoked when the task should be deleted.
   * @param {string} id - The ID of the task to delete.
   */
  onDeleteTask: (id: string) => void;
}

/**
 * @component TaskItem
 * @description Displays a single task item with a checkbox for completion and a delete button.
 * @param {TaskItemProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered list item element.
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
}) => {
  return (
    <li className={`task-item ${task.isCompleted ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggleComplete(task.id)}
        className="task-checkbox"
        aria-label={`Mark task "${task.text}" as ${
          task.isCompleted ? "incomplete" : "complete"
        }`}
      />
      <span className="task-text">{task.text}</span>
      <button
        onClick={() => onDeleteTask(task.id)}
        className="delete-task-button"
        aria-label={`Delete task "${task.text}"`}
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
