import React from "react";

/**
 * @interface AddTaskFormProps
 * @description Props for the AddTaskForm component.
 */
interface AddTaskFormProps {
  /**
   * @property {string} newTaskText - The current value of the task input field.
   */
  newTaskText: string;
  /**
   * @property {(text: string) => void} onNewTaskTextChange - Callback function triggered when the input value changes.
   * @param {string} text - The new text value from the input.
   */
  onNewTaskTextChange: (text: string) => void;
  /**
   * @property {() => void} onAddTask - Callback function triggered when the form is submitted to add a new task.
   */
  onAddTask: () => void;
}

/**
 * @component AddTaskForm
 * @description A form component for adding new tasks. Includes an input field and a submit button.
 * @param {AddTaskFormProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered form element.
 */
const AddTaskForm: React.FC<AddTaskFormProps> = ({
  newTaskText,
  onNewTaskTextChange,
  onAddTask,
}) => {
  /**
   * Handles the form submission event.
   * Prevents default page reload and calls the onAddTask prop if the input is not empty.
   * @param {React.FormEvent} event - The form submission event object.
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Only add task if the trimmed text is not empty
    if (newTaskText.trim()) {
      onAddTask();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-task-form"
      aria-label="Add new task form"
    >
      <input
        type="text"
        placeholder="Add a new task..."
        value={newTaskText}
        onChange={(e) => onNewTaskTextChange(e.target.value)}
        className="add-task-input"
        aria-label="New task text"
      />
      <button type="submit" className="add-task-button">
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
