// import React, { useEffect } from "react";
// import Link from "next/link";
// import { useAuthStore } from "../store/useAuthStore";
// import {
//   UserCircle,
//   PackagePlus,
//   Wallet,
//   FileBarChart,
// } from "lucide-react";
// import { IoNotificationsOutline } from "react-icons/io5";
// import {
//   FaUserCircle,
//   FaPlus,
//   FaTruck,
//   FaRegMoneyBillAlt,
//   FaWallet,
// } from "react-icons/fa";
// import { FiUser, FiBox, FiTruck, FiCreditCard, FiHome } from "react-icons/fi";
// import { useDriverDashboardData } from "./useDriverDashboardData";
// import HeaderPanel from "../components/HeaderPanel";
//  import { useRouter } from 'next/navigation';

// export const DashboardDriver: React.FC = () => {
//     const router = useRouter();
//   const { currentUser, token } = useAuthStore();

//   // ایرادش اینه  خروج میزنیم قاط میزنه  
//   useEffect(() => {
//     if (!token || (currentUser && currentUser.isComplete === false)) {
//       router.replace("/driver/complete-profile");
//     }
//   }, [token, currentUser, router]);

//   if (!currentUser || !token) return null; // صبر تا ریدایرکت

//   if (currentUser.isComplete === false) {
//     return null; // صبر تا ریدایرکت
//   }


//   const { walletBalance, totalIncome, myOffers, car } =
//     useDriverDashboardData();
//   const myoffereLength = myOffers.filter((c) => c.state != "REJECTED").length;

//   // -------------------- User Info --------------------
//   const UserInfo = () => {
//     return (
//       <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <FaUserCircle className="text-5xl text-gray-400" />
//           <div>
//             <p className="font-bold text-gray-800">
//               {" "}
//               خوش آمدی {currentUser.fullName}{" "}
//             </p>
//             <p className="text-sm text-gray-500"> {car.carModel} </p>
//           </div>
//         </div>
//         <button className="text-gray-600">
//           <IoNotificationsOutline size={28} />
//         </button>
//       </div>
//     );
//   };

//   // -------------------- Balance Card --------------------
//   const BalanceCard = () => (
//     <div className="bg-blue-500 rounded-2xl p-5 text-white flex justify-between items-stretch relative overflow-hidden">
//       <div className="absolute -left-12 -top-12 w-36 h-36 bg-white/10 rounded-full"></div>
//       <div className="absolute left-4 -bottom-16 w-36 h-36 bg-white/10 rounded-full"></div>
//       <div className="z-10 flex flex-col items-center justify-center gap-2">
//         <Link
//           href="/driver/driverWallet"
//           className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
//         >
//           <FaPlus className="text-blue-500 text-xl" />
//         </Link>
//         <p className="text-sm font-medium">افزایش موجودی</p>
//       </div>
//       <div className="z-10 text-right">
//         <p className="font-semibold">موجودی کیف پول</p>
//         <p className="text-3xl font-bold mt-2 flex items-center justify-end gap-2">
//           <span>  {walletBalance.toLocaleString()}</span>
//           <span className="text-base font-normal">ریال</span>
//         </p>
//       </div>
//     </div>
//   );

//   // -------------------- Stats Cards --------------------
//   const StatsCards = () => (
//     <div className="grid grid-cols-2 gap-4">
//       <div className="bg-white rounded-xl shadow-sm p-4">
//         <div className="flex justify-between items-start">
//           <p className="font-semibold text-gray-700">تعداد سفارش</p>
//           <div className="bg-blue-100 p-2 rounded-lg">
//             <FaTruck className="text-blue-500" />
//           </div>
//         </div>
//         <p className="text-2xl font-bold text-right mt-4">
//           {myoffereLength.toLocaleString()}
//         </p>
//       </div>
//       <div className="bg-white rounded-xl shadow-sm p-4">
//         <div className="flex justify-between items-start">
//           <p className="font-semibold text-gray-700">درآمد شما در اینبار</p>
//           <div className="bg-blue-100 p-2 rounded-lg">
//             <FaRegMoneyBillAlt className="text-blue-500" />
//           </div>
//         </div>
//         <p className="text-2xl font-bold text-right mt-4 flex items-center justify-end gap-2">
//           <span> {totalIncome.toLocaleString()} </span>
//           <span className="text-sm font-normal">ریال</span>
//         </p>
//       </div>
//     </div>
//   );

//   // -------------------- Referral Card --------------------
//   const ReferralCard = () => (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//       <div className="bg-gray-800 text-white p-6 text-center relative">
//         <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/5 rounded-full"></div>
//         <div className="absolute right-0 -bottom-14 w-28 h-28 bg-white/5 rounded-full"></div>
//         <p className="text-lg">دوستتو دعوت کن، جایزه بگیر</p>
//         <p className="text-2xl font-bold mt-1">اینبار رفاقت پولسازه!</p>
//       </div>
//       <div className="p-4 flex justify-between items-center">
//         <span className="text-2xl font-bold text-gray-400 tracking-wider">
//           In<span className="text-gray-800">Baar</span>
//         </span>
//         <Link
//           href="/driver/invite"
//           className="border border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm"
//         >
//           دعوت از دوستان
//         </Link>
//       </div>
//     </div>
//   );

//   // -------------------- Wallet Prompt --------------------
//   const WalletPrompt = () => (
//     <div className="bg-white rounded-xl shadow-sm p-6 text-center flex flex-col items-center gap-4">
//       <div className="bg-gray-100 p-5 rounded-full">
//         <FaWallet className="text-5xl text-gray-400" />
//       </div>
//       <p className="text-gray-600 text-sm max-w-xs">
//         جهت استفاده از خدمات اینبار، ابتدا{" "}
//         <Link
//           href="/driver/driverWallet"
//           className="text-blue-500 font-semibold"
//         >
//           کیف پول
//         </Link>{" "}
//         خود را شارژ نمایید
//       </p>
//     </div>
//   );

//   // -------------------- Bottom Nav --------------------
//   const BottomNav = () => {
//     return (
//       <footer className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200 z-50">
//         <div className="flex justify-around items-center h-20 relative">
//           {/* پروفایل */}
//           <Link
//             href="/driver/panelDriver"
//             className="flex flex-col items-center gap-1 text-gray-500 z-20 relative"
//           >
//             <FiUser size={24} />
//             <span className="text-xs">پروفایل</span>
//           </Link>

//           {/* سفارشات */}
//           <Link
//             href="/driver/orders"
//             className="flex flex-col items-center gap-1 text-gray-500 z-20 relative"
//           >
//             <FiBox size={24} />
//             <span className="text-xs">سفارشات</span>
//           </Link>

//           {/* دکمه وسط */}
//           <div className="relative w-16 h-16 z-10">
//             <Link
//               href="/driver/roadDriver"
//               className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center shadow-md border-4 border-white z-10"
//             >
//               <FiTruck size={28} className="text-gray-500" />
//               <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
//                 ۱۰
//               </span>
//             </Link>
//           </div>

//           {/* کیف پول */}
//           <Link
//             href="/driver/driverWallet"
//             className="relative flex flex-col items-center gap-1 text-gray-500 z-20"
//           >
//             <FiCreditCard size={24} />
//             <span className="text-xs">کیف پول </span>
//             <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
//           </Link>

//           {/* خانه */}
//           <Link
//             href="/driver/orderReport"
//             className="flex flex-col items-center gap-1 text-gray-900 font-bold z-20 relative"
//           >
//             <FiHome size={24} className="fill-current" />
//             <span className="text-xs">گزاش سفارش'</span>
//           </Link>
//         </div>
//       </footer>
//     );
//   };

//   // -------------------- Main Page --------------------
//   const Homedriverpanel = () => {
//     return (
//       <div className="bg-gray-100 min-h-screen">
//         <div className="max-w-sm mx-auto bg-gray-100 relative">
//           {/* <TopHeader /> */}
//           <HeaderPanel />
//           <main className="p-4 space-y-4 pb-28">
//             <UserInfo />
//             <BalanceCard />
//             <StatsCards />
//             <ReferralCard />
//             <WalletPrompt />
//           </main>
//           <BottomNav />
//         </div>
//       </div>
//     );
//   };

//   //////////////////////////////////////////

//   // لیست منوها برای تمیزی کد
//   const menuItems = [
//     {
//       title: "مشخصات شرکت",
//       href: "/driver/profile",
//       icon: <UserCircle size={32} />,
//       color: "text-blue-600 bg-blue-50",
//     },
//     {
//       title: "مدیریت بار",
//       href: "/dashboard/orders",
//       icon: <PackagePlus size={32} />,
//       color: "text-gray-600 bg-gray-50",
//     },
//     {
//       title: "کیف پول",
//       href: "/dashboard/wallet",
//       icon: <Wallet size={32} />,
//       color: "text-purple-600 bg-purple-50",
//     },
//     {
//       title: "گزارشات",
//       href: "/dashboard/reports",
//       icon: <FileBarChart size={32} />,
//       color: "text-orange-600 bg-orange-50",
//     },
//   ];

//   return (
//     <>
//       <Homedriverpanel />
//     </>
//   );
// };



"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import { useDriverDashboardData } from "./useDriverDashboardData";
import { getDriverWalletTransactions, getSmsCreditTransactions } from './driverService';
import HeaderPanel from "../components/HeaderPanel";
import { useRouter } from 'next/navigation';

// آیکون‌ها
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle, FaPlus, FaTruck, FaRegMoneyBillAlt, FaWallet } from "react-icons/fa";
import { FiUser, FiBox, FiTruck, FiCreditCard, FiHome } from "react-icons/fi";
import { FiMail } from 'react-icons/fi';
import { TbTruckDelivery } from 'react-icons/tb';
import AuthGuardDriver from "./complete-profile/AuthGuardDriver";

export const DashboardDriver: React.FC = () => {
  const router = useRouter();
  const { currentUser, token } = useAuthStore();
  const { totalIncome, myOffers, car, driver } = useDriverDashboardData();

  // استیت‌های لازم برای محاسبه موجودی دقیق
  const [walletTx, setWalletTx] = useState<any[]>([]);
  const [smsTx, setSmsTx] = useState<any[]>([]);

  useEffect(() => {
    if (!token || (currentUser && currentUser.isComplete === false)) {
      router.replace("/driver/complete-profile");
    }
  }, [token, currentUser, router]);

  // دریافت اطلاعات مالی برای محاسبه موجودی (دقیقاً مثل صفحه کیف پول)
  useEffect(() => {
    const fetchFinanceData = async () => {
      if (driver?.id && currentUser?.id) {
        try {
          const [wTransactions, sTransactions] = await Promise.all([
            getDriverWalletTransactions(driver.id),
            getSmsCreditTransactions(currentUser.id)
          ]);
          setWalletTx(wTransactions);
          setSmsTx(sTransactions);
        } catch (error) {
          console.error("Error fetching finance data:", error);
        }
      }
    };
    fetchFinanceData();
  }, [driver?.id, currentUser?.id]);

  // محاسبه موجودی‌ها
  const currentWalletBalance = walletTx.reduce((acc, curr) => acc + curr.balance_change, 0);
  const currentSmsBalance = smsTx.reduce((acc, curr) => acc + curr.amount, 0);
  const walletInTomans = currentWalletBalance / 10;

  if (!currentUser || !token) return null;

  const myoffereLength = myOffers.filter((c) => c.state != "REJECTED").length;

  // -------------------- User Info --------------------
  const UserInfo = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <FaUserCircle className="text-5xl text-gray-400" />
        <div>
          <p className="font-bold text-gray-800">خوش آمدی {currentUser.fullName}</p>
          <p className="text-sm text-gray-500">{car.carModel}</p>
        </div>
      </div>
      <button className="text-gray-600"><IoNotificationsOutline size={28} /></button>
    </div>
  );

  // -------------------- Balance Card (همان ظاهر WalletBalanceCard) --------------------
  const BalanceCard = () => (
    <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-3xl p-5 shadow-lg relative overflow-hidden text-white">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>

      <div className="relative z-10">
        <div className="flex flex-col items-center mb-6">
          <p className="text-sm opacity-80">موجودی کیف پول</p>
          <div className="flex items-baseline mt-2">
            <span className="text-4xl font-bold tracking-wider">{walletInTomans.toLocaleString('fa-IR')}</span>
            <span className="text-sm font-semibold mr-2">تومان</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl mb-2">
          <div className="flex items-center">
            <TbTruckDelivery size={24} />
            <div className="mr-3">
              <p className="text-[10px] font-semibold opacity-90">موجودی شارژ سفارش</p>
              <p className="text-xs font-bold">{walletInTomans.toLocaleString('fa-IR')} تومان</p>
            </div>
          </div>
          <Link href="/driver/driverWallet" className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md">
            <FaPlus size={14} />
          </Link>
        </div>

        <div className="flex items-center justify-between bg-white/20 p-3 rounded-2xl">
          <div className="flex items-center">
            <FiMail size={22} />
            <div className="mr-3">
              <p className="text-[10px] font-semibold opacity-90">اعتبار پیامک</p>
              <p className="text-xs font-bold">{currentSmsBalance} عدد</p>
            </div>
          </div>
          <Link href="/driver/driverWallet" className="bg-white text-blue-600 rounded-lg w-7 h-7 flex items-center justify-center shadow-md">
            <FaPlus size={14} />
          </Link>
        </div>
      </div>
    </div>
  );

  // -------------------- Stats Cards --------------------
  const StatsCards = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-xs text-gray-700">تعداد سفارش</p>
          <div className="bg-blue-100 p-2 rounded-lg"><FaTruck className="text-blue-500 text-sm" /></div>
        </div>
        <p className="text-xl font-bold text-right mt-4">{myoffereLength.toLocaleString('fa-IR')}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-xs text-gray-700">درآمد (تومان)</p>
          <div className="bg-green-100 p-2 rounded-lg"><FaRegMoneyBillAlt className="text-green-600 text-sm" /></div>
        </div>
        <p className="text-xl font-bold text-right mt-4">{(totalIncome / 10).toLocaleString('fa-IR')}</p>
      </div>
    </div>
  );

  // -------------------- Nav & Layout --------------------
  return (
    <AuthGuardDriver>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-sm mx-auto bg-gray-100 relative">
          <HeaderPanel />
          <main className="p-4 space-y-4 pb-28">
            <UserInfo />
            <BalanceCard />
            <StatsCards />

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-800 text-white p-6 text-center relative">
                <p className="text-sm">دوستتو دعوت کن، جایزه بگیر</p>
                <p className="text-lg font-bold mt-1">اینبار رفاقت پولسازه!</p>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="font-bold text-gray-400">InBaar</span>
                <Link href="/driver/invite" className="border border-gray-400 text-gray-700 py-1 px-4 rounded-lg text-xs">دعوت از دوستان</Link>
              </div>
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200 z-50">
            <div className="flex justify-around items-center h-20">
              <Link href="/driver/panelDriver" className="flex flex-col items-center gap-1 text-gray-500"><FiUser size={24} /><span className="text-[10px]">پروفایل</span></Link>
              <Link href="/driver/orders" className="flex flex-col items-center gap-1 text-gray-500"><FiBox size={24} /><span className="text-[10px]">سفارشات</span></Link>
              <div className="relative w-16 h-16">
                <Link href="/driver/roadDriver" className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white"><FiTruck size={28} className="text-white" /></Link>
              </div>
              <Link href="/driver/driverWallet" className="flex flex-col items-center gap-1 text-gray-500"><FiCreditCard size={24} /><span className="text-[10px]">کیف پول</span></Link>
              <Link href="/driver/orderReport" className="flex flex-col items-center gap-1 text-gray-900 font-bold"><FiHome size={24} /><span className="text-[10px]">خانه</span></Link>
            </div>
          </footer>
        </div>
      </div>
    </AuthGuardDriver>
  );
};

export default DashboardDriver;
