
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { LogOut, Truck, User as UserIcon, Wallet, Search, FileBarChart } from 'lucide-react';
import { getDriverByUserId } from './driverService';
import { Driver } from '../../../types';
import { DriverProfile } from './DriverProfile';
import { DriverCarTab } from './DriverCar';
import { CargoHall } from './CargoHall';
import { DriverWallet } from './DriverWallet';
import { DriverReports } from './DriverReports';

export const DashboardDriver: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'CAR' | 'CARGO' | 'WALLET' | 'REPORTS'>('PROFILE');
  const [driver, setDriver] = useState<Partial<Driver>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getDriverByUserId(currentUser.id).then(d => {
        if (d) setDriver(d);
        else setDriver({ userID: currentUser.id, mobile1: currentUser.mobile });
        setLoading(false);
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-green-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600"><Truck size={24} /></div>
            <h1 className="text-lg font-bold text-gray-800">پنل رانندگان</h1>
          </div>
          <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
            <TabButton active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} icon={<UserIcon size={18} />} label="مشخصات" />
            <TabButton active={activeTab === 'CAR'} onClick={() => setActiveTab('CAR')} icon={<Truck size={18} />} label="خودرو" />
            <TabButton active={activeTab === 'CARGO'} onClick={() => setActiveTab('CARGO')} icon={<Search size={18} />} label="سالن بار" />
            <TabButton active={activeTab === 'WALLET'} onClick={() => setActiveTab('WALLET')} icon={<Wallet size={18} />} label="کیف پول" />
            <TabButton active={activeTab === 'REPORTS'} onClick={() => setActiveTab('REPORTS')} icon={<FileBarChart size={18} />} label="گزارشات" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? <div className="text-center">Loading...</div> : (
          <>
            {activeTab === 'PROFILE' && <DriverProfile driver={driver} userID={currentUser.id} onUpdate={setDriver} />}
            {activeTab === 'CAR' && <DriverCarTab driverID={driver.id} />}
            {activeTab === 'CARGO' && <CargoHall driverID={driver.id} driverName={`${driver.firstName || ''} ${driver.lastName || ''}`} />}
            {activeTab === 'WALLET' && <DriverWallet driverID={driver.id} userID={currentUser.id} />}
            {activeTab === 'REPORTS' && <DriverReports driverID={driver.id} />}
          </>
        )}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${active ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
  >
    {icon} {label}
  </button>
);
