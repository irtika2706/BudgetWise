import api from "./axios";

// Fetch all transactions (income + expense)
export const getExpenses = () => api.get("/expenses");

// Add transaction (EXPENSE or INCOME)
// `data` MUST include: title, amount, category, type, date
export const addExpense = (data) => {
  return api.post("/expenses", data);
};

// Update transaction
// NOTE: `type` must NOT be sent here (backend ignores it anyway)
export const updateExpense = (id, data) => {
  return api.put(`/expenses/${id}`, data);
};

// Delete transaction
export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`);
};
