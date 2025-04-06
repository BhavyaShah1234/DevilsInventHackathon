import React, { ReactNode } from 'react';

interface RobotDashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  currentPage: 'information' | 'inventory' | 'control';
}

export const RobotDashboardLayout: React.FC<RobotDashboardLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{title}</h1>
        <p className="text-gray-400 mt-2">{subtitle}</p>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};
