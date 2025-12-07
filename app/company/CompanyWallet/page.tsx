 "use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
    getCompanyByUserId,
    createCompany,
    getCompanyWalletTransactions, 
    createCompanyWalletTransaction, 
    getSmsCreditTransactions, 
    createSmsCreditTransaction 
} from '../companyService'; // از companyService استفاده می‌کنیم
import { WalletTransaction, SmsCreditTransaction, CompanyType } from '../../types';
import { Wallet, MessageSquare, Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

// ---------------- Helper Component for Transaction Item ----------------
interface TransactionItemProps {
    tx: WalletTransaction;
    isWallet: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ tx, isWallet }) => {
    // از آنجایی که SmsCreditTransaction نوع متفاوتی دارد، باید تفاوت را در مبلغ اعمال کنیم
    const isPositive = isWallet ? tx.balance_change > 0 : (tx as unknown as SmsCreditTransaction).amount > 0;
    
    const amountValue = isWallet ? tx.balance_change : (tx as unknown as SmsCreditTransaction).amount;

    // نمایش مبلغ/تعداد با واحد مناسب
    const amountDisplay = isWallet 
        ? `${amountValue.toLocaleString('fa-IR')} ریال`
        : `${amountValue.toLocaleString('fa-IR')} عدد`;
        
    const desc = tx.description || (isPositive ? (isWallet ? 'شارژ' : 'افزایش اعتبار') : (isWallet ? 'کسر موجودی' : 'استفاده از پیامک'));

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isPositive ? 'bg-gray-100' : 'bg-red-100'}`}>
                    {isPositive ? <ArrowUpCircle className="w-5 h-5 text-gray-600" /> : <ArrowDownCircle className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                    <p className="font-medium text-gray-800">{desc}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(tx.timestamp).toLocaleDateString('fa-IR')}
                    </p>
                </div>
            </div>
            <span className={`font-bold dir-ltr ${isPositive ? 'text-gray-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{amountDisplay}
            </span>
        </div>
    );
};


// ---------------- Main Component ----------------
const CompanyWallet: React.FC = () => {
    const { currentUser } = useAuthStore();
    
    const [companyID, setCompanyID] = useState<string | undefined>(undefined);
    const [txs, setTxs] = useState<WalletTransaction[]>([]);
    const [smsTxs, setSmsTxs] = useState<SmsCreditTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTopUpLoading, setIsTopUpLoading] = useState(false);
    const [isSmsBuyLoading, setIsSmsBuyLoading] = useState(false);
    
    // محاسبات موجودی
    const walletBalance = txs.reduce((a, b) => a + b.balance_change, 0);
    // در تراکنش پیامک، از فیلد 'amount' استفاده می‌کنیم
    const smsBalance = smsTxs.reduce((a, b) => a + b.amount, 0); 

    // ۱. بارگذاری داده‌های شرکت و تراکنش‌ها
    useEffect(() => {
        const loadData = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            try {
                let comp = await getCompanyByUserId(currentUser.id);
                if (!comp) {
                    comp = await createCompany(currentUser.id, CompanyType.REAL);
                }
                const cID = comp.id;
                setCompanyID(cID);

                // بارگذاری تراکنش‌های کیف پول و پیامک به صورت موازی
                const [walletTxs, smsCreditTxs] = await Promise.all([
                    getCompanyWalletTransactions(cID),
                    getSmsCreditTransactions(currentUser.id)
                ]);
                
                setTxs(walletTxs);
                setSmsTxs(smsCreditTxs);
                
            } catch (e) {
                console.error("خطا در بارگذاری کیف پول:", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentUser]);

    // ۲. مدیریت شارژ کیف پول (مثال: ۱۰۰,۰۰۰ ریال)
    const handleTopUp = async () => {
        if(!companyID) return;
        setIsTopUpLoading(true);
        try {
            const amount = 100000;
            const t = await createCompanyWalletTransaction(companyID, amount, 'شارژ آزمایشی');
            setTxs(prevTxs => [...prevTxs, t]);
            alert(`کیف پول با موفقیت شارژ شد: ${amount.toLocaleString('fa-IR')} ریال`);
        } catch (e) {
            alert('خطا در شارژ کیف پول');
        } finally {
            setIsTopUpLoading(false);
        }
    };
    
    // ۳. مدیریت خرید بسته پیامک (۵۰ عدد - ۵۰,۰۰۰ ریال)
    const handleBuySmsPackage = async () => {
        if(!currentUser || !companyID) return;
        setIsSmsBuyLoading(true);
        try {
            const smsCount = 50;
            const price = 50000; // هزینه به ریال (50,000 ریال)
            const costInToman = 5000; // هزینه به تومان (5,000 تومان)

            if(walletBalance < price) {
                alert('موجودی کیف پول کافی نیست.');
                return;
            }
            
            // ۱. کسر از کیف پول (تراکنش منفی)
            const walletTx = await createCompanyWalletTransaction(companyID, -price, `خرید بسته پیامک ${smsCount} تایی`);
            setTxs(prevTxs => [...prevTxs, walletTx]);

            // ۲. افزودن اعتبار پیامک (استفاده از آرگومان cost)
            const smsTx = await createSmsCreditTransaction(currentUser.id, smsCount, costInToman, `خرید بسته`);
            setSmsTxs(prevSmsTxs => [...prevSmsTxs, smsTx]);
            
            alert(`بسته پیامک ${smsCount} تایی با موفقیت خریداری شد. ${price.toLocaleString('fa-IR')} ریال از کیف پول کسر گردید.`);
        } catch (e) {
            alert('خطا در خرید بسته پیامک');
        } finally {
            setIsSmsBuyLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48 p-6">
                <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
                <p className="mr-2 text-gray-600">در حال بارگذاری اطلاعات کیف پول...</p>
            </div>
        );
    }
    
    if (!currentUser || !companyID) {
        return <div className="p-6 text-center text-red-500">مشکلی در شناسایی شرکت وجود دارد.</div>;
    }

    // --- UI Rendering ---

    return (
        <div dir="rtl" className="max-w-md mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">مدیریت کیف پول</h1>

            <div className="grid gap-6">
                
                {/* 1. Wallet Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-blue-100 mb-1 font-medium">موجودی کیف پول</p>
                            <h3 className="text-4xl font-extrabold">{walletBalance.toLocaleString('fa-IR')} <span className="text-lg font-normal">ریال</span></h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <Wallet size={32} />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleTopUp} 
                        disabled={isTopUpLoading}
                        className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isTopUpLoading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                        {isTopUpLoading ? 'در حال شارژ...' : 'شارژ کیف پول (۱۰۰,۰۰۰ ریال آزمایشی)'}
                    </button>
                </div>

                {/* 2. SMS Credit Card */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-purple-100 mb-1 font-medium">اعتبار پیامک</p>
                            <h3 className="text-4xl font-extrabold">{smsBalance.toLocaleString('fa-IR')} <span className="text-lg font-normal">عدد</span></h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <MessageSquare size={32} />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleBuySmsPackage} 
                        disabled={isSmsBuyLoading || walletBalance < 50000}
                        className="w-full bg-white text-purple-700 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isSmsBuyLoading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                        خرید بسته ۵۰ تایی (۵۰,۰۰۰ ریال)
                    </button>
                    {walletBalance < 50000 && <p className="text-xs text-purple-100 mt-2 text-center">موجودی کیف پول کافی نیست.</p>}
                </div>
                
                {/* 3. Transactions List */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                         تراکنش‌های اخیر
                    </h4>
                    <div className="space-y-3">
                        {txs.length === 0 && smsTxs.length === 0 && (
                            <p className="text-center text-gray-500 p-4">هنوز تراکنشی ثبت نشده است.</p>
                        )}
                        
                        {/* نمایش تراکنش‌های مالی */}
                        {txs.length > 0 && (
                            <>
                                <h5 className="font-semibold text-gray-600 mt-4 mb-2">تراکنش‌های مالی</h5>
                                {/* نمایش جدیدترین‌ها در ابتدا */}
                                {txs.slice().reverse().map(t => (
                                    <TransactionItem key={`w-${t.id}`} tx={t} isWallet={true} />
                                ))}
                            </>
                        )}
                        
                        {/* نمایش تراکنش‌های پیامک */}
                         {smsTxs.length > 0 && (
                            <>
                                <h5 className="font-semibold text-gray-600 mt-6 mb-2">تراکنش‌های پیامکی</h5>
                                {/* نمایش جدیدترین‌ها در ابتدا */}
                                {smsTxs.slice().reverse().map(t => (
                                    <TransactionItem 
                                        key={`s-${t.id}`} 
                                        // SmsCreditTransaction را به WalletTransaction تبدیل می‌کنیم تا با ساختار TransactionItem همخوانی داشته باشد
                                        tx={{
                                            ...t,
                                            ownerID: t.userID,
                                            balance_change: t.amount, // اینجا amount پیامک را استفاده می‌کنیم
                                            orders_change: 0 
                                        } as WalletTransaction} 
                                        isWallet={false} 
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyWallet;