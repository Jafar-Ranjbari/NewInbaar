 "use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { BsBoxSeam } from 'react-icons/bs';
import { FaChevronDown, FaTimes } from 'react-icons/fa'; // آیکون بستن مودال

// --- داده‌های ثابت و کمک‌کننده‌ها ---

// Status (تغییر نام برای جلوگیری از تکرار در صورت وجود در فایل‌های دیگر)
const TransactionStatusReport = {
    Processing: 'در حال پردازش',
    Paid: 'پرداخت شده',
    Completing: 'در حال تکمیل',
    Rejected: 'رد شده',
};

// تراکنش‌های نمونه
const sampleTransactions = [
    { id: 1, name: 'آکوشیک', date: '۱۴۰۲/۰۲/۰۱', amount: '۱,۲۵۰,۰۰۰', status: TransactionStatusReport.Processing },
    { id: 2, name: 'شکرافشان', date: '۱۴۰۲/۰۲/۰۱', amount: '۱,۲۵۰,۰۰۰', status: TransactionStatusReport.Paid },
    { id: 3, name: 'خوشاب', date: '۱۴۰۲/۰۲/۰۱', amount: '۱,۲۵۰,۰۰۰', status: TransactionStatusReport.Completing },
    { id: 4, name: 'زرماکارون', date: '۱۴۰۲/۰۲/۰۱', amount: '۱,۲۵۰,۰۰۰', status: TransactionStatusReport.Rejected },
    { id: 5, name: 'تولیدی پوشاک', date: '۱۴۰۲/۰۲/۰۱', amount: '۱,۲۵۰,۰۰۰', status: TransactionStatusReport.Paid },
];

// داده‌های نمودار نمونه
const chartData = [
    { day: '۲۵', amount: 0 }, { day: '۲۴', amount: 0 }, { day: '۲۳', amount: 0 },
    { day: '۲۲', amount: 0 }, { day: '۲۱', amount: 0 }, { day: '۲۰', amount: 0 },
    { day: '۱۹', amount: 200000 },
    { day: '۱۸', amount: 1025000, label: '۱,۰۲۵,۰۰۰' },
    { day: '۱۷', amount: 400000 },
    { day: '۱۶', amount: 700000 },
].reverse();

// --- کامپوننت‌های کمکی ---

const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
        [TransactionStatusReport.Processing]: 'bg-blue-500 text-white',
        [TransactionStatusReport.Paid]: 'bg-teal-200 text-teal-800',
        [TransactionStatusReport.Completing]: 'bg-purple-400 text-white',
        [TransactionStatusReport.Rejected]: 'bg-red-500 text-white',
    };
    const style = statusStyles[status as keyof typeof TransactionStatusReport] || 'bg-gray-400 text-white';

    return (
        <div className={`mt-1 text-xs font-semibold px-3 py-1 rounded-full w-fit ${style}`}>
            {status}
        </div>
    );
};

const TransactionItem = ({ transaction }: { transaction: typeof sampleTransactions[0] }) => {
    return (
        <div className="flex items-center justify-between text-right">
            <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-500">{transaction.amount}</span>
                <span className="text-xs text-gray-400 mt-1">{transaction.date}</span>
            </div>

            <div className="flex-1 flex items-center justify-end mx-4">
                <div className="flex flex-col items-end">
                    <span className="font-bold">{transaction.name}</span>
                    <StatusBadge status={transaction.status} />
                </div>
                <div className="ml-4 bg-blue-500 text-white p-3 rounded-full">
                    <BsBoxSeam size={20} />
                </div>
            </div>
        </div>
    );
};

const TransactionsSheet = () => {
    return (
        <div className="bg-white text-gray-800 rounded-t-3xl h-full p-4 flex flex-col shadow-xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
            <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="font-bold text-lg">سوابق تراکنش</h2>
                <div className="flex items-center text-gray-500 text-sm cursor-pointer">
                    <span>اسفند ۱۴۰۴</span>
                    <FaChevronDown className="mr-2 h-3 w-3" />
                </div>
            </div>
            <div className="space-y-4 overflow-y-auto pb-4">
                {sampleTransactions.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </div>
        </div>
    );
};

const ChartCard = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 text-white text-right shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">گزارش مالی</h2>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="بستن گزارش مالی"
                >
                    <FaTimes size={20} />
                </button>
            </div>
            
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-3xl font-bold tracking-wider">۱۲,۶۵۰,۰۰۰</span>
                    <span className="text-lg mr-2">تومان</span>
                </div>
                <div className="bg-green-500/20 text-green-400 text-sm font-semibold px-2 py-1 rounded-md">
                    +0.5%
                </div>
            </div>
            <p className="text-gray-400 text-sm mt-1">درآمد ۳۰ روز گذشته</p>

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
                            <LabelList dataKey="label" position="top" fill="#4ade80" fontSize={10} dy={-5} />
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.day === '۱۸' ? '#45f3c2' : '#374151'}
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

// --- کامپوننت اصلی ReportFinanacrdriver (مودال کشویی) ---

interface ReportFinanacrdriverProps {
    isVisible: boolean;
    onClose: () => void;
}

const ReportFinanacrdriver: React.FC<ReportFinanacrdriverProps> = ({ isVisible, onClose }) => {
    const months = ['اسفند', 'فروردین', 'اردیبهشت', 'خرداد'];
    const [activeMonth, setActiveMonth] = useState('خرداد');

    if (!isVisible) return null;

    return (
        // Overlay (پس‌زمینه تیره)
        <div 
            dir="rtl" 
            className="fixed inset-0 z-50 overflow-hidden"
        >
            {/* پس‌زمینه برای بستن با کلیک بیرون */}
            <div 
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'opacity-50' : 'opacity-0'}`} 
                onClick={onClose}
            ></div>

            {/* محتوای مودال (Sheet) */}
            <div 
                className={`absolute bottom-0 w-full max-w-md mx-auto h-[90vh] sm:h-auto sm:max-h-[90vh] bg-slate-900 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out 
                ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ left: '50%', transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)' }}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    <header className="px-4 pt-8 pb-4 text-white flex-shrink-0">
                        <div className="flex justify-center items-center space-x-2 space-x-reverse mb-4">
                            {months.map((month) => (
                                <button
                                    key={month}
                                    onClick={() => setActiveMonth(month)}
                                    className={`px-4 py-1.5 rounded-full text-sm transition-colors duration-200 font-semibold ${
                                        activeMonth === month
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                        <div className="px-4 pt-2">
                           <ChartCard onClose={onClose} />
                        </div>
                    </header>

                    <main className="flex-grow flex flex-col overflow-y-auto">
                        <TransactionsSheet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ReportFinanacrdriver;