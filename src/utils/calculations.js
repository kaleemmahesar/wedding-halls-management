// Utility functions for calculations

// Calculate total expenses for a booking
export const calculateBookingExpenses = (expenses, bookingId) => {
  return expenses
    .filter(expense => expense.bookingId === bookingId)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

// Calculate profit for a booking
export const calculateBookingProfit = (booking, expenses) => {
  const totalExpenses = calculateBookingExpenses(expenses, booking.id);
  return booking.totalCost - totalExpenses;
};

// Calculate total revenue from all bookings
export const calculateTotalRevenue = (bookings) => {
  return bookings.reduce((sum, booking) => sum + booking.totalCost, 0);
};

// Calculate total expenses from all expenses
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// Calculate net profit
export const calculateNetProfit = (revenue, expenses) => {
  return revenue - expenses;
};

// Calculate balance for a booking
export const calculateBookingBalance = (booking) => {
  return booking.totalCost - (booking.advance || 0);
};