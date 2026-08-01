import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  QrCode, 
  Bell, 
  User, 
  ShieldCheck,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, onOpenScanner, onOpenCommandPalette }) => {
  const { searchQuery, setSearchQuery, employees, showToast } = useEmployeeContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = user?.role === 'superadmin' || user?.email?.toLowerCase().includes('admin');
  const [notificationsCount, setNotificationsCount] = useState<number>(3);

  const handleNotificationClick = () => {
    setNotificationsCount(0);
    showToast('All corporate security and onboarding alerts acknowledged.', 'info');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-[16px] border-b border-[#E5E7EB] px-6 py-3.5 flex items-center justify-between gap-6 transition-all shadow-saas-sm">
      
      {/* Rounded Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div 
          onClick={onOpenCommandPalette}
          className="w-full h-11 relative flex items-center justify-between px-4 py-2 rounded-[14px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] hover:border-[#2563EB]/40 cursor-pointer text-xs sm:text-sm font-medium text-[#6B7280] transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors shrink-0" />
            <span className="truncate text-xs text-[#6B7280] group-hover:text-[#111827]">Search employees, ID badges, department records...</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-extrabold rounded-[8px] bg-white text-[#6B7280] border border-[#E5E7EB] shadow-2xs">Ctrl K</kbd>
          </div>
        </div>
      </div>

      {/* Aligned Right Controls with Plenty of Spacing */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Quick Action: Verify Badge */}
        <button
          onClick={onOpenScanner}
          className="saas-btn-secondary !py-2 !px-4 !text-xs !font-extrabold flex items-center gap-2 text-[#111827]"
          title="Scan & verify employee QR badge"
        >
          <QrCode className="w-4 h-4 text-[#2563EB]" />
          <span className="hidden sm:inline">Verify Badge</span>
        </button>

        {/* Quick Action: Add Employee */}
        <button
          onClick={onOpenAddModal}
          className="saas-btn-primary !py-2 !px-4 !text-xs !font-extrabold flex items-center gap-2 shadow-md shadow-[#2563EB]/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>

        <div className="h-6 w-[1px] bg-[#E5E7EB] mx-1 hidden sm:block"></div>

        {/* Notification Bell */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2.5 rounded-[14px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-all duration-200 shadow-2xs hover:shadow-sm"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white animate-pulse">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 p-1 pl-2.5 rounded-[14px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] hover:border-[#2563EB]/30 transition-all duration-200 text-left group shadow-2xs"
        >
          <div className="hidden md:block text-right">
            <p className="text-xs font-extrabold text-[#111827] leading-none">
              {isSuperAdmin ? 'Super Admin' : 'HR Admin'}
            </p>
            <span className="text-[10px] text-[#22C55E] font-extrabold flex items-center justify-end gap-1 mt-1">
              ● Online SaaS
            </span>
          </div>
          <div className={`w-9 h-9 rounded-[12px] ${isSuperAdmin ? 'bg-gradient-to-tr from-[#2563EB] to-[#3B82F6]' : 'bg-gradient-to-tr from-[#059669] to-[#10B981]'} text-white font-extrabold flex items-center justify-center text-xs shadow-xs group-hover:scale-105 transition-transform`}>
            {isSuperAdmin ? 'SA' : 'HR'}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#111827] pr-0.5" />
        </button>
      </div>
    </header>
  );
};
