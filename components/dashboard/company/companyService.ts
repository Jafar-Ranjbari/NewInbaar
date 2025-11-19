
import axios from 'axios';
import { API_URL } from '../../../constants';
import { Company, CompanyDetail, CompanyType, Order, OrderOffer, PaymentDriver, DriverReview, SmsCreditTransaction, WalletTransaction, OrderStatus, OfferStatus } from '../../../types';

// Profile
export const getCompanyByUserId = async (userId: string): Promise<Company | null> => {
  const response = await axios.get(`${API_URL}/companies?userID=${userId}`);
  return response.data[0] || null;
};

export const createCompany = async (userId: string, type: CompanyType): Promise<Company> => {
  const response = await axios.post(`${API_URL}/companies`, { id: Date.now().toString(), userID: userId, type });
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

// Wallet
export const getCompanyWalletTransactions = async (companyID: string): Promise<WalletTransaction[]> => {
  const response = await axios.get(`${API_URL}/walletCompanies?ownerID=${companyID}`);
  return response.data;
};

export const createCompanyWalletTransaction = async (ownerID: string, amount: number, desc: string): Promise<WalletTransaction> => {
  const transaction: WalletTransaction = {
    id: Math.random().toString(36).substr(2, 9),
    ownerID,
    balance_change: amount,
    orders_change: 0,
    description: desc,
    timestamp: new Date().toISOString()
  };
  const response = await axios.post(`${API_URL}/walletCompanies`, transaction);
  return response.data;
};

// SMS
export const createSmsCreditTransaction = async (userID: string, amount: number, cost: number, desc: string): Promise<SmsCreditTransaction> => {
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

export const getSmsCreditTransactions = async (userID: string): Promise<SmsCreditTransaction[]> => {
  const response = await axios.get(`${API_URL}/smsCreditTransactions?userID=${userID}`);
  return response.data;
};

// Orders
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

export const updateOrder = async (orderID: string, updates: Partial<Order>): Promise<Order> => {
  const response = await axios.patch(`${API_URL}/orders/${orderID}`, updates);
  return response.data;
};

export const getOffersByOrderId = async (orderID: string): Promise<OrderOffer[]> => {
  const response = await axios.get(`${API_URL}/orderOffers?orderID=${orderID}`);
  return response.data;
};

export const updateOfferStatus = async (offerID: string, state: OfferStatus, whyReject?: string): Promise<OrderOffer> => {
  const payload: any = { state };
  if (whyReject) payload.whyReject = whyReject;
  const response = await axios.patch(`${API_URL}/orderOffers/${offerID}`, payload);
  return response.data;
};

// Payments & Reviews
export const createPayment = async (paymentData: Omit<PaymentDriver, 'id' | 'createdAt'>): Promise<PaymentDriver> => {
    const response = await axios.post(`${API_URL}/paymentDrivers`, {
        ...paymentData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    });
    return response.data;
};

export const getPaymentsByOrderId = async (orderID: string): Promise<PaymentDriver[]> => {
    const response = await axios.get(`${API_URL}/paymentDrivers?orderID=${orderID}`);
    return response.data;
};

export const createReview = async (reviewData: Omit<DriverReview, 'id' | 'createdAt'>): Promise<DriverReview> => {
    const response = await axios.post(`${API_URL}/driverReviews`, {
        ...reviewData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    });
    return response.data;
};

export const getReviewByOrderId = async (orderID: string): Promise<DriverReview[]> => {
    const response = await axios.get(`${API_URL}/driverReviews?orderID=${orderID}`);
    return response.data;
};

export const createDriverWalletTransaction = async (driverID: string, amount: number, desc: string): Promise<void> => {
    await axios.post(`${API_URL}/walletDrivers`, {
        id: Math.random().toString(36).substr(2, 9),
        ownerID: driverID,
        balance_change: amount,
        orders_change: 0,
        description: desc,
        timestamp: new Date().toISOString()
    });
}
