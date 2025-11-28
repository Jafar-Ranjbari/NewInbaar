
import React, { useState, useEffect } from 'react';
import { Company, CompanyDetail, CompanyType } from '../../../types';
import { getCompanyDetail, createOrUpdateCompanyDetail } from './../../companyService';
import { Building2, Loader2 } from 'lucide-react';

interface Props {
  company: Partial<Company>;
  setCompany: (c: any) => void;
}

 const CompanyProfile: React.FC<Props> = ({ company, setCompany }) => {
  const [details, setDetails] = useState<Partial<CompanyDetail>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company.id) getCompanyDetail(company.id).then(d => { if (d) setDetails(d); });
  }, [company.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.id) return;
    setLoading(true);
    try {
      await createOrUpdateCompanyDetail({ ...details, companyID: company.id });
      alert('saved');
    } catch (e) { alert('error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Building2 className="text-blue-500" /> اطلاعات حساب</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setCompany({ ...company, type: CompanyType.REAL })} className={`px-4 py-1 rounded-md text-sm ${company.type === CompanyType.REAL ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>حقیقی</button>
          <button onClick={() => setCompany({ ...company, type: CompanyType.LEGAL })} className={`px-4 py-1 rounded-md text-sm ${company.type === CompanyType.LEGAL ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>حقوقی</button>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="نام تجاری" className="input-base" value={details.brandName || ''} onChange={e => setDetails({ ...details, brandName: e.target.value })} />
          <input placeholder="نام نماینده" className="input-base" value={details.repFirstName || ''} onChange={e => setDetails({ ...details, repFirstName: e.target.value })} />
          <input placeholder="نام خانوادگی نماینده" className="input-base" value={details.repLastName || ''} onChange={e => setDetails({ ...details, repLastName: e.target.value })} />
          <input placeholder="موبایل" className="input-base" value={details.repMobile1 || ''} onChange={e => setDetails({ ...details, repMobile1: e.target.value })} />
          {company.type === CompanyType.REAL ? (
            <>
              <input placeholder="کد ملی" className="input-base" value={details.real_nationalId || ''} onChange={e => setDetails({ ...details, real_nationalId: e.target.value })} />
            </>
          ) : (
            <>
              <input placeholder="شناسه ملی" className="input-base" value={details.legal_nationalId || ''} onChange={e => setDetails({ ...details, legal_nationalId: e.target.value })} />
            </>
          )}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : 'ثبت تغییرات'}
        </button>
      </form>
      <style>{`.input-base { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; }`}</style>
    </div>
  );
}


export default CompanyProfile ;