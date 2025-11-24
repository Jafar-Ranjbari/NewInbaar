
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Building2, UserCircle, PackagePlus, Wallet, FileBarChart } from 'lucide-react';
import { getCompanyByUserId, createCompany, createCompanyWalletTransaction } from './companyService';
import { Company, CompanyType } from '../types';
import { CompanyProfile } from './CompanyProfile';
import { OrderManagement } from './OrderManagement';
import { CompanyWallet } from './CompanyWallet';
import { CompanyReports } from './CompanyReports';

export const DashboardCompany: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS' | 'WALLET' | 'REPORTS'>('PROFILE');
  const [company, setCompany] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const init = async () => {
        let c = await getCompanyByUserId(currentUser.id);
        if (!c) {
             c = await createCompany(currentUser.id, CompanyType.REAL);
             await createCompanyWalletTransaction(c.id, 100000, 'هدیه ورود');
        }
        setCompany(c);
        setLoading(false);
      };
      init();
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-blue-500 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><Building2 size={24} /></div>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">پنل شرکت‌ها</h1>
          </div>
          <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
            <TabButton active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} icon={<UserCircle size={18} />} label="مشخصات" />
            <TabButton active={activeTab === 'ORDERS'} onClick={() => setActiveTab('ORDERS')} icon={<PackagePlus size={18} />} label="مدیریت بار" />
            <TabButton active={activeTab === 'WALLET'} onClick={() => setActiveTab('WALLET')} icon={<Wallet size={18} />} label="کیف پول" />
            <TabButton active={activeTab === 'REPORTS'} onClick={() => setActiveTab('REPORTS')} icon={<FileBarChart size={18} />} label="گزارشات" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? <div>Loading...</div> : (
            <>
             {activeTab === 'PROFILE' && <CompanyProfile company={company} setCompany={setCompany} />}
             {activeTab === 'ORDERS' && <OrderManagement companyID={company.id} />}
             {activeTab === 'WALLET' && <CompanyWallet companyID={company.id} userID={currentUser.id} />}
             {activeTab === 'REPORTS' && <CompanyReports companyID={company.id} />}
            </>
        )}
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`py-4 px-2 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
  >
    {icon} {label}
  </button>
);
