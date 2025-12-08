
import React, { useEffect, useState } from 'react';
import { DriverCar } from '../types';
import { getCarByDriverId, createOrUpdateCar } from './driverService';
import { Truck, Save, Loader2 } from 'lucide-react';

interface Props {
  driverID?: string;
}

export const DriverCarTab: React.FC<Props> = ({ driverID }) => {
  const [car, setCar] = useState<Partial<DriverCar>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driverID) {
      getCarByDriverId(driverID).then(c => { if(c) setCar(c); });
    }
  }, [driverID]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverID) return;
    setLoading(true);
    try {
      const saved = await createOrUpdateCar({ ...car, driverID });
      setCar(saved);
      alert('اطلاعات خودرو ذخیره شد');
    } catch (err) {
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  if (!driverID) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-700 bg-gray-50 border border-gray-200">
         ابتدا پروفایل خود را تکمیل کنید.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Truck className="text-gray-500" /> اطلاعات خودرو
        </h2>
        <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع ماشین</label>
                    <select 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
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
                        type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                        value={car.carModel || ''} onChange={e => setCar({...car, carModel: e.target.value})} placeholder="مثال: آریسان"
                    />
                </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">پلاک</label>
                    <input 
                        type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                        value={car.licensePlate || ''} onChange={e => setCar({...car, licensePlate: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ظرفیت بار (تن)</label>
                    <input 
                        type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
                        value={car.loadCapacity || ''} onChange={e => setCar({...car, loadCapacity: e.target.value})}
                    />
                </div>
            </div>
                <div className="pt-4 border-t">
                <button type="submit" disabled={loading} className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center gap-2 disabled:opacity-70">
                    {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                    ذخیره خودرو
                </button>
            </div>
        </form>
    </div>
  );
};
