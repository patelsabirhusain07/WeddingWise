import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Calculator, 
  PieChart, 
  DollarSign, 
  Store, 
  Users, 
  CheckSquare, 
  Calendar, 
  FileDown, 
  Settings
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coupleName: string;
  onOpenSettings: () => void;
  onExportPDF: () => void;
  remainingBudget: number;
  currency: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  coupleName,
  onOpenSettings,
  onExportPDF,
  remainingBudget,
  currency,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'calculator', label: 'Cost Estimator', icon: Calculator },
    { id: 'expenses', label: 'Bills & Expenses', icon: DollarSign },
    { id: 'events', label: 'Events & Timeline', icon: Calendar },
    { id: 'vendors', label: 'Vendors & Quotes', icon: Store },
    { id: 'guests', label: 'Guests & RSVP', icon: Users },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent tracking-tight">
                  WeddingWise
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                  Wedding Planner
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[140px] sm:max-w-none">
                {coupleName ? `${coupleName}’s Wedding` : 'Plan Smarter, Spend Wisely'}
              </p>
            </div>
          </div>

          {/* Quick budget chip */}
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-rose-50/80 border border-rose-200/70 rounded-full px-3.5 py-1 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span className="text-xs text-slate-600 font-medium">Remaining Budget:</span>
              <span className={`text-xs font-bold ${remainingBudget >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {currency} {remainingBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg shadow-sm shadow-rose-200 transition-all hover:shadow active:scale-95 cursor-pointer"
              title="Download detailed PDF Budget & Vendor report"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Configure Wedding Parameters"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
