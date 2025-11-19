import axios from 'axios';
import { API_URL } from '../constants';
import { User, Driver, DriverCar, WalletTransaction, Company, CompanyDetail, Order, CompanyType } from '../types';

// --- USER ---
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

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const updateUserPassword = async (id: string, newPassword: string): Promise<User> => {
  const response = await axios.patch(`${API_URL}/users/${id}`, {
    password: newPassword
  });
  return response.data;
};

// --- DRIVER ---
export const getDriverByUserId = async (userId: string): Promise<Driver | null> => {
  const response = await axios.get(`${API_URL}/drivers?userID=${userId}`);
  return response.data[0] || null;
};

export const createOrUpdateDriver = async (driverData: Partial<Driver> & { userID: string }): Promise<Driver> => {
  const existing = await getDriverByUserId(driverData.userID);
  if (existing) {
    const response = await axios.patch(`${API_URL}/drivers/${existing.id}`, driverData);
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/drivers`, { ...driverData, id: Date.now().toString() });
    return response.data;
  }
};

// --- DRIVER CAR ---
export const getCarByDriverId = async (driverID: string): Promise<DriverCar | null> => {
  const response = await axios.get(`${API_URL}/driverCars?driverID=${driverID}`);
  return response.data[0] || null;
};

export const createOrUpdateCar = async (carData: Partial<DriverCar> & { driverID: string }): Promise<DriverCar> => {
  const existing = await getCarByDriverId(carData.driverID);
  const now = new Date().toISOString();
  if (existing) {
    const response = await axios.patch(`${API_URL}/driverCars/${existing.id}`, { ...carData, updatedAt: now });
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/driverCars`, { ...carData, id: Math.random().toString(36).substr(2, 9), createdAt: now, updatedAt: now });
    return response.data;
  }
};

// --- WALLET (Generic for Driver & Company) ---
export const getWalletTransactions = async (ownerID: string, role: 'DRIVER' | 'COMPANY'): Promise<WalletTransaction[]> => {
  const endpoint = role === 'DRIVER' ? 'walletDrivers' : 'walletCompanies';
  const response = await axios.get(`${API_URL}/${endpoint}?ownerID=${ownerID}`);
  return response.data;
};

export const createWalletTransaction = async (
  ownerID: string, 
  amount: number, 
  desc: string, 
  role: 'DRIVER' | 'COMPANY'
): Promise<WalletTransaction> => {
  const endpoint = role === 'DRIVER' ? 'walletDrivers' : 'walletCompanies';
  const transaction: WalletTransaction = {
    id: Math.random().toString(36).substr(2, 9),
    ownerID,
    balance_change: amount,
    orders_change: 0,
    description: desc,
    timestamp: new Date().toISOString()
  };
  const response = await axios.post(`${API_URL}/${endpoint}`, transaction);
  return response.data;
};

// --- COMPANY ---
export const getCompanyByUserId = async (userId: string): Promise<Company | null> => {
  const response = await axios.get(`${API_URL}/companies?userID=${userId}`);
  return response.data[0] || null;
};

export const createCompany = async (userId: string, type: CompanyType): Promise<Company> => {
  const response = await axios.post(`${API_URL}/companies`, { 
    id: Date.now().toString(), 
    userID: userId, 
    type 
  });
  return response.data;
};

export const getCompanyDetail = async (companyID: string): Promise<CompanyDetail | null> => {
  const response = await axios.get(`${API_URL}/companyDetails?companyID=${companyID}`);
  return response.data[0] || null;
};

export const createOrUpdateCompanyDetail = async (detailData: Partial<CompanyDetail> & { companyID: string }): Promise<CompanyDetail> => {
  const existing = await getCompanyDetail(detailData.companyID);
  const now = new Date().toISOString();
  if (existing) {
    const response = await axios.patch(`${API_URL}/companyDetails/${existing.id}`, { ...detailData, updatedAt: now });
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/companyDetails`, { ...detailData, id: Math.random().toString(36).substr(2, 9), createdAt: now, updatedAt: now });
    return response.data;
  }
};

// --- ORDERS ---
export const getCompanyOrders = async (companyID: string): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders?companyID=${companyID}`);
  return response.data;
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  const response = await axios.post(`${API_URL}/orders`, {
    ...orderData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  });
  return response.data;
};