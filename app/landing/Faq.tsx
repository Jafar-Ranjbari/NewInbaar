"use client";
import { useState } from "react";
import { FaChevronDown, FaBitcoin, FaChartLine, FaShieldAlt } from "react-icons/fa";

const faqs = [
    {
        icon: <FaBitcoin className="text-yellow-400 text-xl" />,
        question: "کریپتو آپشن چیست؟",
        answer:
            "کریپتو آپشن قراردادی است که به شما حق خرید یا فروش رمزارز در قیمتی مشخص تا زمان معین را می‌دهد. این ابزار برای پوشش ریسک یا کسب سود از نوسانات گروپار استفاده می‌شود.",
    },
    {
        icon: <FaChartLine className="text-green-400 text-xl" />,
        question: "چطور معاملات آپشن با اسپات تفاوت دارد؟",
        answer:
            "در اسپات، شما رمزارز واقعی را خریداری می‌کنید؛ اما در آپشن فقط از تغییرات قیمت سود یا زیان می‌کنید، بدون مالکیت مستقیم بر دارایی.",
    },
    {
        icon: <FaShieldAlt className="text-blue-400 text-xl" />,
        question: "آیا معاملات آپشن در ایران قانونی است؟",
        answer:
            "در حال حاضر قوانین مشخصی برای معاملات آپشن رمزارز در ایران وجود ندارد. توصیه می‌شود از پلتفرم‌های معتبر بین‌المللی و با رعایت مدیریت ریسک استفاده کنید.",
    },
    {
        icon: <FaBitcoin className="text-orange-400 text-xl" />,
        question: "برای شروع به چه مقدار سرمایه نیاز دارم؟",
        answer:
            "می‌توانید با سرمایه‌ی اندک و حساب دمو شروع کنید تا با مفاهیم آپشن و نحوه‌ی عملکرد گروپار آشنا شوید.",
    },
    {
        icon: <FaChartLine className="text-purple-400 text-xl" />,
        question: "چگونه استراتژی‌های آپشن را یاد بگیرم؟",
        answer:
            "در بخش آموزش سایت، مقالات و ویدیوهای آموزشی درباره‌ی تحلیل گروپار و استراتژی‌های آپشن کریپتو در دسترس شماست.",
    },
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="bg-[#0a1125] text-gray-200 py-16 px-6">
            <div className="max-w-5xl mx-auto text-right">
                <h2 className="text-3xl font-bold text-center text-white mb-10">
                    سؤالات متداول
                </h2>

                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#111b3a] border border-gray-700 rounded-2xl shadow-md overflow-hidden transition hover:border-blue-500"
                        >
                            <button
                                className="w-full flex justify-between items-center p-4 text-right"
                                onClick={() =>
                                    setOpenIndex(openIndex === index ? null : index)
                                }
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="font-semibold text-sm md:text-base text-white">
                                        {item.question}
                                    </span>
                                </div>
                                <FaChevronDown
                                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-180 text-blue-400" : ""
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="px-5 pb-4 text-sm leading-6 text-gray-400">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
