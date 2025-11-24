import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // ایمپورت لینک برای Next.js
import { useAuthStore } from '../store/useAuthStore';
import {  UserCircle, PackagePlus, Wallet, FileBarChart, ArrowLeft } from 'lucide-react';
import { Company, CompanyType } from '../types';
import { getCompanyByUserId, createCompany, createCompanyWalletTransaction } from '../company/companyService';
import { IoNotificationsOutline } from "react-icons/io5";
import {
  FaUserCircle,
  FaPlus,
  FaTruck,
  FaRegMoneyBillAlt,
  FaWallet,
} from "react-icons/fa";
import { FiUser, FiBox, FiTruck, FiCreditCard, FiHome } from "react-icons/fi";
import { useDriverDashboardData } from './useDriverDashboardData';


export const DashboardDriver: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const init = async () => {
        let c = await getCompanyByUserId(currentUser.id);
        if (!c) {
          c = await createCompany(currentUser.id, CompanyType.REAL);
          await createCompanyWalletTransaction(c.id, 100000, 'هدیه ورود');
        }
        setCompany(c);
        setLoading(false);
      };
      init();
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const { walletBalance ,totalIncome } = useDriverDashboardData();
 

  // -------------------- Top Header --------------------
  const TopHeader = () => (
    <header className="bg-white sticky top-0 z-10 shadow-sm">
      <div className="h-16 flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-800">خانه</h1>
      </div>
    </header>
  );

  // -------------------- User Info --------------------
  const UserInfo = () => {

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-5xl text-gray-400" />
          <div>
            <p className="font-bold text-gray-800">    خوش آمدی  {currentUser.fullName}    </p>
            <p className="text-sm text-gray-500">پیکان وانت</p>
          </div>
        </div>
        <button className="text-gray-600">
          <IoNotificationsOutline size={28} />
        </button>
      </div>
    );
  }

  // -------------------- Balance Card --------------------
  const BalanceCard = () => (
    <div className="bg-blue-500 rounded-2xl p-5 text-white flex justify-between items-stretch relative overflow-hidden">
      <div className="absolute -left-12 -top-12 w-36 h-36 bg-white/10 rounded-full"></div>
      <div className="absolute left-4 -bottom-16 w-36 h-36 bg-white/10 rounded-full"></div>
      <div className="z-10 flex flex-col items-center justify-center gap-2">
        <Link
          href="/driver/wallet"
          className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          <FaPlus className="text-blue-500 text-xl" />
        </Link>
        <p className="text-sm font-medium">افزایش موجودی</p>
      </div>
      <div className="z-10 text-right">
        <p className="font-semibold">موجودی کیف پول</p>
        <p className="text-3xl font-bold mt-2 flex items-center justify-end gap-2">
          <span>  {walletBalance.toLocaleString()}</span>
          <span className="text-base font-normal">ریال</span>
        </p>
      </div>
    </div>
  );

  // -------------------- Stats Cards --------------------
  const StatsCards = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-gray-700">تعداد سفارش</p>
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaTruck className="text-blue-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-right mt-4">۰</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-gray-700">درآمد شما در اینبار</p>
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaRegMoneyBillAlt className="text-blue-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-right mt-4 flex items-center justify-end gap-2">
          <span> {totalIncome.toLocaleString()} </span>
          <span className="text-sm font-normal">ریال</span>
        </p>
      </div>
    </div>
  );

  // -------------------- Referral Card --------------------
  const ReferralCard = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-800 text-white p-6 text-center relative">
        <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/5 rounded-full"></div>
        <div className="absolute right-0 -bottom-14 w-28 h-28 bg-white/5 rounded-full"></div>
        <p className="text-lg">دوستتو دعوت کن، جایزه بگیر</p>
        <p className="text-2xl font-bold mt-1">اینبار رفاقت پولسازه!</p>
      </div>
      <div className="p-4 flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-400 tracking-wider">
          In<span className="text-gray-800">Baar</span>
        </span>
        <Link
          href="/driver/invite"
          className="border border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm"
        >
          دعوت از دوستان
        </Link>
      </div>
    </div>
  );

  // -------------------- Wallet Prompt --------------------
  const WalletPrompt = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center gap-4">
      <div className="bg-gray-100 p-5 rounded-full">
        <FaWallet className="text-5xl text-gray-400" />
      </div>
      <p className="text-gray-600 text-sm max-w-xs">
        جهت استفاده از خدمات اینبار، ابتدا{" "}
        <Link href="/driver/wallet" className="text-blue-500 font-semibold">
          کیف پول
        </Link>{" "}
        خود را شارژ نمایید
      </p>
    </div>
  );

  // -------------------- Bottom Nav --------------------
  const BottomNav = () => {
    return (
      <footer className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-20 relative">
          {/* پروفایل */}
          <Link
            href="/driver/profile"
            className="flex flex-col items-center gap-1 text-gray-500 z-20 relative"
          >
            <FiUser size={24} />
            <span className="text-xs">پروفایل</span>
          </Link>

          {/* سفارشات */}
          <Link
            href="/driver/orders"
            className="flex flex-col items-center gap-1 text-gray-500 z-20 relative"
          >
            <FiBox size={24} />
            <span className="text-xs">سفارشات</span>
          </Link>

          {/* دکمه وسط */}
          <div className="relative w-16 h-16 z-10">
            <Link
              href="/driver/wallet"
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center shadow-md border-4 border-white z-10"
            >
              <FiTruck size={28} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                ۱۰
              </span>
            </Link>
          </div>

          {/* کیف پول */}
          <Link
            href="/driver/wallet"
            className="relative flex flex-col items-center gap-1 text-gray-500 z-20"
          >
            <FiCreditCard size={24} />
            <span className="text-xs">کیف پول </span>
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
          </Link>

          {/* خانه */}
          <Link
            href="/driver/Homedriverpanel"
            className="flex flex-col items-center gap-1 text-gray-900 font-bold z-20 relative"
          >
            <FiHome size={24} className="fill-current" />
            <span className="text-xs">خانه</span>
          </Link>
        </div>
      </footer>
    );
  };


  // -------------------- Main Page --------------------
  const Homedriverpanel = () => {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-sm mx-auto bg-gray-100 relative">
          <TopHeader />
          <main className="p-4 space-y-4 pb-28">
            <UserInfo />
            <BalanceCard />
            <StatsCards />
            <ReferralCard />
            <WalletPrompt />
          </main>
          <BottomNav />
        </div>
      </div>
    );
  };

  //////////////////////////////////////////

  // لیست منوها برای تمیزی کد
  const menuItems = [
    { title: 'مشخصات شرکت', href: '/driver/profile', icon: <UserCircle size={32} />, color: 'text-blue-600 bg-blue-50' },
    { title: 'مدیریت بار', href: '/dashboard/orders', icon: <PackagePlus size={32} />, color: 'text-green-600 bg-green-50' },
    { title: 'کیف پول', href: '/dashboard/wallet', icon: <Wallet size={32} />, color: 'text-purple-600 bg-purple-50' },
    { title: 'گزارشات', href: '/dashboard/reports', icon: <FileBarChart size={32} />, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    //  <div className="min-h-screen bg-gray-50">
    //    {/* Header */}
    //    <header className="bg-white shadow-sm border-b border-blue-500 sticky top-0 z-10">
    //      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    //        <div className="flex items-center gap-3">
    //          <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><Building2 size={24} /></div>
    //          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">پنل شرکت‌ها</h1>
    //        </div>
    //        <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
    //          <LogOut size={20} />
    //        </button>
    //      </div>
    //    </header>

    //    <main className="max-w-5xl mx-auto px-4 py-10">
    //      {loading ? (
    //        <div className="text-center py-20 text-gray-500">در حال بارگذاری اطلاعات...</div>
    //      ) : (
    //        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    //          {menuItems.map((item, index) => (
    //            <Link key={index} href={item.href} className="group">
    //              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 h-full flex flex-col items-center justify-center gap-4 cursor-pointer group-hover:-translate-y-1">
    //                <div className={`p-4 rounded-full ${item.color} transition-transform group-hover:scale-110`}>
    //                  {item.icon}
    //                </div>
    //                <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">
    //                  {item.title}
    //                </span>
    //                <div className="text-xs text-gray-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
    //                  ورود به بخش <ArrowLeft size={12} />
    //                </div>
    //              </div>
    //            </Link>
    //          ))}
    //        </div>
    //      )}
    //    </main>
    //  </div>
    <>
      <Homedriverpanel />

    </>
  );
};








