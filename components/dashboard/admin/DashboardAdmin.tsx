
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { getAllUsers, getAllDrivers, getAllOrders, getAllPayments, getAllDriverCars } from './adminService';
import { BarChart3, LogOut, Search, Users as UsersIcon } from 'lucide-react';

const Overview = ({ users, orders, drivers, payments }: any) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow border-b-4 border-blue-500">
            <h3 className="text-gray-500">کاربران</h3>
            <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-b-4 border-green-500">
             <h3 className="text-gray-500">سفارشات</h3>
             <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-b-4 border-purple-500">
             <h3 className="text-gray-500">مالی</h3>
             <p className="text-2xl font-bold">{payments.reduce((a:any,b:any)=>a+b.amount,0).toLocaleString()}</p>
        </div>
    </div>
);

const DriversList = ({ drivers }: any) => (
    <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-right">
            <thead className="bg-gray-100"><tr><th className="p-3">نام</th><th className="p-3">موبایل</th><th className="p-3">شهر</th></tr></thead>
            <tbody>{drivers.map((d:any) => <tr key={d.id} className="border-b"><td className="p-3">{d.firstName} {d.lastName}</td><td className="p-3">{d.mobile1}</td><td className="p-3">{d.city}</td></tr>)}</tbody>
        </table>
    </div>
);

const UsersList = ({ users }: any) => (
    <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-right">
            <thead className="bg-gray-100"><tr><th className="p-3">نام کامل</th><th className="p-3">موبایل</th><th className="p-3">نقش</th></tr></thead>
            <tbody>{users.map((u:any) => <tr key={u.id} className="border-b"><td className="p-3">{u.fullName}</td><td className="p-3">{u.mobile}</td><td className="p-3">{u.rolename}</td></tr>)}</tbody>
        </table>
    </div>
);

export const DashboardAdmin: React.FC = () => {
    const { logout } = useAuthStore();
    const [tab, setTab] = useState('OVERVIEW');
    const [data, setData] = useState<any>({ users: [], drivers: [], orders: [], payments: [] });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        Promise.all([getAllUsers(), getAllDrivers(), getAllOrders(), getAllPayments()]).then(([users, drivers, orders, payments]) => {
            setData({ users, drivers, orders, payments });
        });
    }, []);

    const handleTabChange = (newTab: string) => {
        setTab(newTab);
        setSearchTerm('');
    };

    const filteredDrivers = data.drivers.filter((d: any) => 
        `${d.firstName} ${d.lastName}`.includes(searchTerm) || d.mobile1?.includes(searchTerm)
    );

    const filteredUsers = data.users.filter((u: any) => 
        u.fullName.includes(searchTerm) || u.mobile.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-100">
             <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
                 <div className="flex items-center gap-2"><BarChart3/> Admin Panel</div>
                 <button onClick={logout} className="text-red-300"><LogOut size={18}/></button>
             </header>
             <div className="flex max-w-7xl mx-auto mt-8 gap-6 px-4 flex-col md:flex-row">
                 <aside className="w-full md:w-64 bg-white rounded shadow p-4 space-y-2 h-fit">
                     <button onClick={() => handleTabChange('OVERVIEW')} className={`block w-full text-right p-2 rounded ${tab === 'OVERVIEW' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>داشبورد</button>
                     <button onClick={() => handleTabChange('USERS')} className={`block w-full text-right p-2 rounded ${tab === 'USERS' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>کاربران سیستم</button>
                     <button onClick={() => handleTabChange('DRIVERS')} className={`block w-full text-right p-2 rounded ${tab === 'DRIVERS' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>رانندگان</button>
                 </aside>
                 <main className="flex-1">
                     {tab === 'OVERVIEW' && <Overview {...data} />}
                     
                     {tab === 'USERS' && (
                         <div className="space-y-4">
                             <div className="bg-white p-3 rounded shadow flex gap-2 items-center">
                                 <Search className="text-gray-400" />
                                 <input 
                                    className="w-full outline-none"
                                    placeholder="جستجو نام یا موبایل کاربر..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                 />
                             </div>
                             <UsersList users={filteredUsers} />
                         </div>
                     )}

                     {tab === 'DRIVERS' && (
                         <div className="space-y-4">
                             <div className="bg-white p-3 rounded shadow flex gap-2 items-center">
                                 <Search className="text-gray-400" />
                                 <input 
                                    className="w-full outline-none"
                                    placeholder="جستجو نام یا موبایل راننده..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                 />
                             </div>
                             <DriversList drivers={filteredDrivers} />
                         </div>
                     )}
                 </main>
             </div>
        </div>
    );
};
