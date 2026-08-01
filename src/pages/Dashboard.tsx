import React, { useMemo, useState, useEffect } from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { useEmployeeContext } from '../context/EmployeeContext';
import { exportEmployeesToCSV } from '../services/excelService';
import {
  Sparkles,
  UserPlus,
  CreditCard,
  QrCode,
  TrendingUp,
  Users,
  ArrowUpRight,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  CartesianGrid
} from 'recharts';

interface DashboardProps {
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
}

const getISTGreeting = (): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find(part => part.type === 'hour');
    const hour = hourPart ? parseInt(hourPart.value, 10) : new Date().getHours();
    const istHour = hour % 24;

    if (istHour >= 5 && istHour < 12) {
      return 'Good Morning';
    } else if (istHour >= 12 && istHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  } catch {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ onOpenAddModal, onOpenScanner }) => {
  const { employees, showToast } = useEmployeeContext();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'Q3 2026' | 'Q2 2026' | 'Full Year'>('Q3 2026');
  const [greeting, setGreeting] = useState<string>(getISTGreeting);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentGreeting = getISTGreeting();
      setGreeting(prev => (prev !== currentGreeting ? currentGreeting : prev));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Dynamic Recharts data calculation
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      const shortName = e.department.split(' ')[0] || e.department;
      counts[shortName] = (counts[shortName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).slice(0, 6);
  }, [employees]);

  const monthlyHiringCurve = [
    { month: 'Jan', onboarding: 6, badges: 6, verified: 14 },
    { month: 'Feb', onboarding: 11, badges: 10, verified: 22 },
    { month: 'Mar', onboarding: 17, badges: 16, verified: 35 },
    { month: 'Apr', onboarding: 24, badges: 23, verified: 48 },
    { month: 'May', onboarding: 31, badges: 29, verified: 62 },
    { month: 'Jun', onboarding: employees.length || 38, badges: (employees.length || 38) - 1, verified: 84 },
  ];

  const barColors = ['#2563EB', '#3B82F6', '#06B6D4', '#22C55E', '#8B5CF6', '#F59E0B'];

  const handleExportData = () => {
    try {
      showToast('Generating Data Export...', 'info', 'Compiling full workforce database & analytics report...');
      const dateStr = new Date().toISOString().split('T')[0];
      exportEmployeesToCSV(employees, `DevTech_Workforce_Data_${dateStr}.csv`);
      showToast('Export Completed Successfully', 'success', `Workforce data for ${employees.length} employee records downloaded as CSV.`);
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export Failed', 'error', 'Unable to generate export file at this time.');
    }
  };

  return (
    <div className="px-6 space-y-8 animate-fadeIn max-w-[1600px] mx-auto">

      {/* Dashboard Welcome Hero (Subtle Blue Gradient EXCLUSIVELY Inside This Hero) */}
      <div className="p-8 rounded-[24px] bg-gradient-to-r from-[#DBEAFE]/70 via-white to-[#E0F2FE]/50 border border-[#E5E7EB] shadow-saas-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Decorative Background Accents */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2.5 relative z-10 max-w-2xl">

          <h1 className="text-2xl sm:text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            {greeting}, HR Executive
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed">
            Welcome back to DevTech IT Solution. Here are today's authoritative workforce insights, smart badge issuance queues, and real-time employee verification overviews.
          </p>
        </div>

        {/* Quick Actions Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={onOpenAddModal}
            className="saas-btn-primary !px-4 !py-2.5 !text-xs !rounded-[14px] shadow-md shadow-[#2563EB]/25"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>

          <button
            onClick={() => navigate('/generate-cards')}
            className="saas-btn-secondary !px-4 !py-2.5 !text-xs !rounded-[14px]"
          >
            <CreditCard className="w-4 h-4 text-[#2563EB]" />
            <span>Generate Badge</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="saas-btn-secondary !px-4 !py-2.5 !text-xs !rounded-[14px]"
          >
            <QrCode className="w-4 h-4 text-[#0EA5E9]" />
            <span>Verify QR</span>
          </button>

          <button
            onClick={handleExportData}
            className="saas-btn-secondary !px-3.5 !py-2.5 !text-xs !rounded-[14px] text-[#6B7280]"
            title="Export workforce Data"
          >
            <Download className="w-4 h-4 text-[#6B7280]" />
            <span className="hidden xl:inline">Export Data</span>
          </button>
        </div>
      </div>

      {/* 20px Pastel Metric Statistic Cards Grid */}
      <StatCards />

      {/* White Chart Containers & Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Monthly Hiring & Badge Issuance Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col justify-between hover:shadow-saas-md transition-all duration-300">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Workforce Scaling Analytics
                </span>
                <h3 className="text-base font-black text-[#111827] mt-0.5">
                  Monthly Onboarding & Badge Generation Curve
                </h3>
              </div>

              {/* Dropdown Filters & Export Icon */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={timeFilter}
                    onChange={(e: any) => setTimeFilter(e.target.value)}
                    className="pl-3 pr-8 py-1.5 rounded-[12px] bg-[#F8FAFC] text-[#111827] font-extrabold text-xs border border-[#E5E7EB] appearance-none focus:outline-hidden focus:border-[#2563EB] cursor-pointer shadow-2xs"
                  >
                    <option value="Q3 2026">Q3 2026</option>
                    <option value="Q2 2026">Q2 2026</option>
                    <option value="Full Year">Full Year 2026</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button onClick={handleExportData} className="p-1.5 rounded-[12px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] text-[#6B7280] transition-colors" title="Export chart PDF/CSV">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyHiringCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOnboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBadges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px -5px rgba(17, 24, 39, 0.1)', color: '#111827', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" name="Staff Onboarded" dataKey="onboarding" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorOnboard)" />
                  <Area type="monotone" name="Smart Badges Issued" dataKey="badges" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBadges)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-4 mt-3 border-t border-[#E5E7EB] text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-extrabold text-[#111827]">
                <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block"></span> Solid Blue: Onboarding
              </span>
              <span className="flex items-center gap-1.5 font-extrabold text-[#111827]">
                <span className="w-3 h-3 rounded-full bg-[#22C55E] inline-block"></span> Green Secondary: Badges Issued
              </span>
            </div>
            <button onClick={() => navigate('/analytics')} className="font-extrabold text-[#2563EB] hover:underline flex items-center gap-1">
              <span>Full Analytics Suite</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Department Distribution Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas flex flex-col justify-between hover:shadow-saas-md transition-all duration-300">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#2563EB]" /> Department Density
                </span>
                <h3 className="text-base font-black text-[#111827] mt-0.5">
                  Staff Count per Division
                </h3>
              </div>
              <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-[12px] bg-[#DBEAFE]/50 text-[#2563EB] border border-[#BFDBFE]">
                6 Divisions
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px -5px rgba(17, 24, 39, 0.1)', color: '#111827', fontSize: '12px', fontWeight: 'bold' }} />
                  <Bar dataKey="count" name="Staff Count" radius={[10, 10, 0, 0]}>
                    {departmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3.5 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between text-xs mt-4">
            <span className="font-extrabold text-[#111827]">Engineering leads team size</span>
            <button onClick={() => navigate('/employees')} className="text-[#2563EB] font-extrabold hover:underline">Full Directory →</button>
          </div>
        </div>
      </div>

      {/* Widgets: Recent Hires, Birthdays & Live Scans */}
      <RecentActivity onOpenAddModal={onOpenAddModal} onOpenScanner={onOpenScanner} />

    </div>
  );
};
