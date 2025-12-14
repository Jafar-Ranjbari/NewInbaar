"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import {
  BsPerson,
  BsTruck,
  BsWallet,
  BsLock,
  BsBell,
  BsHeadset,
  BsEnvelope,
  BsChatDots,
  BsFileText,
  BsChevronLeft,
} from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "@/app/store/useAuthStore";
import { getCompanyByUserId } from "../companyService";

interface Badge {
  count: number;
  color: string;
}

interface SettingsItemProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  badge?: Badge;
  link: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  link,
}) => (
  <Link
    href={link}
    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
  >
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-gray-600 text-2xl">
        {icon}
      </div>
      <div className="flex-1 text-right">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {badge && (
        <div
          className={`flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white rounded-full ${badge.color}`}
        >
          {badge.count}
        </div>
      )}
      <BsChevronLeft className="text-gray-400" />
    </div>
  </Link>
);

const ProfileScreen: React.FC = () => {
  const settingsItems: SettingsItemProps[] = [
    {
      icon: <BsPerson />,
      title: "اطلاعات  هویتی",
      subtitle: "حقیقی / حقوقی",
      badge: { count: 10, color: "bg-orange-500" },
      link: "/company/infoCompany",
    },

    {
      icon: <BsWallet />,
      title: "کیف پول",
      subtitle: "شارژ کیف پول، واریز و برداشت",
      badge: { count: 1, color: "bg-red-600" },
      link: "/company/CompanyWallet",
    },
    {
      icon: <BsWallet />,
      title: "گزارش مالی ",
      subtitle: "گزارش مالی  و تراکنش  ها  ",
      badge: { count: 1, color: "bg-red-600" },
      link: "/company/CompanyWallet",
    },
    {
      icon: <BsLock />,
      title: "امنیت و حریم خصوصی",
      subtitle: "رمز عبور و امنیت حساب",
      link: "/driver/security",
    },
    {
      icon: <BsBell />,
      title: "اطلاع رسانی",
      subtitle: "تنظیمات نوتیفیکیشن",
      link: "/driver/notifications",
    },
  ];

  const generalItems: SettingsItemProps[] = [
    {
      icon: <BsHeadset />,
      title: "پشتیبانی",
      subtitle: "گفتگو، تماس و سوالات متداول",
      link: "/driver/support",
    },
    {
      icon: <BsEnvelope />,
      title: "دعوت دوستان",
      subtitle: "دعوت از رانندگان",
      link: "/driver/invite",
    },
    {
      icon: <BsChatDots />,
      title: "ثبت ایده‌ها و نظرات",
      subtitle: "برای ارائه خدمات بهتر",
      link: "/driver/feedback",
    },
    {
      icon: <BsFileText />,
      title: "اینبار",
      subtitle: "قوانین و شرایط، درباره ما",
      link: "/driver/about",
    },
  ];

  const { currentUser } = useAuthStore();
 
  return (
    <div dir="rtl" className="bg-gray-50">
      <div className="w-full max-w-sm mx-auto bg-white min-h-screen">
        <header className="bg-black text-white px-6 py-8">
          <div className="text-center text-lg font-bold">پروفایل</div>
          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 text-right">
              <h1 className="text-xl font-bold"> {currentUser?.fullName} </h1>
              {/* <p className="text-gray-400">پیکان وانت</p> */}
            </div>
            <div className="w-20 h-20 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
              <FaUserCircle className="text-6xl text-gray-400" />
            </div>
          </div>
        </header>

        <main className="bg-white rounded-t-3xl -mt-6 p-6">
          <section>
            <h2 className="text-right font-bold text-gray-500 mb-2">تنظیمات</h2>
            <div>
              {settingsItems.map((item, index) => (
                <SettingsItem key={index} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-right font-bold text-gray-500 mb-2">عمومی</h2>
            <div>
              {generalItems.map((item, index) => (
                <SettingsItem key={index} {...item} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfileScreen;
