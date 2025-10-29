import * as mockApi from '../api/mockApi';

// Booking service functions
export const fetchBookings = async () => {
  try {
    const response = await mockApi.getBookings();
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch bookings');
  }
};

export const fetchBookingById = async (id) => {
  try {
    const response = await mockApi.getBookingById(id);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch booking');
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await mockApi.createBooking(bookingData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create booking');
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await mockApi.updateBooking(id, bookingData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update booking');
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await mockApi.deleteBooking(id);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete booking');
  }
};