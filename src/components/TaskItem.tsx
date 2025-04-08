// src/components/TaskItem.tsx
import React, { useState, useRef, useEffect } from "react";
import { Task } from "../types/task";

/**
 * @interface TaskItemProps
 * @description Props for the TaskItem component.
 */
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  /**
   * @property {(id: string, newText: string) => void} onEditTask - Callback function invoked when the task text should be updated.
   * @param {string} id - The ID of the task to edit.
   * @param {string} newText - The new text for the task.
   */
  onEditTask: (id: string, newText: string) => void;
}

/**
 * @component TaskItem
 * @description Displays a single task item with controls for completion, deletion, and editing.
 * @param {TaskItemProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered list item element.
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // Optional: Select text on focus
      // editInputRef.current.select();
    }
  }, [isEditing]);

  /**
   * Handles saving the edited task text.
   * Trims the text and calls onEditTask if the text is valid and changed.
   * Exits edit mode.
   */
  const handleSave = () => {
    const trimmedText = editText.trim();
    // Save only if text is not empty AND text has actually changed
    if (trimmedText && trimmedText !== task.text) {
      onEditTask(task.id, trimmedText);
    } else if (!trimmedText) {
      // If user deletes all text, revert.
      console.warn("Task text cannot be empty. Reverting changes.");
      setEditText(task.text);
    }
    // Exit editing mode regardless of save success if text was valid or unchanged
    setIsEditing(false);
  };

  /**
   * Handles canceling the edit operation.
   * Resets the editText state and exits edit mode.
   */
  const handleCancel = () => {
    // Reset text to original
    setEditText(task.text);
    setIsEditing(false);
  };

  /**
   * Handles key down events on the input field (Enter to save, Escape to cancel).
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  /**
   * Enters edit mode. Sets the editText initial value.
   * Only enters edit mode if the task is not completed.
   */
  const handleEditClick = () => {
    if (task.isCompleted) return;
    setEditText(task.text);
    setIsEditing(true);
  };

  return (
    <li
      className={`task-item ${task.isCompleted ? "completed" : ""} ${
        isEditing ? "editing" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggleComplete(task.id)}
        className="task-checkbox"
        aria-label={`Mark task "${task.text}" as ${
          task.isCompleted ? "incomplete" : "complete"
        }`}
        // Keep checkbox disabled while editing
        disabled={isEditing}
      />

      {isEditing ? (
        // --- Edit Mode UI ---
        <div className="edit-container">
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            // Removed onBlur={handleSave}
            className="edit-input"
            aria-label={`Edit task text for "${task.text}"`}
          />
          {/* Explicit Save/Cancel buttons */}
          <div className="edit-actions">
            <button
              onClick={handleSave}
              className="save-button"
              aria-label="Save task changes"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="cancel-button"
              aria-label="Cancel task editing"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // --- View Mode UI ---
        <>
          {/* Add conditional disabling for double-click as well if desired */}
          <span
            className={`task-text ${task.isCompleted ? "no-edit" : ""}`} // Add class if completed
            onDoubleClick={!task.isCompleted ? handleEditClick : undefined} // Disable dblclick if completed
            title={task.isCompleted ? task.text : "Double-click to edit"} // Change title if completed
          >
            {task.text}
          </span>
          <div className="task-actions">
            <button
              onClick={handleEditClick}
              className="edit-task-button"
              aria-label={`Edit task "${task.text}"`}
              // Explicitly disable button if completed
              disabled={task.isCompleted}
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="delete-task-button"
              aria-label={`Delete task "${task.text}"`}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TaskItem;
