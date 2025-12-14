"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  FiBell,
  FiShoppingBag,
  FiSmile,
  FiCheckSquare,
  FiClipboard,
  FiChevronLeft,
  FiCreditCard,
  FiUser,
  FiPackage,
  FiPlus,
  FiHome,
  FiLogOut,
  FiLoader,
} from "react-icons/fi";
import { useAuthStore } from '../store/useAuthStore';
import { 
    getCompanyByUserId, 
    createCompany, 
    getCompanyWalletTransactions, 
    createCompanyWalletTransaction 
} from './companyService';
import { Company, CompanyType, WalletTransaction } from '../types';

// فرض می‌کنیم فایل types.ts و useAuthStore/userService در مسیرهای صحیح قرار دارند.

// ---------------- CustomLink ----------------
interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, className, onClick }) => (
  <Link href={href} className={className} onClick={onClick}>
    {children}
  </Link>
);

// ---------------- InfoCard ----------------
interface InfoCardProps {
  icon: IconType;
  title: string;
  href?: string;
  count?: number; // اضافه شده برای نمایش تعداد
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, href = "#", count }) => (
  <CustomLink
    href={href}
    className="bg-[#E0F7FA] rounded-2xl p-4 flex flex-col justify-between h-28 
               transform transition duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
  >
    <div className="flex justify-between items-start">
      <Icon className="w-8 h-8 text-[#00ACC1]" />
      <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
        {count !== undefined ? count.toLocaleString('fa-IR') : ''}
        <div className="w-3 h-3 border-2 border-black rounded-full hidden"></div>
      </div>
    </div>

    <div className="flex justify-between items-end">
      <p className="font-semibold text-sm">{title}</p>
      <FiChevronLeft className="w-5 h-5 rotate-180" />
    </div>
  </CustomLink>
);

// ---------------- BottomNavItem ----------------
interface BottomNavItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  hasNotification?: boolean;
  href?: string;
  onClick?: () => void;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  icon: Icon,
  label,
  active = false,
  hasNotification = false,
  href,
  onClick,
}) => (
  <CustomLink
    href={href || "#"}
    onClick={onClick}
    className={`flex flex-col items-center gap-1 text-xs font-medium p-1 ${active ? "text-blue-600" : "text-gray-400"
      } transition duration-150 hover:text-blue-500`}
  >
    <div className="relative">
      <Icon className="w-6 h-6" />
      {hasNotification && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-50"></div>
      )}
    </div>
    <span>{label}</span>
  </CustomLink>
);

// ---------------- Main Component ----------------
const DashboardCompany: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [initLoading, setInitLoading] = useState(true);
  const [company, setCompany] = useState<Partial<Company>>({});
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  // شبیه سازی داده های ثابت برای کارت ها
  const totalOrders = 85;
  const shippedGoods = 70;
  const regularCustomers = 10;
  const stores = 5;

  useEffect(() => {
    const init = async () => {
      if (!currentUser) {
        setInitLoading(false);
        return;
      }
      try {
        let comp = await getCompanyByUserId(currentUser.id);
        
        if (!comp) {
          // اگر شرکت وجود نداشت، آن را به عنوان حقیقی ایجاد کن
          const newComp = await createCompany(currentUser.id, CompanyType.REAL);
          comp = newComp;
        }
        
        setCompany(comp);
        
        const txs = await getCompanyWalletTransactions(comp.id);
        
        // محاسبه موجودی
        const currentBalance = txs.reduce((acc, curr) => acc + curr.balance_change, 0);
        setWalletBalance(currentBalance);
        setTransactions(txs);

        // منطق هدیه اولین ورود
        if (txs.length === 0) {
          const gift = await createCompanyWalletTransaction(comp.id, 100000, 'هدیه اولین ورود');
          setTransactions([gift]);
          setWalletBalance(100000); // موجودی را به‌روز کن
        }

      } catch (e) {
        console.error("خطا در بارگذاری اطلاعات داشبورد:", e);
      } finally {
        setInitLoading(false);
      }
    };
    init();
  }, [currentUser]);

  // اگر کاربر لاگین نکرده باشد
  if (!currentUser) return null; 

  // اگر در حال بارگذاری اولیه هستیم
  if (initLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  // نمایش نام شرکت/برند، در صورت وجود
  const companyName = company.id || "نام برند/شرکت";
  const repName = currentUser.fullName || "نماینده شرکت";
  
  // لینک‌های درخواستی
  const LINK_WALLET = "/company/CompanyWallet";
  const LINK_PROFILE = "/company/panelCompany";
  const LINK_ORDERS = "/company/order";
  const LINK_ORDER_Managment = "/company/OrderManagement";

  return (
    <div dir="rtl" className="bg-gray-200 min-h-screen flex justify-center">
      <div className="w-full max-w-sm bg-gray-50 flex flex-col font-sans shadow-lg">
        <main className="flex-grow overflow-y-auto pb-24">
          <div className="p-4 space-y-6">
            
            {/* Header Title & Logout */}
            <header className="flex justify-between items-center pt-2">
                <h1 className="text-2xl font-bold italic text-gray-800">inbaar</h1>
                <CustomLink 
                    href="#" 
                    onClick={logout} 
                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                >
                    <FiLogOut className="w-6 h-6" />
                </CustomLink>
            </header>

            {/* Profile Info */}
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-3 text-right">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center border-2 border-gray-300 overflow-hidden">
                  <img
                    src="https://picsum.photos/56/56"
                    alt="Company Logo"
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
                <div>
                  {/* نام شرکت داینامیک */}
                  <h2 className="font-bold text-lg">{companyName}</h2>
                  {/* نام نماینده */}
                  <p className="text-gray-500 text-sm">{repName}</p>
                </div>
              </div>
              
              <FiBell className="w-6 h-6 text-gray-600" />
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-2 gap-4">
              <InfoCard icon={FiShoppingBag} title="فروشگاه زنجیره ای" href="/stores" count={stores} />
              <InfoCard icon={FiSmile} title="مشتریان عادی" href="/company/payManagement" count={regularCustomers} />
              <InfoCard icon={FiCheckSquare} title="کالاهای ارسال شده" href="/shipped" count={shippedGoods} />
              <InfoCard icon={FiClipboard} title="کل سفارشات" href="/orders" count={totalOrders} />
            </div>

            {/* Promotion Banner */}
            <CustomLink
              href="/promotions"
              className="bg-blue-600 rounded-2xl p-4 flex items-center justify-between 
                          text-white relative h-32 overflow-hidden 
                          transform transition duration-150 hover:scale-[1.01] active:scale-[0.99] shadow-md"
            >
              <img
                src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/megaphone.png"
                alt="Megaphone"
                className="w-24 h-24 object-contain absolute -right-4 -bottom-2 rotate-[-20deg] opacity-70"
              />
              <div className="text-center w-full mr-16">
                <p className="font-bold text-lg">اینبار تبلیغات</p>
                <p className="font-bold text-lg">نتیجه دیگه ای میده!</p>
              </div>
            </CustomLink>

            {/* Wallet */}
            <CustomLink
              href={LINK_WALLET}
              className="bg-orange-500 rounded-2xl p-4 text-white relative overflow-hidden 
                          h-28 flex flex-col justify-between transform transition duration-150 
                          hover:scale-[1.01] active:scale-[0.99] shadow-md"
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm">موجودی کیف پول</p>
                <p className="text-xs font-semibold opacity-80">inbaar</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                {/* نمایش موجودی داینامیک */}
                <p className="font-bold text-xl">{walletBalance.toLocaleString('fa-IR')} ریال</p>
              </div>

              <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-white/20 rounded-full"></div>
              <div className="absolute left-5 bottom-5 w-10 h-10 bg-white/20 rounded-full"></div>
            </CustomLink>

            {/* Empty State / Tip */}
            {walletBalance === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                    <FiCreditCard className="w-16 h-16 text-red-400" />
                    <p className="text-gray-700 text-sm max-w-xs">
                        جهت استفاده از خدمات اینبار، ابتدا موجودی کیف پول خود را
                        <CustomLink
                            href={LINK_WALLET}
                            className="text-red-600 font-semibold mx-1 hover:underline"
                        >
                            افزایش
                        </CustomLink>
                        دهید
                    </p>
                </div>
            )}
            {walletBalance > 0 && transactions.length === 1 && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                    <p className="text-gray-700 text-sm font-semibold">
                        <FiCheckSquare className="inline w-4 h-4 ml-1" />
                        هدیه اولین ورود به مبلغ ۱۰۰,۰۰۰ ریال با موفقیت ثبت شد!
                    </p>
                </div>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-gray-50/90 backdrop-blur-sm border-t border-gray-200 z-10">
          <div className="flex justify-around items-center h-20 px-2">
            
            {/* Home */}
            <BottomNavItem icon={FiHome} label="خانه" active href="/company/panelCompany" />
            
            {/* Wallet */}
            <BottomNavItem icon={FiCreditCard} label="کیف پول" hasNotification={walletBalance === 0} href={LINK_WALLET} />

            {/* Add Order Button (Central Button) */}
            <CustomLink
              href={LINK_ORDERS}
              className="flex flex-col items-center -mt-8 transition duration-150 hover:scale-[1.05] active:scale-[0.95]"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700">
                <FiPlus className="w-8 h-8" />
              </div>
              <span className="text-xs text-gray-500 mt-1">بار جدید</span>
            </CustomLink>

            {/* Profile */}
            <BottomNavItem icon={FiUser} label="پروفایل" href={LINK_PROFILE} />
            
            {/* Orders */}
            <BottomNavItem icon={FiPackage} label="سفارشات" href={LINK_ORDER_Managment} />
            
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardCompany;