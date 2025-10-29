import * as mockApi from '../api/mockApi';

// Expense service functions
export const fetchExpenses = async () => {
  try {
    const response = await mockApi.getExpenses();
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expenses');
  }
};

export const fetchExpensesByBookingId = async (bookingId) => {
  try {
    const response = await mockApi.getExpensesByBookingId(bookingId);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch expenses');
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await mockApi.createExpense(expenseData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create expense');
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await mockApi.updateExpense(id, expenseData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update expense');
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await mockApi.deleteExpense(id);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete expense');
  }
};