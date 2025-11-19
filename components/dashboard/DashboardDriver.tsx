import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, UserCircle, Truck, Wallet, User as UserIcon, Save, Loader2 } from 'lucide-react';
import { 
  getDriverByUserId, createOrUpdateDriver, 
  getCarByDriverId, createOrUpdateCar,
  getWalletTransactions, createWalletTransaction 
} from '../../services/userService';
import { Driver, DriverCar, WalletTransaction } from '../../types';

export const DashboardDriver: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'CAR' | 'WALLET'>('PROFILE');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Data States
  const [driver, setDriver] = useState<Partial<Driver>>({});
  const [car, setCar] = useState<Partial<DriverCar>>({});
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      if (!currentUser) return;
      setInitLoading(true);
      try {
        // 1. Fetch Driver Profile
        let drv = await getDriverByUserId(currentUser.id);
        if (!drv) {
            // Initialize local state if not exists on server
            setDriver({ userID: currentUser.id, mobile1: currentUser.mobile, firstName: '', lastName: '' });
        } else {
            setDriver(drv);
            // 2. Fetch Car if driver exists
            const c = await getCarByDriverId(drv.id);
            if (c) setCar(c);

            // 3. Fetch Wallet
            const txs = await getWalletTransactions(drv.id, 'DRIVER');
            setTransactions(txs);

            // 4. Check First Login Gift (50k)
            if (txs.length === 0) {
                const gift = await createWalletTransaction(drv.id, 50000, 'هدیه اولین ورود', 'DRIVER');
                setTransactions([gift]);
            }
        }
      } catch (err) {
        console.error(err);
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
      // Must save driver first to get ID for other relations
      const savedDriver = await createOrUpdateDriver({ ...driver, userID: currentUser.id });
      setDriver(savedDriver);
      alert('اطلاعات راننده ذخیره شد');
      
      // Refresh wallet check if it was a new driver creation
      const txs = await getWalletTransactions(savedDriver.id, 'DRIVER');
      if (txs.length === 0) {
          const gift = await createWalletTransaction(savedDriver.id, 50000, 'هدیه اولین ورود', 'DRIVER');
          setTransactions([gift]);
      }
    } catch (err) {
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver.id) {
        alert('لطفا ابتدا پروفایل راننده را تکمیل کنید');
        return;
    }
    setLoading(true);
    try {
        const savedCar = await createOrUpdateCar({ ...car, driverID: driver.id });
        setCar(savedCar);
        alert('اطلاعات خودرو ذخیره شد');
    } catch (err) {
        alert('خطا در ذخیره خودرو');
    } finally {
        setLoading(false);
    }
  };

  const handleTopUp = async (amount: number) => {
    if (!driver.id) return;
    setLoading(true);
    try {
        const tx = await createWalletTransaction(driver.id, amount, 'افزایش اعتبار', 'DRIVER');
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
  if (initLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-green-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Truck size={24} />
            </div>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">پنل رانندگان</h1>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm font-bold border border-green-200">
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
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'PROFILE' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <UserIcon size={18} /> مشخصات راننده
            </button>
            <button 
                onClick={() => setActiveTab('CAR')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'CAR' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Truck size={18} /> مشخصات خودرو
            </button>
            <button 
                onClick={() => setActiveTab('WALLET')}
                className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'WALLET' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Wallet size={18} /> کیف پول
            </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* PROFILE TAB */}
        {activeTab === 'PROFILE' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <UserCircle className="text-green-500" /> اطلاعات هویتی
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                            <input 
                                type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={driver.firstName || ''} onChange={e => setDriver({...driver, firstName: e.target.value})} required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                            <input 
                                type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={driver.lastName || ''} onChange={e => setDriver({...driver, lastName: e.target.value})} required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">موبایل اصلی</label>
                            <input 
                                type="text" disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
                                value={driver.mobile1 || ''}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
                            <input 
                                type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={driver.province || ''} onChange={e => setDriver({...driver, province: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
                            <input 
                                type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={driver.city || ''} onChange={e => setDriver({...driver, city: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">شماره شبا</label>
                            <input 
                                type="text" dir="ltr" placeholder="IR..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                value={driver.shebaNumber || ''} onChange={e => setDriver({...driver, shebaNumber: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-70">
                            {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                            ذخیره تغییرات
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* CAR TAB */}
        {activeTab === 'CAR' && (
             <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Truck className="text-green-500" /> اطلاعات ناوگان
                </h2>
                {!driver.id ? (
                    <div className="text-center p-8 bg-yellow-50 rounded-lg text-yellow-800">
                        ابتدا اطلاعات هویتی راننده را تکمیل کنید.
                    </div>
                ) : (
                    <form onSubmit={handleSaveCar} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نوع ماشین</label>
                                <select 
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={car.vehicleType || ''} onChange={e => setCar({...car, vehicleType: e.target.value})}
                                >
                                    <option value="">انتخاب کنید</option>
                                    <option value="PICKUP">وانت</option>
                                    <option value="TRUCK">کامیون</option>
                                    <option value="TRAILER">تریلی</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">مدل ماشین</label>
                                <input 
                                    type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={car.carModel || ''} onChange={e => setCar({...car, carModel: e.target.value})} placeholder="مثال: آریسان"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">پلاک</label>
                                <input 
                                    type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={car.licensePlate || ''} onChange={e => setCar({...car, licensePlate: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ظرفیت بار (تن)</label>
                                <input 
                                    type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={car.loadCapacity || ''} onChange={e => setCar({...car, loadCapacity: e.target.value})}
                                />
                            </div>
                        </div>
                         <div className="pt-4 border-t">
                            <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-70">
                                {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                                ذخیره خودرو
                            </button>
                        </div>
                    </form>
                )}
             </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'WALLET' && (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-green-100 mb-1">موجودی کیف پول</p>
                            <h3 className="text-4xl font-bold">{walletBalance.toLocaleString()} <span className="text-lg font-normal">ریال</span></h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <Wallet size={32} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleTopUp(100000)} className="bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
                            شارژ ۱۰۰,۰۰۰ ریال
                        </button>
                        <button onClick={() => handleTopUp(200000)} className="bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
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
    </div>
  );
};