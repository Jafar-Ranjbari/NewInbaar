
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { Loader2, Save } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { Driver } from "@/app/types";
import { getDriverByUserId, createOrUpdateDriver } from "../driverService";

/* ---------- Reusable Input ---------- */
interface FormFieldProps {
  label: string;
  name: keyof Driver;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  dir?: "rtl" | "ltr";
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  dir = "rtl",
}) => (
  <div>
    <label className="block text-right text-sm font-medium mb-1">
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <input
      name={name}
      value={value ?? ""}
      onChange={onChange}
      type={type}
      dir={dir}
      required={required}
      className="w-full rounded-lg p-3 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-black outline-none text-right"
    />
  </div>
);

/* ---------- Main Component ---------- */
// const DriverProfile = () => {
const DriverInfo = ({ onNext }: { onNext: () => void }) => {
  const { currentUser } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Driver>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------- Auth + Fetch ---------- */
  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }

    const fetchDriver = async () => {
      try {
        const data = await getDriverByUserId(currentUser.id);
        if (data) {
          setFormData(data); // اگر قبلاً ثبت شده بود
        } else {
          setFormData({ userID: currentUser.id });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [currentUser, router]);

  /* ---------- Handlers ---------- */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.nationalId ||
      !formData.mobile1 ||
      !formData.province ||
      !formData.city
    ) {
      alert("لطفاً تمام فیلدهای الزامی را پر کنید");
      setSaving(false);
      return;
    }

    try {
      await createOrUpdateDriver({
        ...formData,
        userID: currentUser!.id,
      } as Driver);

      alert("اطلاعات راننده با موفقیت ثبت شد");
      // اگر خواستی:
      // router.push("/next-step");
      onNext();
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  if (loading) {
    return <div className="p-8 text-center">در حال دریافت اطلاعات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-lg flex flex-col">
        {/* Header */}
        <header className="bg-black text-white p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-700 p-3 rounded-full">
              <FaUser className="text-2xl" />
            </div>
            <h1 className="font-bold text-lg">ثبت اطلاعات راننده</h1>
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField label="نام" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <FormField label="نام خانوادگی" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <FormField label="شماره همراه" name="mobile1" value={formData.mobile1} onChange={handleChange} dir="ltr" required />
          <FormField label="کد ملی" name="nationalId" value={formData.nationalId} onChange={handleChange} required />
          <FormField label="استان" name="province" value={formData.province} onChange={handleChange} required />
          <FormField label="شهر" name="city" value={formData.city} onChange={handleChange} required />

          <button
            // onClick={onNext}
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-4 rounded-full font-bold flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            ثبت اطلاعات
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverInfo;
