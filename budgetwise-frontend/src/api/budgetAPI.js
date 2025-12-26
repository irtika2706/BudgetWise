import api from "./axios";

/**
 * Create or update budget for a month
 * body: { month, totalBudget, categories[] }
 */
export const saveBudget = (data) =>
  api.post("/budget", data);

/**
 * Get budget summary for a month
 * query param: ?month=YYYY-MM
 */
export const getBudgetSummary = (month) =>
  api.get("/budget", {
    params: { month },
  });


/**
 * Delete budget for a month
 */
export const deleteBudget = (month) =>
  api.delete("/budget", {
    params: { month },
  });
