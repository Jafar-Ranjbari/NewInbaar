"use client";
import React, { useState } from "react";
import NewsCard from "./ServiceCard";
import { NewsItem } from "./type";

// Mock Data matching the screenshot
const INITIAL_DATA: NewsItem[] = [
   {
  id: "4",
  title: "نفوذ به قراردادهای هوشمند؛ موج جدید سوءاستفاده از باگ‌های دیفای",
  category: "کریپتو و بلاک‌چین",
  date: "۱۴۰۴/۰۸/۲۶",
  imageUrl: "https://picsum.photos/id/315/400/300",
  accentColor: "purple",
},
{
  id: "5",
  title: "افزایش حملات فیشینگ به والت‌ها؛ کاربران هدف اصلی هکرهای کریپتو",
  category: "کریپتو و بلاک‌چین",
  date: "۱۴۰۴/۰۸/۲۶",
  imageUrl: "https://picsum.photos/id/211/400/300",
  accentColor: "orange",
},
{
  id: "6",
  title: "جعل تراکنش‌های Layer-2؛ تهدیدی تازه برای شبکه‌های مقیاس‌پذیر",
  category: "کریپتو و بلاک‌چین",
  date: "۱۴۰۴/۰۸/۲۵",
  imageUrl: "https://picsum.photos/id/122/400/300",
  accentColor: "blue",
},
{
  id: "7",
  title: "تحلیل حمله MEV؛ چطور ربات‌ها بازار کریپتو را دستکاری می‌کنند؟",
  category: "کریپتو و بلاک‌چین",
  date: "۱۴۰۴/۰۸/۲۵",
  imageUrl: "https://picsum.photos/id/402/400/300",
  accentColor: "green",
},
{
  id: "8",
  title: "ریسک‌های امنیتی بریج‌های کراس‌چین؛ نقطه ضعف مشترک بلاک‌چین‌ها",
  category: "کریپتو و بلاک‌چین",
  date: "۱۴۰۴/۰۸/۲۵",
  imageUrl: "https://picsum.photos/id/54/400/300",
  accentColor: "cyan",
},
{
  id: "9",
  title: "افشای بدافزارهای استخراج مخفی؛ ماینینگ بدون اجازه دوباره اوج گرفت",
  category: "کریپتو و بلاک‌چین",
  date: "۱۴۰۴/۰۸/۲۴",
  imageUrl: "https://picsum.photos/id/89/400/300",
  accentColor: "amber",
}

];

const AllServiceCard3: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_DATA);
 
  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            مرکز خبرهای
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            آخرین اخبار و تحولات دنیای  کریپتو و بلاک‌چین را در اینجا دنبال کنید.
          </p>
        </div>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

   
    </div>
  );
};

export default AllServiceCard3;
