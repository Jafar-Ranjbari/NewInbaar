// const CarInfo = ({ onNext }: { onNext: () => void }) => {
//   return (
//     <>
//       <h2 className="font-bold text-lg mb-4">مشخصات خودرو</h2>
//       <input placeholder="مدل خودرو" className="input" />
//       <input placeholder="پلاک" className="input mt-2" />
//       <button onClick={onNext} className="btn-primary mt-4">مرحله بعد</button>
//     </>
//   );
// };


// export default CarInfo ;



"use client";

import { useEffect, useState, useCallback } from "react";
import { FaAngleDown } from "react-icons/fa";
import { Truck as TruckIcon, Save, Loader2 } from "lucide-react";
import { DriverCar } from "../../types";
import { createOrUpdateCar, getCarByDriverId } from "../driverService";
import { useDriverDashboardData } from "../useDriverDashboardData";

/* ---------- Options ---------- */
const VEHICLE_TYPE_OPTIONS = [
  { value: "PICKUP", label: "وانت" },
  { value: "TRUCK", label: "کامیون" },
  { value: "TRAILER", label: "تریلی" },
  { value: "MINIBUS", label: "مینی‌بوس" },
];

/* ---------- Reusable Inputs ---------- */
const Input = ({
  label,
  value,
  onChange,
  dir = "rtl",
  required = false,
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dir?: "rtl" | "ltr";
  required?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-right mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      value={value ?? ""}
      onChange={onChange}
      dir={dir}
      required={required}
      className="w-full rounded-lg py-3 px-4 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-black outline-none"
    />
  </div>
);

const Select = ({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-right mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value ?? ""}
      onChange={onChange}
      required={required}
      className="w-full rounded-lg py-3 px-4 bg-gray-100 appearance-none focus:ring-2 focus:ring-black outline-none"
    >
      <option value="" disabled>
        انتخاب کنید
      </option>
      {VEHICLE_TYPE_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <FaAngleDown className="absolute left-3 top-11 text-gray-600 pointer-events-none" />
  </div>
);

/* ---------- Main Component ---------- */
// const DriverCarBasic = () => {
const CarInfo = ({ onNext }: { onNext: () => void }) => {
  const { driver } = useDriverDashboardData();
  const driverID = driver?.id;
  const [accountOwner, setAccountOwner] = useState<'self' | 'other'>(
    (driver.accountHolderName || driver.accountHolderLastName || driver.accountHolderNationalId) ? 'other' : 'self'
  );

  const [car, setCar] = useState<Partial<DriverCar>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!driverID) return;

    getCarByDriverId(driverID).then((data) => {
      if (data) setCar(data);
      setLoading(false);
    });
  }, [driverID]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!car.vehicleType || !car.carModel || !car.licensePlate) {
      alert("لطفاً همه فیلدهای الزامی را پر کنید");
      return;
    }

    setSaving(true);
    try {
      await createOrUpdateCar({
        driverID,
        vehicleType: car.vehicleType,
        carModel: car.carModel,
        licensePlate: car.licensePlate,
      } as DriverCar);

      alert("اطلاعات خودرو با موفقیت ذخیره شد");
      onNext();
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  if (!driverID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        ❌ ابتدا اطلاعات راننده را تکمیل کنید
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="bg-white w-full max-w-sm shadow-lg">
        <header className="bg-black text-white p-6 flex items-center gap-2">
          <TruckIcon />
          <h1 className="font-bold">اطلاعات خودرو</h1>
        </header>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setAccountOwner('self')}
              className={`w-1/2 py-2 rounded-full text-center font-semibold transition-colors text-sm ${accountOwner === 'self' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
            >
              خودم
            </button>
            <button
              type="button"
              onClick={() => setAccountOwner('other')}
              className={`w-1/2 py-2 rounded-full text-center font-semibold transition-colors text-sm ${accountOwner === 'other' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black'}`}
            >
              شخص دیگر
            </button>

          </div>
          {/* نوع خودرو */}
          <Select
            label="نوع خودرو"
            value={car.vehicleType}
            onChange={(e) =>
              setCar((p) => ({ ...p, vehicleType: e.target.value }))
            }
            required
          />

          {/* مدل خودرو */}
          <Input
            label="مدل خودرو"
            value={car.carModel}
            onChange={(e) =>
              setCar((p) => ({ ...p, carModel: e.target.value }))
            }
            required
          />

          {/* پلاک */}
          <Input
            label="پلاک خودرو"
            value={car.licensePlate}
            onChange={(e) =>
              setCar((p) => ({ ...p, licensePlate: e.target.value }))
            }
            dir="ltr"
            required
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            ذخیره اطلاعات
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarInfo;
