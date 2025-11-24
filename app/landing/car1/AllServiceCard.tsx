import React from 'react';
import { SERVICE_ITEMS } from './canstans';
import { ServiceCard } from './ServiceCard';

const AllServiceCard: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-20 md:px-8 lg:px-16" dir="rtl">
      
      <div className="mx-auto max-w-7xl">
        {/* Optional Header Section if needed later */}
        <div className="mb-16 text-center hidden">
          <h2 className="text-3xl font-bold text-gray-800">خدمات ما</h2>
          <p className="mt-4 text-gray-600">راهکارهای جامع برای کسب و کار شما</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {SERVICE_ITEMS.map((item) => (
            <ServiceCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default AllServiceCard;

