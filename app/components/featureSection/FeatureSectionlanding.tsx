
import React from 'react';
import FeatureSection from './FeatureSection';

const featureOneData = {
  title: "بهترین رابط کاربری.",
  subtitle: "راز تجاری ما.",
  description: "بر اساس گروپخورد معامله‌گران ما ساخته شده است. اجزا را با کشیدن و رها کردن (drag and drop) برای تنظیم بی‌نقص خود تنظیم کنید. صفحات معاملاتی سفارشی جداگانه برای دارایی‌ها، استراتژی‌ها یا چندین کاربر مختلف ایجاد کنید. ویجت‌های هر اضافه کنید. ما استاندارد جدیدی را در قابلیت سفارشی‌سازی تعیین می‌کنیم.",
  linkText: "افتتاح حساب",
  imageUrl: "/images/feature2.webp"
};

const featureTwoData = {
  title: "استراتژی.",
  subtitle: "وقتی طرحی به نتیجه می‌رسد.",
  description: "ما بهترین ابزارها را برای شما ساخته‌ایم تا بتوانید استراتژی معاملاتی خود را ایجاد، شکل‌دهی و بهینه‌سازی کنید. با ابزار موقعیت‌ساز، معیارهای دریپیت و سایر ابزارهای تحلیلی درجه یک ما آشنا شوید.",
  linkText: "ابزارهای ما را ببینید",
  imageUrl: "/images/feature1.webp"
};


const FeatureSectionlanding: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      <main className="container mx-auto px-6 py-16 md:py-24">
        <FeatureSection
          title={featureOneData.title}
          subtitle={featureOneData.subtitle}
          description={featureOneData.description}
          linkText={featureOneData.linkText}
          imageUrl={featureOneData.imageUrl}
          imagePosition="left"
        />
        <FeatureSection
          title={featureTwoData.title}
          subtitle={featureTwoData.subtitle}
          description={featureTwoData.description}
          linkText={featureTwoData.linkText}
          imageUrl={featureTwoData.imageUrl}
          imagePosition="right"
        />
      </main>
    </div>
  );
};

export default FeatureSectionlanding;
