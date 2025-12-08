import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div dir="rtl" className="bg-gray-50">
      <div className="w-full max-w-sm mx-auto bg-white min-h-screen">

        {/* Header */}
        <header className="bg-black text-white px-6 py-12">
          <div className="text-center text-lg font-bold">{title}</div>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-t-3xl -mt-6 p-3">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
