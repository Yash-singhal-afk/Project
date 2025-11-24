import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plane, Calculator, Database, TrendingUp, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const navigation = [
    { name: 'Dashboard', icon: Plane, page: 'Dashboard' },
    { name: 'Calculator', icon: Calculator, page: 'Calculator' },
    { name: 'Aircraft', icon: Database, page: 'Aircraft' },
    { name: 'Scenarios', icon: TrendingUp, page: 'Scenarios' }
  ];

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">AeroCalc</span>
            </Link>
            
            <div className="flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentPageName === item.page
                      ? 'bg-white bg-opacity-20 font-semibold'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plane className="w-5 h-5" />
              </div>
              <span className="font-semibold">AeroCalc</span>
            </div>
            <p className="text-slate-400 text-sm">
              Professional aviation performance analysis • Built for pilots, by pilots
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}