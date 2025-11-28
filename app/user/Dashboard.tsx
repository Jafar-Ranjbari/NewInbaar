
import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Role } from '../types';
import { DashboardDriver } from './../driver/DashboardDriver';
// import { DashboardDriver } from './DashboardDriver';
// import { DashboardCompany } from './DashboardCompany';
import { DashboardAdmin } from './DashboardAdmin';
import DashboardCompany from '../company/DashboardCompany';
// import { DashboardCompany } from '../company/DashboardCompany';

export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuthStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={logout} className="text-red-500">نشست کاربری نامعتبر است. لطفا خارج شوید و دوباره وارد شوید.</button>
      </div>
    )
  }

  if (currentUser.rolename === Role.DRIVER) {
    return <DashboardDriver />;
  }

  if (currentUser.rolename === Role.COMPANY) {
    return <DashboardCompany />;
  }

  if (currentUser.rolename === Role.ADMIN) {
    return <DashboardAdmin />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>نقش کاربری ناشناخته است.</p>
      <button onClick={logout} className="text-red-500 ml-4">خروج</button>
    </div>
  );
};
