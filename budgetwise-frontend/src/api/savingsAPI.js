import api from "./axios";

/**
 * Create a new savings goal
 * body: { name, targetAmount }
 */
export const createSavingsGoal = (data) =>
  api.post("/savings-goals", data);

/**
 * Get all savings goals for logged-in user
 */
export const getSavingsGoals = () =>
  api.get("/savings-goals");

/**
 * Delete a savings goal
 */
export const deleteSavingsGoal = (goalId) =>
  api.delete(`/savings-goals/${goalId}`);

/**
 * Add an entry to a savings goal
 * body: { amount }
 */
export const addSavingsEntry = (goalId, data) =>
  api.post(`/savings-goals/${goalId}/entries`, data);

/**
 * Delete a savings entry
 */
export const deleteSavingsEntry = (entryId) =>
  api.delete(`/savings-goals/entries/${entryId}`);
