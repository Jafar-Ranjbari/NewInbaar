export default function Footer() {
  return (
    <footer className="bg-[#0a1125] text-gray-300 py-10 mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 grid  grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* بخش برند */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">کریپتو آپشن</h2>
          <p className="text-2sm leading-6 text-gray-400">
            پلتفرم تخصصی تحلیل و معاملات آپشن در گروپار رمزارزها.
          </p>
        </div>

        {/* بخش منوها */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">دسترسی سریع</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">خانه</a></li>
            <li><a href="#" className="hover:text-white transition">تحلیل گروپار</a></li>
            <li><a href="#" className="hover:text-white transition">آپشن‌ها</a></li>
            <li><a href="#" className="hover:text-white transition">آموزش</a></li>
            <li><a href="#" className="hover:text-white transition">درباره ما</a></li>
          </ul>
        </div>

        {/* بخش خدمات */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">خدمات ما</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">تحلیل تکنیکال</a></li>
            <li><a href="#" className="hover:text-white transition">سیگنال روزانه</a></li>
            <li><a href="#" className="hover:text-white transition">مدیریت سبد</a></li>
            <li><a href="#" className="hover:text-white transition">مشاوره سرمایه‌گذاری</a></li>
          </ul>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">شبکه‌های اجتماعی</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">تلگرام</a></li>
            <li><a href="#" className="hover:text-white transition">توییتر</a></li>
            <li><a href="#" className="hover:text-white transition">اینستاگرام</a></li>
          </ul>
        </div>

      </div>

      {/* کپی‌رایت */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} کلیه حقوق محفوظ است | کریپتو آپشن
      </div>
    </footer>
  );
}
