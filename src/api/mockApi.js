import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api', // This would be your actual API base URL
  timeout: 10000,
});

// Empty data arrays for testing
const mockBookings = [];
const mockExpenses = [];

// Mock API functions
export const getBookings = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockBookings };
};

export const getBookingById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const booking = mockBookings.find(b => b.id === id);
  return { data: booking };
};

export const createBooking = async (bookingData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const newBooking = {
    ...bookingData,
    id: Math.random().toString(36).substr(2, 9),
    bookingDate: new Date().toISOString().split('T')[0]
  };
  mockBookings.push(newBooking);
  return { data: newBooking };
};

export const updateBooking = async (id, bookingData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockBookings.findIndex(b => b.id === id);
  if (index !== -1) {
    mockBookings[index] = { ...bookingData, id };
    return { data: mockBookings[index] };
  }
  throw new Error('Booking not found');
};

export const deleteBooking = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockBookings.findIndex(b => b.id === id);
  if (index !== -1) {
    mockBookings.splice(index, 1);
    return { data: { id } };
  }
  throw new Error('Booking not found');
};

export const getExpenses = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockExpenses };
};

export const getExpensesByBookingId = async (bookingId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const expenses = mockExpenses.filter(e => e.bookingId === bookingId);
  return { data: expenses };
};

export const createExpense = async (expenseData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const newExpense = {
    ...expenseData,
    id: Math.random().toString(36).substr(2, 9)
  };
  mockExpenses.push(newExpense);
  return { data: newExpense };
};

export const updateExpense = async (id, expenseData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockExpenses.findIndex(e => e.id === id);
  if (index !== -1) {
    mockExpenses[index] = { ...expenseData, id };
    return { data: mockExpenses[index] };
  }
  throw new Error('Expense not found');
};

export const deleteExpense = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockExpenses.findIndex(e => e.id === id);
  if (index !== -1) {
    mockExpenses.splice(index, 1);
    return { data: { id } };
  }
  throw new Error('Expense not found');
};

export default api;