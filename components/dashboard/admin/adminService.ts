
import axios from 'axios';
import { API_URL } from '../../../constants';
import { User, Driver, DriverCar, Company, Order, PaymentDriver } from '../../../types';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getAllDrivers = async (): Promise<Driver[]> => {
  const response = await axios.get(`${API_URL}/drivers`);
  return response.data;
};

export const getAllDriverCars = async (): Promise<DriverCar[]> => {
  const response = await axios.get(`${API_URL}/driverCars`);
  return response.data;
};

export const getAllCompanies = async (): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}/companies`);
  return response.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

export const getAllPayments = async (): Promise<PaymentDriver[]> => {
  const response = await axios.get(`${API_URL}/paymentDrivers`);
  return response.data;
};
