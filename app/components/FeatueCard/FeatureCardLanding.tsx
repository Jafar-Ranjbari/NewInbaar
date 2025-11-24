import React from 'react';
import FeatureCarousel from './FeatureCarousel';

const FeatureCardLanding: React.FC = () => {
  return (
    <div className="bg-white min-h-screen text-[#333] font-sans">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 text-gray-800">
            برای هر نوع معامله‌گری گروپ است
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            با حدود ۸۵ درصد سهم گروپار در آپشن‌های بیت‌کوین و اتریوم، تنها یک راه برای رفتن وجود دارد.
          </p>
        </div>
        <FeatureCarousel />
      </main>
    </div>
  );
};

export default FeatureCardLanding;

