import Image from 'next/image';
import React from 'react';
import { FaBitcoin } from 'react-icons/fa'; // ← اضافه کردن آیکن

const Hero: React.FC = () => {
  return (
    <main className="container mx-auto px-4 lg:px-8 py-7 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="text-right">
          <p className="text-blue-400 mb-4 text-sm font-medium flex items-center justify-end gap-2">
            <FaBitcoin className="text-yellow-400 text-xl" /> {/* ← آیکن */}
            ۱۵٬۲۱۰٬۸۵۳٬۹۹۱ دلار حجم معاملات ۲۴ ساعته:
          </p>

          <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold leading-tight flex items-center justify-end gap-2">
            کریپتو را معامله کنید
            <FaBitcoin className="text-yellow-500" />
          </h1>

          <p className="mt-6 text-x md:text-lg text-gray-300 max-w-xl ml-auto">
            قراردادهای آتی و قراردادهای لحظه‌ای در آپشن  . همین امروز ثبت نام کنید و شروع کنید.
          </p>

          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-xl ml-auto bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
            <input
              type="email"
              placeholder="شماره موبایل خود را وارد کنید  "
              className="flex-grow bg-transparent text-white placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 whitespace-nowrap flex items-center gap-2"
            >
              شروع کنید
              <FaBitcoin className="text-yellow-300" />
            </button>
          </form>

          <div className="mt-8 flex justify-center sm:justify-end gap-4">
            {/* <a href="#" className="inline-block"><AppStoreBadge /></a> */}
            {/* <a href="#" className="inline-block"><GooglePlayBadge /></a> */}
            {/* icon  .... */}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <img
            src="./images/hero-easy-trade.e578fc7.webp"
            alt="آپشن   mobile trading app"
            className="hidden md:block max-w-sm md:max-w-md lg:max-w-full -rotate-[5deg] transform"
          />

          {/* <Image
           src="./images/hero-easy-trade.e578fc7.webp" 
            alt="آپشن   mobile trading app" 
            className="max-w-sm md:max-w-md lg:max-w-full -rotate-[5deg] transform"
          />  */}
        </div>
      </div>
    </main>
  );
};

export default Hero;
