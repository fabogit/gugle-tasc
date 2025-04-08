/**
 * @interface Task
 * @description Represents a single task item in the application.
 */
export interface Task {
  /**
   * @property {string} id - A unique identifier for the task (e.g., UUID).
   */
  id: string;
  /**
   * @property {string} text - The descriptive text content of the task.
   */
  text: string;
  /**
   * @property {boolean} isCompleted - Indicates whether the task has been completed.
   */
  isCompleted: boolean;
}
