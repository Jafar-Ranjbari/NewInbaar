import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, UserCircle, Building2, Wallet, PackagePlus, Save, Loader2, FileText } from 'lucide-react';
import { 
  getCompanyByUserId, createCompany, 
  getCompanyDetail, createOrUpdateCompanyDetail,
  getWalletTransactions, createWalletTransaction,
  getCompanyOrders, createOrder
} from '../../services/userService';
import { Company, CompanyDetail, CompanyType, WalletTransaction, Order, OrderStatus } from '../../types';

export const DashboardCompany: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS' | 'WALLET'>('PROFILE');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Data
  const [company, setCompany] = useState<Partial<Company>>({});
  const [details, setDetails] = useState<Partial<CompanyDetail>>({});
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Order Form State
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
      weightType: 'KG',
      goodType: '',
      originProvince: '',
      originCity: '',
      destinationProvince: '',
      destinationCity: '',
      receiverName: '',
      expectedPriceRange: '',
      deliveryDate: ''
  });

  useEffect(() => {
    const init = async () => {
        if (!currentUser) return;
        setInitLoading(true);
        try {
            // 1. Get Basic Company Entity
            let comp = await getCompanyByUserId(currentUser.id);
            if (!comp) {
                 // If new company user, start with no ID, let them choose type
                 setCompany({ userID: currentUser.id, type: CompanyType.REAL });
            } else {
                setCompany(comp);
                
                // 2. Get Details
                const det = await getCompanyDetail(comp.id);
                if (det) setDetails(det);

                // 3. Wallet & Gift (100k for company)
                const txs = await getWalletTransactions(comp.id, 'COMPANY');
                setTransactions(txs);
                if (txs.length === 0) {
                     const gift = await createWalletTransaction(comp.id, 100000, 'هدیه اولین ورود', 'COMPANY');
                     setTransactions([gift]);
                }

                // 4. Orders
                const ords = await getCompanyOrders(comp.id);
                setOrders(ords);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setInitLoading(false);
        }
    };
    init();
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
        let currentComp = company;
        // If first time, create Company entity first
        if (!company.id) {
             const newComp = await createCompany(currentUser.id, company.type || CompanyType.REAL);
             setCompany(newComp);
             currentComp = newComp;
             // Create wallet gift immediately
             const gift = await createWalletTransaction(newComp.id, 100000, 'هدیه اولین ورود', 'COMPANY');
             setTransactions([gift]);
        }

        if (currentComp.id) {
            const savedDetails = await createOrUpdateCompanyDetail({ ...details, companyID: currentComp.id });
            setDetails(savedDetails);
            alert('اطلاعات شرکت ذخیره شد');
        }
    } catch (err) {
        alert('خطا در ذخیره اطلاعات');
    } finally {
        setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!company.id) {
          alert('لطفا ابتدا پروفایل شرکت را تکمیل کنید');
          return;
      }
      setLoading(true);
      try {
          const orderPayload: any = {
              ...newOrder,
              companyID: company.id,
              weight: Number(newOrder.weight),
              status: OrderStatus.NEW
          };
          const savedOrder = await createOrder(orderPayload);
          setOrders([...orders, savedOrder]);
          setNewOrder({ weightType: 'KG', goodType: '', originProvince: '', originCity: '', destinationProvince: '', destinationCity: '', receiverName: '' }); // Reset minimal
          alert('بار جدید ثبت شد');
      } catch (err) {
          alert('خطا در ثبت بار');
      } finally {
          setLoading(false);
      }
  };

  const handleTopUp = async (amount: number) => {
    if (!company.id) return;
    setLoading(true);
    try {
        const tx = await createWalletTransaction(company.id, amount, 'افزایش اعتبار', 'COMPANY');
        setTransactions(prev => [...prev, tx]);
        alert('کیف پول شارژ شد');
    } catch (err) {
        alert('خطا در شارژ کیف پول');
    } finally {
        setLoading(false);
    }
  };

  const walletBalance = transactions.reduce((acc, curr) => acc + curr.balance_change, 0);

  if (!currentUser) return null;
  if (initLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Building2 size={24} />
            </div>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">پنل شرکت‌ها</h1>
          </div>

           <div className="flex items-center gap-2">
             <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-bold border border-blue-200">
                اعتبار: {walletBalance.toLocaleString()} ریال
             </div>
             <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('PROFILE')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'PROFILE' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <UserCircle size={18} /> مشخصات شرکت
            </button>
            <button 
                onClick={() => setActiveTab('ORDERS')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'ORDERS' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <PackagePlus size={18} /> ثبت و مدیریت بار
            </button>
            <button 
                onClick={() => setActiveTab('WALLET')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'WALLET' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Wallet size={18} /> کیف پول
            </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* PROFILE TAB */}
        {activeTab === 'PROFILE' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Building2 className="text-blue-500" /> اطلاعات حساب
                    </h2>
                    {/* Type Toggle (Only if not created yet, or simplistic switch for demo) */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                           onClick={() => setCompany({...company, type: CompanyType.REAL})}
                           className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${company.type === CompanyType.REAL ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            حقیقی
                        </button>
                        <button 
                           onClick={() => setCompany({...company, type: CompanyType.LEGAL})}
                           className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${company.type === CompanyType.LEGAL ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            حقوقی
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Common Fields */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 mb-3">اطلاعات عمومی و نماینده</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                placeholder="نام تجاری / برند" className="input-base"
                                value={details.brandName || ''} onChange={e => setDetails({...details, brandName: e.target.value})}
                            />
                            <input 
                                placeholder="نام نماینده" className="input-base"
                                value={details.repFirstName || ''} onChange={e => setDetails({...details, repFirstName: e.target.value})}
                            />
                            <input 
                                placeholder="نام خانوادگی نماینده" className="input-base"
                                value={details.repLastName || ''} onChange={e => setDetails({...details, repLastName: e.target.value})}
                            />
                            <input 
                                placeholder="موبایل نماینده" className="input-base"
                                value={details.repMobile1 || ''} onChange={e => setDetails({...details, repMobile1: e.target.value})}
                            />
                             <input 
                                placeholder="استان" className="input-base"
                                value={details.province || ''} onChange={e => setDetails({...details, province: e.target.value})}
                            />
                             <input 
                                placeholder="شهر" className="input-base"
                                value={details.city || ''} onChange={e => setDetails({...details, city: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Specific Fields */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-bold text-blue-600 mb-3">
                            {company.type === CompanyType.REAL ? 'اطلاعات شخص حقیقی' : 'اطلاعات شخص حقوقی'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {company.type === CompanyType.REAL ? (
                                <>
                                    <input placeholder="کد ملی" className="input-base" value={details.real_nationalId || ''} onChange={e => setDetails({...details, real_nationalId: e.target.value})} />
                                    <input placeholder="کد بیمه" className="input-base" value={details.real_socialSecurityCode || ''} onChange={e => setDetails({...details, real_socialSecurityCode: e.target.value})} />
                                </>
                            ) : (
                                <>
                                    <input placeholder="نام رسمی شرکت" className="input-base" value={details.legal_companyName || ''} onChange={e => setDetails({...details, legal_companyName: e.target.value})} />
                                    <input placeholder="شناسه ملی" className="input-base" value={details.legal_nationalId || ''} onChange={e => setDetails({...details, legal_nationalId: e.target.value})} />
                                    <input placeholder="شماره ثبت" className="input-base" value={details.legal_registrationNumber || ''} onChange={e => setDetails({...details, legal_registrationNumber: e.target.value})} />
                                    <input placeholder="نام مدیر عامل" className="input-base" value={details.legal_ceoName || ''} onChange={e => setDetails({...details, legal_ceoName: e.target.value})} />
                                </>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : 'ثبت تغییرات'}
                    </button>
                </form>
            </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'ORDERS' && (
             <div className="space-y-8">
                {/* New Order Form */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                     <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <PackagePlus className="text-blue-500"/> ثبت بار جدید
                     </h2>
                     <form onSubmit={handleCreateOrder} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input placeholder="استان مبدا" className="input-base" value={newOrder.originProvince || ''} onChange={e => setNewOrder({...newOrder, originProvince: e.target.value})} required />
                            <input placeholder="شهر مبدا" className="input-base" value={newOrder.originCity || ''} onChange={e => setNewOrder({...newOrder, originCity: e.target.value})} required />
                            <input placeholder="نام گیرنده" className="input-base" value={newOrder.receiverName || ''} onChange={e => setNewOrder({...newOrder, receiverName: e.target.value})} required />
                            
                            <input placeholder="استان مقصد" className="input-base" value={newOrder.destinationProvince || ''} onChange={e => setNewOrder({...newOrder, destinationProvince: e.target.value})} required />
                            <input placeholder="شهر مقصد" className="input-base" value={newOrder.destinationCity || ''} onChange={e => setNewOrder({...newOrder, destinationCity: e.target.value})} required />
                            <input placeholder="نوع کالا" className="input-base" value={newOrder.goodType || ''} onChange={e => setNewOrder({...newOrder, goodType: e.target.value})} required />
                            
                            <div className="flex gap-2">
                                <input type="number" placeholder="وزن" className="input-base flex-2" value={newOrder.weight || ''} onChange={e => setNewOrder({...newOrder, weight: Number(e.target.value)})} required />
                                <select className="input-base w-20" value={newOrder.weightType} onChange={e => setNewOrder({...newOrder, weightType: e.target.value as any})}>
                                    <option value="KG">KG</option>
                                    <option value="TON">TON</option>
                                </select>
                            </div>
                            <input placeholder="مبلغ پیشنهادی (ریال)" className="input-base" value={newOrder.expectedPriceRange || ''} onChange={e => setNewOrder({...newOrder, expectedPriceRange: e.target.value})} />
                            <input type="date" className="input-base" value={newOrder.deliveryDate || ''} onChange={e => setNewOrder({...newOrder, deliveryDate: e.target.value})} required />
                        </div>
                        <div className="flex justify-end">
                             <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                                 {loading ? '...' : 'ثبت درخواست'}
                             </button>
                        </div>
                     </form>
                </div>

                {/* Orders List */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-4">لیست بارهای ثبت شده</h3>
                    <div className="space-y-3">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <FileText className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{order.goodType} ({order.weight} {order.weightType})</h4>
                                        <p className="text-sm text-gray-500">
                                            {order.originCity} به {order.destinationCity}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                     <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                                         {order.status}
                                     </span>
                                     <span className="text-sm font-bold text-gray-600">{order.expectedPriceRange}</span>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <p className="text-center text-gray-500 mt-8">هنوز باری ثبت نکرده‌اید.</p>}
                    </div>
                </div>
             </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'WALLET' && (
            <div className="space-y-6">
                 <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-blue-100 mb-1">موجودی کیف پول</p>
                            <h3 className="text-4xl font-bold">{walletBalance.toLocaleString()} <span className="text-lg font-normal">ریال</span></h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <Wallet size={32} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleTopUp(100000)} className="bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                            شارژ ۱۰۰,۰۰۰ ریال
                        </button>
                        <button onClick={() => handleTopUp(200000)} className="bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                            شارژ ۲۰۰,۰۰۰ ریال
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4">تراکنش‌های اخیر</h3>
                    <div className="space-y-4">
                        {transactions.slice().reverse().map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">{tx.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(tx.timestamp).toLocaleDateString('fa-IR')}</p>
                                </div>
                                <div className={`font-bold ${tx.balance_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.balance_change > 0 ? '+' : ''}{tx.balance_change.toLocaleString()}
                                </div>
                            </div>
                        ))}
                         {transactions.length === 0 && <p className="text-center text-gray-500">تراکنشی یافت نشد.</p>}
                    </div>
                </div>
            </div>
        )}
      </main>
      
      <style>{`
        .input-base {
            width: 100%;
            padding: 0.5rem; /* p-2 */
            border: 1px solid #e5e7eb; /* border-gray-200 */
            border-radius: 0.5rem; /* rounded-lg */
            outline: none;
        }
        .input-base:focus {
            border-color: #3b82f6; /* border-blue-500 */
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};