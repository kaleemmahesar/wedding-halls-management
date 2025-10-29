import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from './slices/bookingsSlice';
import expensesReducer from './slices/expensesSlice';
import { loadState, saveState } from '../utils/localStorage';

// Load state from localStorage
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
    expenses: expensesReducer
  },
  preloadedState: persistedState
});

// Save state to localStorage whenever it changes
store.subscribe(() => {
  const state = store.getState();
  saveState({
    bookings: state.bookings,
    expenses: state.expenses
  });
});

export default store;