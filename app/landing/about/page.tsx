'use client';
import { useState } from "react";
import { FaUsers, FaRocket, FaCommentDots, FaHandshake } from "react-icons/fa";

export default function AboutSection() {
  const [feedback, setFeedback] = useState("");

  return (
    <section
      dir="rtl"
      className="bg-gray-50 py-14 px-4 sm:px-8 md:px-12 lg:px-24 rtl text-gray-800 leading-relaxed font-[IRANSans]"
    >
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">⭐ آپشن  گروپ - اختیار معامله</h2>
        <p className="text-gray-600">معامله هوشمندانه با آپشن  گروپ</p>
      </div>

      <div className="space-y-10 text-right">
        {/* بخش تیم متخصص */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-start mb-3">
            <FaUsers className="ml-2 text-blue-500 text-xl" />
            <h3 className="text-xl font-semibold">تیم متخصص ما</h3>
          </div>
          <p className="text-gray-700">
            وب‌سایت آپشن‌گروپ توسط گروهی متشکل از متخصصین مالی و نرم‌افزاری توسعه یافته است.
            هدف ما رصد گروپار مشتقه در بورس اوراق بهادار تهران، پردازش اطلاعات و ارائه
            بهترین و دقیق‌ترین ابزارهای کمکی برای معامله‌گران و تحلیل‌گران این گروپار است.
          </p>
        </div>

        {/* بخش توسعه مستمر */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-start mb-3">
            <FaRocket className="ml-2 text-green-500 text-xl" />
            <h3 className="text-xl font-semibold">توسعه مستمر 🚀</h3>
          </div>
          <p className="text-gray-700">
            ما در آپشن‌گروپ به صورت پیوسته در حال بهبود امکانات فعلی و توسعه ابزارهای جدید هستیم.
            گروپخوردهای شما کاربران گرامی می‌تواند ما را در این مسیر یاری کند. لطفاً پیشنهادات و
            درخواست‌های خود را از طریق فرم زیر برای ما ارسال کنید.
          </p>
        </div>

        {/* جمله الهام‌بخش */}
        <div className="bg-gradient-to-l from-blue-50 to-blue-100 rounded-2xl p-6 text-blue-900 border
         border-blue-200 flex flex-col items-start gap-2">
          <FaHandshake className="text-blue-700 text-2xl" />
          <p>
            🤝 معامله هوشمندانه با آپشن  گروپ — جایی که تکنولوژی و شفافیت، قدرت تصمیم‌گیری را به شما می‌دهد!
            ما متعهد به ارائه ابزارهای دقیق، شفافیت کامل و بهینه‌سازی مداوم هستیم.
          </p>
        </div>
 

        {/* نمونه گفتگو */}
        <div className="bg-gray-100 rounded-2xl p-6 mt-8 text-sm leading-relaxed border border-gray-200">
          <p className="font-semibold text-gray-700">
            مرضیه هوشمندی • سه‌شنبه، ۲۵ شهریور ۱۴۰۴ - ۱۹:۱۵
          </p>
          <p className="mt-2 text-gray-800">
            سلام و عرض ادب<br />
            آیا در آپشن  گروپ با تمام شدن مهلت اگر سهام فروش نرفته باشد می‌توان برداشت زد یا کل سهم از دست خواهد رفت؟
          </p>

          <div className="border-r-4 border-blue-400 pr-3 mt-4">
            <p className="font-semibold text-blue-700">
              آپشن  گروپ • چهارشنبه، ۲۶ شهریور ۱۴۰۴ - ۰:۱۱
            </p>
            <p className="mt-1 text-gray-700">
              سلام، در پایان مهلت، موقعیت‌های گروپ بر اساس نوع قرارداد تسویه می‌شوند...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
