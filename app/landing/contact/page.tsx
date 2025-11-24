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
                <h2 className="text-3xl font-bold mb-2">⭐ آپشن  گروپ      </h2>
            </div>
            <div className="space-y-10 text-right">
                {/* فرم گروپخورد */}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mt-8">
                    <div className="flex items-center justify-start mb-3">
                        <FaCommentDots className="ml-2 text-purple-500 text-xl" />
                        <h3 className="text-xl font-semibold">ارسال نظر یا سوال</h3>
                    </div>

                    <form className="space-y-4 text-right">
                        <div>
                            <label className="block mb-1 text-gray-700">نام</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-gray-700">شماره همراه (اختیاری)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-700">ایمیل (اختیاری)</label>
                                <input
                                    type="email"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-700">متن سوال یا دیدگاه</label>
                            <textarea
                                rows={4}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <button
                            type="button"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            ارسال
                        </button>

                        <p className="text-sm text-gray-500 mt-2">
                            وارد کردن شماره همراه و ایمیل اختیاری می‌باشد و فقط جهت اطلاع‌رسانی از دریافت پاسخ استفاده خواهد شد.
                        </p>
                    </form>
                </div>


            </div>
        </section>
    );
}
