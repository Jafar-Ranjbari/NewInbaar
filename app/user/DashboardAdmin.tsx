
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Users, Truck, Package, DollarSign, LogOut, BarChart3, FileText } from 'lucide-react';
import { getAllUsers, getAllDrivers, getAllOrders, getAllPayments, getAllDriverCars } from '../services/userService';
import { User, Driver, Order, PaymentDriver, DriverCar, OrderStatus, Role } from '../types';

export const DashboardAdmin: React.FC = () => {
  const { logout } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [cars, setCars] = useState<DriverCar[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentDriver[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DRIVERS' | 'ORDERS' | 'PAYMENTS'>('OVERVIEW');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, d, c, o, p] = await Promise.all([
          getAllUsers(),
          getAllDrivers(),
          getAllDriverCars(),
          getAllOrders(),
          getAllPayments()
        ]);
        setUsers(u);
        setDrivers(d);
        setCars(c);
        setOrders(o);
        setPayments(p);
      } catch (e) {
        console.error("Error fetching admin data", e);
      }
    };
    fetchData();
  }, []);

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
  
  // Chart Data Preparation
  const ordersByStatus = {
      [OrderStatus.NEW]: orders.filter(o => o.status === OrderStatus.NEW).length,
      [OrderStatus.DRIVER_ASSIGNED]: orders.filter(o => o.status === OrderStatus.DRIVER_ASSIGNED).length,
      [OrderStatus.FINISHED]: orders.filter(o => o.status === OrderStatus.FINISHED).length,
  };

  const maxOrderCount = Math.max(...Object.values(ordersByStatus), 1);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-slate-700">
              <BarChart3 size={24} />
            </div>
            <h1 className="text-lg font-bold">پنل مدیریت سیستم</h1>
          </div>
          <button onClick={logout} className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm font-bold">
            <LogOut size={18} /> خروج
          </button>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto mt-8 gap-6 px-4">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-xl shadow-sm h-fit overflow-hidden">
           <nav className="flex flex-col">
             <button 
               onClick={() => setActiveTab('OVERVIEW')}
               className={`p-4 text-right font-medium border-b hover:bg-gray-50 transition-colors ${activeTab === 'OVERVIEW' ? 'bg-blue-50 text-blue-600 border-r-4 border-r-blue-600' : 'text-gray-600'}`}
             >
               داشبورد کلی
             </button>
             <button 
               onClick={() => setActiveTab('DRIVERS')}
               className={`p-4 text-right font-medium border-b hover:bg-gray-50 transition-colors ${activeTab === 'DRIVERS' ? 'bg-blue-50 text-blue-600 border-r-4 border-r-blue-600' : 'text-gray-600'}`}
             >
               مدیریت رانندگان
             </button>
             <button 
               onClick={() => setActiveTab('ORDERS')}
               className={`p-4 text-right font-medium border-b hover:bg-gray-50 transition-colors ${activeTab === 'ORDERS' ? 'bg-blue-50 text-blue-600 border-r-4 border-r-blue-600' : 'text-gray-600'}`}
             >
               گزارش سفارشات
             </button>
             <button 
               onClick={() => setActiveTab('PAYMENTS')}
               className={`p-4 text-right font-medium border-b hover:bg-gray-50 transition-colors ${activeTab === 'PAYMENTS' ? 'bg-blue-50 text-blue-600 border-r-4 border-r-blue-600' : 'text-gray-600'}`}
             >
               تراکنش‌های مالی
             </button>
           </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">
            {activeTab === 'OVERVIEW' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-500 font-bold">کل کاربران</h3>
                                <Users className="text-blue-500 opacity-50"/>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{users.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-green-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-500 font-bold">سفارشات</h3>
                                <Package className="text-green-500 opacity-50"/>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
                        </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-yellow-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-500 font-bold">ناوگان فعال</h3>
                                <Truck className="text-yellow-500 opacity-50"/>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">{drivers.length}</p>
                        </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-purple-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-500 font-bold">گردش مالی</h3>
                                <DollarSign className="text-purple-500 opacity-50"/>
                            </div>
                            <p className="text-xl font-bold text-gray-800 dir-ltr">{totalIncome.toLocaleString()} <span className="text-xs text-gray-500">IRR</span></p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-6">وضعیت سفارشات</h3>
                            <div className="flex items-end justify-around h-40 gap-4 border-b border-gray-200 pb-2">
                                {Object.entries(ordersByStatus).map(([status, count]) => (
                                    <div key={status} className="flex flex-col items-center w-full group">
                                        <div 
                                            className="w-full max-w-[50px] bg-blue-500 rounded-t-md transition-all duration-500 relative group-hover:bg-blue-600"
                                            style={{ height: `${(count / maxOrderCount) * 100}%` }}
                                        >
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2 font-medium truncate w-full text-center">
                                            {status === OrderStatus.NEW ? 'جدید' : status === OrderStatus.FINISHED ? 'پایان یافته' : 'در حال انجام'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                             <h3 className="font-bold text-gray-800 mb-6">توزیع کاربران</h3>
                             <div className="space-y-4">
                                 <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span>رانندگان</span>
                                         <span>{users.filter(u => u.rolename === Role.DRIVER).length}</span>
                                     </div>
                                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-green-500" style={{ width: `${(users.filter(u => u.rolename === Role.DRIVER).length / users.length) * 100}%` }}></div>
                                     </div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-sm mb-1">
                                         <span>شرکت‌ها</span>
                                         <span>{users.filter(u => u.rolename === Role.COMPANY).length}</span>
                                     </div>
                                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-blue-500" style={{ width: `${(users.filter(u => u.rolename === Role.COMPANY).length / users.length) * 100}%` }}></div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'DRIVERS' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-gray-600 text-sm font-medium border-b">
                            <tr>
                                <th className="p-4">نام راننده</th>
                                <th className="p-4">موبایل</th>
                                <th className="p-4">خودرو</th>
                                <th className="p-4">پلاک</th>
                                <th className="p-4">استان/شهر</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {drivers.map(drv => {
                                const car = cars.find(c => c.driverID === drv.id);
                                return (
                                    <tr key={drv.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{drv.firstName} {drv.lastName}</td>
                                        <td className="p-4 text-gray-500">{drv.mobile1}</td>
                                        <td className="p-4">{car ? car.vehicleType : '-'}</td>
                                        <td className="p-4">{car ? car.licensePlate : '-'}</td>
                                        <td className="p-4">{drv.province} / {drv.city}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'ORDERS' && (
                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-gray-600 text-sm font-medium border-b">
                            <tr>
                                <th className="p-4">کالا</th>
                                <th className="p-4">مبدا</th>
                                <th className="p-4">مقصد</th>
                                <th className="p-4">وضعیت</th>
                                <th className="p-4">تاریخ تحویل</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(ord => (
                                <tr key={ord.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{ord.goodType} ({ord.weight} {ord.weightType})</td>
                                    <td className="p-4 text-gray-500">{ord.originProvince} - {ord.originCity}</td>
                                    <td className="p-4 text-gray-500">{ord.destinationProvince} - {ord.destinationCity}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${ord.status === OrderStatus.FINISHED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {ord.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm">{ord.deliveryDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {activeTab === 'PAYMENTS' && (
                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-gray-600 text-sm font-medium border-b">
                            <tr>
                                <th className="p-4">شناسه</th>
                                <th className="p-4">مبلغ (ریال)</th>
                                <th className="p-4">نوع</th>
                                <th className="p-4">کد رهگیری</th>
                                <th className="p-4">تاریخ ثبت</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map(pay => (
                                <tr key={pay.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-xs text-gray-400">{pay.id}</td>
                                    <td className="p-4 font-bold text-green-600">{pay.amount.toLocaleString()}</td>
                                    <td className="p-4 text-sm">{pay.payType}</td>
                                    <td className="p-4 text-sm">{pay.transactionCode}</td>
                                    <td className="p-4 text-sm">{new Date(pay.createdAt).toLocaleDateString('fa-IR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};
