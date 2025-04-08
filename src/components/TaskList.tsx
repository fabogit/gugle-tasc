import React from "react";
import { Task } from "../types/task";
import TaskItem from "./TaskItem";

/**
 * @interface TaskListProps
 * @description Props for the TaskList component.
 */
interface TaskListProps {
  /**
   * @property {Task[]} tasks - An array of task objects to display.
   */
  tasks: Task[];
  /**
   * @property {(id: string) => void} onToggleComplete - Callback function passed down to TaskItem for toggling completion.
   * @param {string} id - The ID of the task to toggle.
   */
  onToggleComplete: (id: string) => void;
  /**
   * @property {(id: string) => void} onDeleteTask - Callback function passed down to TaskItem for deleting a task.
   * @param {string} id - The ID of the task to delete.
   */
  onDeleteTask: (id: string) => void;
}

/**
 * @component TaskList
 * @description Renders a list of TaskItem components based on the provided tasks array.
 * @param {TaskListProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered unordered list element.
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
}) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          // React key prop
          key={task.id}
          task={task}
          // Pass down the handlers
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
