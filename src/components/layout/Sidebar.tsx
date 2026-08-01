import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  QrCode,
  FolderOpen,
  FileCheck2,
  User,
  Sparkles,
  ChevronRight,
  Shield,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import devtechLogo from '../../assets/devtech-logo.png';
import { useEmployeeContext } from '../../context/EmployeeContext';

interface SidebarProps {
  onOpenScanner?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenScanner }) => {
  const { user, logout } = useAuth();
  const { employees, verificationLogs } = useEmployeeContext();
  const navigate = useNavigate();
  const isSuperAdmin = user?.role === 'superadmin' || user?.email?.toLowerCase().includes('admin');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'Workforce Platform',
      items: [
        { label: 'Dashboard Overview', path: '/', icon: LayoutDashboard },
        { label: 'Employee Directory', path: '/employees', icon: Users, badge: employees.length || 32 },
      ]
    },
    {
      title: 'Badging & Cryptography',
      items: [
        { label: 'Generate ID Badges', path: '/generate-cards', icon: CreditCard },
        { label: 'Verification Logs', path: '/verification-logs', icon: FileCheck2, badge: verificationLogs.length || 24 },
      ]
    },
    {
      title: 'Enterprise Analytics',
      items: [
        { label: 'Workforce Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Company Settings', path: '/settings', icon: SettingsIcon },
        { label: 'Admin Profile', path: '/profile', icon: User },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white text-[#6B7280] flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] shadow-saas shrink-0 sticky top-4 h-[calc(100vh-2rem)] m-4 mr-0 transition-all select-none z-30">

      {/* Brand Header */}
      <div className="pt-[16px] pb-[6px] px-6 border-b border-[#E5E7EB] flex items-center justify-center select-none">
        <img
          src={devtechLogo}
          alt="DevTech IT Solution"
          loading="eager"
          decoding="async"
          className="w-[172px] h-auto object-contain mx-auto block select-none translate-x-[7px]"
        />
      </div>

      {/* Navigation Group items */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => {
                    return `flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-xs font-bold transition-all duration-200 ${isActive
                      ? 'bg-[#DBEAFE]/40 text-[#2563EB] shadow-xs font-extrabold border border-[#2563EB]/10'
                      : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'
                      }`;
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#2563EB]' : 'bg-transparent'} transition-colors -ml-1`}></span>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.badge === 'number' && (
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold ${isActive ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB]'
                          }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}

        {/* Quick Optical Scanner Box */}
        <div className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] space-y-2.5">
          <div className="flex items-center gap-2 text-[#111827] font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
            <span>Cryptographic Scan</span>
          </div>
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            Verify employee badges in real-time via optical camera reader or handheld scanner.
          </p>
          <button
            onClick={onOpenScanner}
            className="w-full py-2 rounded-[12px] bg-[#111827] hover:bg-[#1E293B] text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
          >
            <QrCode className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Launch Verifier</span>
          </button>
        </div>
      </div>

      {/* User Profile & Rounded Sign Out Container at Bottom */}
      <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] rounded-b-[20px] space-y-3">
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 px-2 py-1.5 rounded-[14px] hover:bg-white cursor-pointer transition-all border border-transparent hover:border-[#E5E7EB]"
        >
          <div className={`w-9 h-9 rounded-[12px] ${isSuperAdmin ? 'bg-[#2563EB]/15 border-[#2563EB]/30 text-[#2563EB]' : 'bg-[#059669]/15 border-[#059669]/30 text-[#059669]'} border font-black flex items-center justify-center text-xs shrink-0`}>
            {isSuperAdmin ? 'SA' : 'HR'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-[#111827] truncate leading-tight">
              {isSuperAdmin ? 'Super Admin' : 'HR Admin'}
            </p>
            <span className="text-[10px] text-[#22C55E] font-extrabold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> Active Session
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] bg-white hover:bg-[#FEF2F2] text-[#6B7280] hover:text-[#EF4444] border border-[#E5E7EB] hover:border-[#FECACA] text-xs font-bold transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-[#94A3B8] group-hover:text-[#EF4444] transition-colors" />
            <span>Sign Out Session</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
