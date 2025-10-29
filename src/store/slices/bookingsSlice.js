import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingService from '../../services/bookingService';
import { Booking } from '../../models/Booking';

// Async thunks for API calls
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async () => {
    const bookings = await bookingService.fetchBookings();
    return bookings;
  }
);

export const addBooking = createAsyncThunk(
  'bookings/addBooking',
  async (bookingData) => {
    const newBooking = await bookingService.createBooking(bookingData);
    // Return plain object instead of class instance
    return {
      ...newBooking,
      balance: newBooking.totalCost - (newBooking.advance || 0)
    };
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async (bookingData) => {
    const updatedBooking = await bookingService.updateBooking(bookingData.id, bookingData);
    // Return plain object instead of class instance
    return {
      ...updatedBooking,
      balance: updatedBooking.totalCost - (updatedBooking.advance || 0)
    };
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (bookingId) => {
    await bookingService.deleteBooking(bookingId);
    return bookingId;
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    status: 'idle',
    error: null
  },
  reducers: {
    // Synchronous reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Store plain objects instead of class instances
        state.bookings = action.payload.map(booking => ({
          ...booking,
          balance: booking.totalCost - (booking.advance || 0)
        }));
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
      });
  }
});

export default bookingsSlice.reducer;