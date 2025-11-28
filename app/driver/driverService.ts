
import axios from 'axios';
import { API_URL } from '../constants';
import { Driver, DriverCar, WalletTransaction, SmsCreditTransaction, Order, OrderOffer, PaymentDriver, OfferStatus, OrderStatus } from '../types';

// Driver Profile
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

// Driver Car
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

// Wallet
export const getDriverWalletTransactions = async (driverID: string): Promise<WalletTransaction[]> => {
  const response = await axios.get(`${API_URL}/walletDrivers?ownerID=${driverID}`);
  return response.data;
};

export const createDriverWalletTransaction = async (
  driverID: string, 
  amount: number, 
  desc: string
): Promise<WalletTransaction> => {
  const transaction: WalletTransaction = {
    id: Math.random().toString(36).substr(2, 9),
    ownerID: driverID,
    balance_change: amount,
    orders_change: 0,
    description: desc,
    timestamp: new Date().toISOString()
  };
  const response = await axios.post(`${API_URL}/walletDrivers`, transaction);
  return response.data;
};

// SMS Credits
export const getSmsCreditTransactions = async (userID: string): Promise<SmsCreditTransaction[]> => {
    const response = await axios.get(`${API_URL}/smsCreditTransactions?userID=${userID}`);
    return response.data;
};

export const createSmsCreditTransaction = async (
  userID: string, 
  amount: number, 
  cost: number,
  desc: string
): Promise<SmsCreditTransaction> => {
  const transaction: SmsCreditTransaction = {
    id: Math.random().toString(36).substr(2, 9),
    userID,
    amount,
    cost,
    description: desc,
    timestamp: new Date().toISOString()
  };
  const response = await axios.post(`${API_URL}/smsCreditTransactions`, transaction);
  return response.data;
};

// Orders & Offers
export const getAllOpenOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/orders?status=${OrderStatus.NEW}`);
  return response.data;
};

export const getOffersByDriverId = async (driverID: string): Promise<OrderOffer[]> => {
  const response = await axios.get(`${API_URL}/orderOffers?driverID=${driverID}`);
  return response.data;
};

export const createOrderOffer = async (offerData: Omit<OrderOffer, 'id' | 'date' | 'state'>): Promise<OrderOffer> => {
  const response = await axios.post(`${API_URL}/orderOffers`, {
    ...offerData,
    state: OfferStatus.PENDING,
    date: new Date().toISOString(),
    id: Math.random().toString(36).substr(2, 9),
  });
  return response.data;
};

// Reports
// export const getPaymentsByDriverId = async (driverID: string): Promise<PaymentDriver[]> => {
//   const response = await axios.get(`${API_URL}/paymentDrivers?driverID=${driverID}`);
//   return response.data;
// };


 
export const getPaymentsByDriverId = async (driverID: string): Promise<PaymentDriver[]> => {
    // در محیط واقعی این فراخوانی باید انجام شود:
    // const response = await axios.get(`${API_URL}/paymentDrivers?driverID=${driverID}`);
    // return response.data;
    
    // **داده‌های نمونه برای تست در اینجا قرار داده می‌شوند:**
    return [
        { id: "chw8sjkb8", orderID: "cgvvv73id", driverID: driverID, amount: 1000000, payType: "CASH", transactionCode: "123213", year: 1404, month: 3, day: 25, date: "2025-05-15T10:00:00.000Z", createdAt: "2025-05-15T10:00:00.000Z" },
        { id: "chw8skb9", orderID: "cgvvv73ie", driverID: driverID, amount: 500000, payType: "ONLINE", transactionCode: "123214", year: 1404, month: 3, day: 24, date: "2025-05-14T10:00:00.000Z", createdAt: "2025-05-14T10:00:00.000Z" },
        { id: "chw8skc0", orderID: "cgvvv73if", driverID: driverID, amount: 200000, payType: "CASH", transactionCode: "123215", year: 1404, month: 2, day: 15, date: "2025-04-05T10:00:00.000Z", createdAt: "2025-04-05T10:00:00.000Z" },
        { id: "chw8skc1", orderID: "cgvvv73ig", driverID: driverID, amount: 1250000, payType: "ONLINE", transactionCode: "123216", year: 1404, month: 3, day: 25, date: "2025-05-15T11:00:00.000Z", createdAt: "2025-05-15T11:00:00.000Z" },
        { id: "chw8skc2", orderID: "cgvvv73ih", driverID: driverID, amount: 800000, payType: "CASH", transactionCode: "123217", year: 1404, month: 3, day: 22, date: "2025-05-12T10:00:00.000Z", createdAt: "2025-05-12T10:00:00.000Z" },
        { id: "chw8skc3", orderID: "cgvvv73ii", driverID: driverID, amount: 400000, payType: "CASH", transactionCode: "123218", year: 1403, month: 12, day: 10, date: "2025-03-01T10:00:00.000Z", createdAt: "2025-03-01T10:00:00.000Z" },
    ] as PaymentDriver[];
};