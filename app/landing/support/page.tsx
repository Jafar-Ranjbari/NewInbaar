"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
    title: string;
    desc: string;
    time: string;
};

// Sample data
const items: Item[] = [
    {
        title: "مقالات آموزشی",
        desc: "راهنمای امکانات سایت: توضیح و معرفی صفحات سایت، اعلام تغییرات ، راهنمایی امکانات باکس‌ها و فیلدهایی که در سایت به کار رفته‌اند",
        time: "1 دقیقه",
    },
    {
        title: "دیده بان جدید آپشن گروپ",
        desc: "ابزار حرفه‌ای رصد و تحلیل آپشن با امکان شخصی‌سازی کامل، باکس‌های قابل تغییر اندازه و محاسبات پیشرفته.",
        time: "2 دقیقه",
    },
    {
        title: "راهنمای فیلتر های پایه دیده بان",
        desc: "راهنمای استفاده از فیلترهای پایه در دیده‌بان.",
        time: "2 دقیقه",
    },
];

export default function GuideList() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <div>
            <div className="w-full flex flex-col md:flex-row items-start gap-6 mb-6 m-24">
                <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-bold text-blue-900">مقالات آموزشی</h1>
                    <p className="text-sm text-gray-100 leading-6">
                        راهنمای امکانات سایت، توضیح و معرفی صفحات سایت، اعلام تغییرات و راهنمای امکانات باکس‌ها و فیلدهایی که در سایت به کار رفته‌اند
                    </p>
                </div>
                <div className="flex-1">
                    <img
                        src="/images/ap1.png"
                        alt="guide image"
                        className="w-full h-48 object-cover rounded-xl shadow"
                    />
                </div>
            </div>
            <div className="w-full mx-auto space-y-4 bg-gray-100 p-4">

                <div className="w-full mx-auto space-y-4 bg-gray-100 p-4">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-gray-50 shadow p-4 cursor-pointer border border-gray-200"
                            onClick={() => toggle(i)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") toggle(i);
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-black">{item.title}</h2>
                                <span className="text-sm opacity-70 text-blue-700">⌛ {item.time}</span>
                            </div>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <div className="pt-4 text-sm leading-6 opacity-90 text-cyan-500">{item.desc}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
