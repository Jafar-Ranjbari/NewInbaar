// context/CompanyContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore'; // Adjust path
import { Company, CompanyType } from '../types'; // Adjust path
import { getCompanyByUserId ,  createCompany, createCompanyWalletTransaction } from '../company/companyService';

interface CompanyContextType {
  company: Partial<Company>;
  setCompany: React.Dispatch<React.SetStateAction<Partial<Company>>>;
  loading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuthStore();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const init = async () => {
        try {
          let c = await getCompanyByUserId(currentUser.id);
          if (!c) {
            c = await createCompany(currentUser.id, CompanyType.REAL);
            await createCompanyWalletTransaction(c.id, 100000, 'هدیه ورود');
          }
          setCompany(c);
        } catch (error) {
          console.error("Failed to load company", error);
        } finally {
          setLoading(false);
        }
      };
      init();
    }
  }, [currentUser]);

  return (
    <CompanyContext.Provider value={{ company, setCompany, loading }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany must be used within a CompanyProvider');
  return context;
};