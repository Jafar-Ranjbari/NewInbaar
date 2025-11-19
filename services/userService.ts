import axios from 'axios';
import { API_URL } from '../constants';
import { User } from '../types';

// Check if user exists by mobile
export const getUserByMobile = async (mobile: string): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/users?mobile=${mobile}`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Create new user
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
    // json-server automatically generates an ID
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update user (e.g. password reset)
export const updateUserPassword = async (id: string, newPassword: string): Promise<User> => {
  try {
    const response = await axios.patch(`${API_URL}/users/${id}`, {
      password: newPassword
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};