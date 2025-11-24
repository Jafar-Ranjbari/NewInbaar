
import React, { useState } from 'react';
import { Driver } from '../../../types';
import { createOrUpdateDriver } from './driverService';
import { UserCircle, Save, Loader2 } from 'lucide-react';

interface Props {
  driver: Partial<Driver>;
  userID: string;
  onUpdate: (d: Driver) => void;
}

export const DriverProfile: React.FC<Props> = ({ driver, userID, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<Driver>>(driver);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = await createOrUpdateDriver({ ...formData, userID });
      onUpdate(saved);
      alert('اطلاعات راننده ذخیره شد');
    } catch (err) {
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UserCircle className="text-green-500" /> اطلاعات هویتی
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                    <input 
                        type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                    <input 
                        type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">موبایل اصلی</label>
                    <input 
                        type="text" disabled className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
                        value={formData.mobile1 || ''}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
                    <input 
                        type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        value={formData.province || ''} onChange={e => setFormData({...formData, province: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
                    <input 
                        type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">شماره شبا</label>
                    <input 
                        type="text" dir="ltr" placeholder="IR..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        value={formData.shebaNumber || ''} onChange={e => setFormData({...formData, shebaNumber: e.target.value})}
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
  );
};
