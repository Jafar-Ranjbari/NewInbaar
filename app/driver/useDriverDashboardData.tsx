"use client"
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
  getDriverByUserId, getCarByDriverId, getWalletTransactions, createWalletTransaction,
  getAllOpenOrders, getOffersByDriverId, getSmsCreditTransactions, getPaymentsByDriverId
} from '../services/userService';
import { Driver, DriverCar, WalletTransaction, Order, OrderOffer, SmsCreditTransaction, PaymentDriver } from '../types';
 
export const useDriverDashboardData = () => {
  const { currentUser } = useAuthStore();
  const [initLoading, setInitLoading] = useState(true);

  // --- Data States ---
  const [driver, setDriver] = useState<Partial<Driver>>({});
  const [car, setCar] = useState<Partial<DriverCar>>({});
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [smsTransactions, setSmsTransactions] = useState<SmsCreditTransaction[]>([]);
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [myOffers, setMyOffers] = useState<OrderOffer[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentDriver[]>([]);

  // Memoize the initialization function to be stable
  const initializeData = useCallback(async (userId: string) => {
    setInitLoading(true);
    try {
      // 1. Fetch Driver Profile
      let drv = await getDriverByUserId(userId);
      let driverId: string | undefined;

      if (!drv) {
        // Initialize a temporary driver state if none exists
        setDriver({ userID: userId, mobile1: currentUser?.mobile, firstName: '', lastName: '' });
      } else {
        driverId = drv.id;
        setDriver(drv);

        // 2. Fetch Car, Transactions, SMS Transactions, Offers, Payments (only if driver exists)
        const [c, txs, smsTxs, offers, pays] = await Promise.all([
          getCarByDriverId(driverId),
          getWalletTransactions(driverId, 'DRIVER'),
          getSmsCreditTransactions(userId),
          getOffersByDriverId(driverId),
          getPaymentsByDriverId(driverId)
        ]);

        if (c) setCar(c);
        setTransactions(txs);
        setSmsTransactions(smsTxs);
        setMyOffers(offers);
        setMyPayments(pays);

        // Handle initial wallet gift
        if (txs.length === 0) {
          const gift = await createWalletTransaction(driverId, 50000, 'هدیه اولین ورود', 'DRIVER');
          setTransactions([gift]);
        }
      }

      // 3. Load Open Orders (independent of driver existence)
      const orders = await getAllOpenOrders();
      setOpenOrders(orders);

    } catch (err) {
      console.error('Error initializing driver dashboard data:', err);
    } finally {
      setInitLoading(false);
    }
  }, [currentUser?.mobile]); // Dependency on mobile is only for initial driver setup

  // Run initialization on component mount or when currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      initializeData(currentUser.id);
    }
  }, [currentUser?.id, initializeData]);

   const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);
  const smsBalance = smsTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = myPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    // Data
    walletBalance,
    smsBalance,
    totalIncome,
    driver,
    car,
    transactions,
    smsTransactions,
    openOrders,
    myOffers,
    myPayments,
    // Status
    initLoading,
    // Function to manually re-fetch data
    refetchData: () => {
      if (currentUser?.id) {
        initializeData(currentUser.id);
      }
    },
  };
};



 