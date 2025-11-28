 "use client"
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { BsBoxSeam } from 'react-icons/bs';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
// فرض می‌کنیم تایپ‌ها و سرویس در این مسیرها قرار دارند
import { getPaymentsByDriverId } from './../driverService'; 
import { PaymentDriver } from '../../types'; 

// --- نگاشت‌های کمکی ---

const FA_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const DRIVER_ID = "1763561536267";

// --- توابع کمکی ---

const formatAmount = (amountInRials: number): string => {
    // تبدیل ریال به تومان (تقسیم بر 10) و فرمت‌بندی
    const amountInTomans = amountInRials / 10;
    return amountInTomans.toLocaleString('fa-IR');
};

const prepareChartData = (payments: PaymentDriver[], year: number, month: number): { day: string; amount: number; label?: string; }[] => {
    const filteredPayments = payments.filter(p => p.year === year && p.month === month);
    
    const dailyIncome = filteredPayments.reduce((acc, curr) => {
        const dayKey = curr.day.toString();
        acc[dayKey] = (acc[dayKey] || 0) + curr.amount;
        return acc;
    }, {} as Record<string, number>);

    // تعداد روزهای ماه جاری شمسی را باید از کتابخانه تاریخ شمسی گرفت.
    // در اینجا برای سادگی، 31 روز در نظر گرفته می‌شود.
    const daysInMonth = 31; 
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const dayFa = i.toLocaleString('fa-IR');
        const amount = dailyIncome[i.toString()] || 0;
        let label = amount > 0 ? formatAmount(amount) : undefined;
        
        data.push({
            day: dayFa,
            amount: amount,
            label: label,
        });
    }

    // بازگرداندن ۱۰ روز آخر برای نمودار
    return data.slice(-10);
};

// --- کامپوننت‌های فرعی (به‌روزرسانی شده) ---

const TransactionItem: React.FC<{ transaction: PaymentDriver }> = ({ transaction }) => {
    const amountInTomans = formatAmount(transaction.amount);
    
    return (
        <div className="flex items-center justify-between text-right py-3 border-b border-gray-100">
            <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-800">{amountInTomans}</span>
                <span className="text-xs text-gray-500 mt-1">تومان</span>
            </div>

            <div className="flex-1 flex items-center justify-end mx-4">
                <div className="flex flex-col items-end">
                    <span className="font-bold text-sm text-gray-800">
                        {transaction.payType === 'CASH' ? 'پرداخت نقدی' : 'پرداخت آنلاین'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                        {transaction.day.toLocaleString('fa-IR') + ' ' + FA_MONTHS[transaction.month - 1]}
                    </span>
                </div>
                <div className="ml-4 bg-blue-500 text-white p-3 rounded-full flex-shrink-0">
                    <BsBoxSeam size={20} />
                </div>
            </div>
        </div>
    );
};

const TransactionsSheet: React.FC<{ payments: PaymentDriver[], year: number, month: number }> = ({ payments, year, month }) => {
    const filteredPayments = payments
        .filter(p => p.year === year && p.month === month)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // کلاس h-full و flex-grow برای اطمینان از اینکه شیفت بخش اصلی را پر کرده و اسکرول داخلی دارد، ضروری است.
    return (
        <div className="bg-white text-gray-800 rounded-t-3xl h-full p-4 flex flex-col shadow-xl flex-grow overflow-hidden">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4 flex-shrink-0" />
            <div className="flex justify-between items-center mb-6 px-2 flex-shrink-0">
                <h2 className="font-bold text-lg">پرداختی‌ها در {FA_MONTHS[month - 1]}</h2>
                <div className="flex items-center text-gray-500 text-sm cursor-pointer">
                    <span>جزئیات</span>
                    <FaChevronDown className="mr-2 h-3 w-3" />
                </div>
            </div>
            {/* این div برای ایجاد اسکرول داخلی لیست تراکنش‌ها ضروری است */}
            <div className="space-y-4 overflow-y-auto pb-4 px-2">
                {filteredPayments.length > 0 ? (
                    filteredPayments.map(tx => (
                        <TransactionItem key={tx.id} transaction={tx} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">هیچ پرداختی در این ماه ثبت نشده است.</p>
                )}
            </div>
        </div>
    );
};

// onClose از props حذف شد و دکمه بستن حذف شد
const ChartCard: React.FC<{ totalIncome: number; chartData: any[]; activeMonthName: string }> = ({ totalIncome, chartData, activeMonthName }) => {
    const totalIncomeInTomans = formatAmount(totalIncome);

    return (
        <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 text-white text-right shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">گزارش مالی {activeMonthName}</h2>
                {/* دکمه بستن به کامپوننت اصلی منتقل شده است */}
            </div>
            
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-3xl font-bold tracking-wider">{totalIncomeInTomans}</span>
                    <span className="text-lg mr-2">تومان</span>
                </div>
            </div>
            <p className="text-gray-400 text-sm mt-1">مجموع درآمد در ماه جاری</p>

            <div className="mt-8 h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 25, right: 0, left: 0, bottom: 5 }}>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a0a0a0', fontSize: 12 }}
                            dy={10}
                            interval={0}
                        />
                        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                            <LabelList 
                                dataKey="label" 
                                position="top" 
                                fill="#4ade80" 
                                fontSize={10} 
                                dy={-5} 
                                // اصلاح نهایی تایپ: شامل boolean برای رفع خطای ts(2322)
                                formatter={(value: number | string | undefined | null | boolean) => (value ? String(value) : '')}
                            />
                            {chartData.map((entry: any, index: number) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.amount > 0 ? '#45f3c2' : '#374151'}
                                    className="transition-opacity hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- کامپوننت اصلی ReportFinanacrdriver ---

interface ReportFinanacrdriverProps {
    isVisible: boolean;
    onClose: () => void;
}

const ReportFinanacrdriver: React.FC<ReportFinanacrdriverProps> = ({ isVisible, onClose }) => {
    
    const initialYear = 1404;
    const initialMonth = 3; 

    const [allPayments, setAllPayments] = useState<PaymentDriver[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);

    const availableYears = [1404, 1403];
    
    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const data = await getPaymentsByDriverId(DRIVER_ID);
                setAllPayments(data);
                // پس از دریافت داده، اولین سال/ماه دارای داده را انتخاب کنید
                if (data.length > 0) {
                    // در این پیاده‌سازی ساده، ما همچنان پیش‌فرض را حفظ می‌کنیم
                    // برای یک پیاده‌سازی کامل، باید از آخرین تاریخ داده‌ها استفاده شود.
                }
            } catch (error) {
                console.error("Failed to fetch payments:", error);
                setAllPayments([]);
            } finally {
                setLoading(false);
            }
        };

        if (isVisible) {
            fetchPayments();
        }
    }, [isVisible]);

    const totalMonthlyIncome = useMemo(() => {
        return allPayments
            .filter(p => p.year === selectedYear && p.month === selectedMonth)
            .reduce((sum, current) => sum + current.amount, 0);
    }, [allPayments, selectedYear, selectedMonth]);

    const currentChartData = useMemo(() => {
        return prepareChartData(allPayments, selectedYear, selectedMonth);
    }, [allPayments, selectedYear, selectedMonth]);

    if (!isVisible) return null;
    if (loading) return (
        <div dir="rtl" className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-gray-800">
                <p>در حال بارگذاری گزارش مالی...</p>
            </div>
        </div>
    );

    return (
        <div 
            dir="rtl" 
            className="fixed inset-0 z-50 overflow-hidden"
        >
            {/* 2. پس‌زمینه با opacity-90 برای تاریک کردن کامل صفحه زیرین */}
            <div 
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'opacity-90' : 'opacity-0'}`} 
                onClick={onClose}
            ></div>

            <div 
                className={`absolute bottom-0 w-full max-w-md mx-auto h-[90vh] bg-slate-900 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out 
                ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ left: '50%', transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)' }}
            >
                {/* اضافه شدن relative برای محتوای اصلی برای قرارگیری دکمه absolute */}
                <div className="flex flex-col h-full  overflow-y-auto relative"> 
                    
                    {/* 1. دکمه ضربدر در بالا و سمت چپ (برای RTL) */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 left-4 z-10 text-gray-400 hover:text-white transition-colors p-2"
                        aria-label="بستن گزارش مالی"
                    >
                        <FaTimes size={20} />
                    </button>

                    <header className="px-4 pt-8 pb-4 text-white flex-shrink-0">
                        
                        {/* فیلتر سال */}
                        <div className="flex justify-center items-center mb-6">
                             <h3 className="text-gray-400 ml-4">سال:</h3>
                            {availableYears.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`px-4 py-1.5 mx-1 rounded-full text-sm transition-colors duration-200 font-semibold ${
                                        selectedYear === year
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {year.toLocaleString('fa-IR')}
                                </button>
                            ))}
                        </div>

                        {/* فیلتر ماه */}
                        <div className="flex justify-start items-center space-x-2 space-x-reverse mb-4 overflow-x-auto pb-2">
                             <h3 className="text-gray-400 ml-4 flex-shrink-0">ماه:</h3>
                            {FA_MONTHS.map((monthName, index) => {
                                const monthValue = index + 1;
                                return (
                                    <button
                                        key={monthName}
                                        onClick={() => setSelectedMonth(monthValue)}
                                        className={`px-4 py-1.5 rounded-full text-sm transition-colors duration-200 font-semibold flex-shrink-0 ${
                                            selectedMonth === monthValue
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {monthName}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="px-4 pt-2">
                            {/* ChartCard بدون دکمه بستن صدا زده می‌شود */}
                           <ChartCard 
                                totalIncome={totalMonthlyIncome}
                                chartData={currentChartData}
                                activeMonthName={`${FA_MONTHS[selectedMonth - 1]} ${selectedYear.toLocaleString('fa-IR')}`}
                            />
                        </div>
                    </header>

                    {/* 3. بخش اصلی که به TransactionsSheet اجازه می‌دهد لیست را اسکرول کند */}
                    <main className="flex-grow flex flex-col overflow-hidden">
                        <TransactionsSheet 
                            payments={allPayments}
                            year={selectedYear}
                            month={selectedMonth}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ReportFinanacrdriver;