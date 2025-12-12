
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

// Wallet.....................................
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



// --- تابع جدید برای اعمال هدیه اولیه ---
export const applyInitialGift = async (driverID: string): Promise<WalletTransaction | null> => {
  const GIFT_AMOUNT_RIALS = 1000000; // 100,000 ریال = 10,000 تومان
  const GIFT_DESCRIPTION = 'هدیه اولیه (۱۰۰,۰۰۰ تومان)';

  // 1. بررسی سوابق تراکنش برای جلوگیری از اعمال مجدد
  const transactions = await getDriverWalletTransactions(driverID);

  // بررسی می‌کنیم که آیا قبلاً تراکنش با این توضیحات ثبت شده است یا خیر
  const isGiftAlreadyApplied = transactions.some(
    tx => tx.description === GIFT_DESCRIPTION && tx.balance_change === GIFT_AMOUNT_RIALS
  );

  if (isGiftAlreadyApplied) {
    // هدیه قبلاً اعمال شده، نیازی به انجام کاری نیست
    return null;
  }

  // 2. بررسی موجودی کل (جمع تمامی تراکنش‌ها)
  const currentBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);

  // شرط: فقط اگر موجودی صفر یا منفی باشد (یا اولین بار باشد که هیچ تراکنشی ندارد)
  // اما برای سادگی، فقط بررسی می‌کنیم که هدیه قبلاً اعمال نشده باشد و این کار را در منطق کامپوننت کنترل می‌کنیم.
  // این تابع فقط مسئول ثبت هدیه است.

  if (!isGiftAlreadyApplied) {
    // اعمال هدیه
    const giftTx = await createDriverWalletTransaction(
      driverID,
      GIFT_AMOUNT_RIALS,
      GIFT_DESCRIPTION
    );
    return giftTx;
  }

  return null;
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


// driverService.ts - (نمونه منطق، بسته به backend شما)

// ... (سایر ایمپورت‌ها)

export const getOrdersByDriverId = async (driverID: string): Promise<Order[]> => {
  // 1. دریافت مستقیم سفارشاتی که driverID آن‌ها با شناسه راننده فعلی مطابقت دارد
  // این شامل ORDERS با وضعیت: DRIVER_ASSIGNED، LOADING، ON_ROAD و ... می‌شود.
  const ordersResponse = await axios.get(`${API_URL}/orders?driverID=${driverID}`);
  let orders: Order[] = ordersResponse.data;

  // 2. برای هر سفارش، پیشنهاد ACCEPTED را به آن اضافه کنید تا قیمت نمایش داده شود
  const ordersWithOffers = await Promise.all(orders.map(async (order) => {
    // فرض می‌کنیم OrderOffer را بر اساس OrderID و DriverID فیلتر می‌کنیم
    const offerResponse = await axios.get(`${API_URL}/orderOffers?orderID=${order.id}&driverID=${driverID}&state=${OfferStatus.ACCEPTED}`);
    const acceptedOffer: OrderOffer = offerResponse.data[0]; // اولین مورد پذیرفته شده

    if (acceptedOffer) {
      order.offers = [acceptedOffer];
    }
    return order;
  }));

  return ordersWithOffers;
};

// تابع پیشنهادی قبلی که برای فراخوانی در کامپوننت نیاز بود:
// export const updateOrder = async (orderId: string, data: Partial<Order>): Promise<Order> => { ... };

export const createOrderOffer = async (offerData: Omit<OrderOffer, 'id' | 'date' | 'state'>): Promise<OrderOffer> => {
  const response = await axios.post(`${API_URL}/orderOffers`, {
    ...offerData,
    state: OfferStatus.PENDING,
    date: new Date().toISOString(),
    id: Math.random().toString(36).substr(2, 9),
  });
  return response.data;
};

// Reports - تابع اصلاح شده
export const getPaymentsByDriverId = async (driverID: string): Promise<PaymentDriver[]> => {
  // این خط برای فراخوانی API واقعی و اعمال فیلتر صحیح است:
  const response = await axios.get(`${API_URL}/paymentDrivers?driverID=${driverID}`);

  return response.data;

  // داده‌های نمونه حذف شدند
}
