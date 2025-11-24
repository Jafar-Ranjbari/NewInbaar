 "use client";

import React from 'react';
import { SERVICES } from './constants';
import { ServiceCard } from './ServiceCard';
import { motion } from 'framer-motion';

const AllServiceCard2: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block relative"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-2 relative z-10 tracking-tight">
              خدمات
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-brand-light/50 -rotate-1 rounded-full -z-0"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed"
          >
            راهکارهای تخصصی و جامع امنیت سایبری برای حفاظت از سرمایه‌های دیجیتال شما
          </motion.p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              data={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllServiceCard2;
