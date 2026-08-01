import React from 'react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { Search, Filter, Building2, ShieldCheck, RefreshCw } from 'lucide-react';

export const EmployeeFilters: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedDepartment, 
    setSelectedDepartment, 
    selectedStatus, 
    setSelectedStatus, 
    employees 
  } = useEmployeeContext();

  const departments = ['All', ...new Set(employees.map(e => e.department))];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended', 'On Leave'];

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedStatus('All');
  };

  const isFiltered = searchQuery !== '' || selectedDepartment !== 'All' || selectedStatus !== 'All';

  return (
    <div className="p-5 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Large Height Rounded Search Input with Internal Icon */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search personnel by Full Name, Employee ID, Designation, or Email address..."
            className="w-full h-12 pl-12 pr-4 rounded-[14px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#94A3B8] font-medium focus:outline-hidden focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all duration-200 shadow-2xs"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          
          {/* Department Filter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs">
            <Building2 className="w-4 h-4 text-[#6B7280] shrink-0" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-[#111827] focus:outline-hidden cursor-pointer min-w-[120px]"
            >
              <option value="All">All Divisions</option>
              {departments.filter(d => d !== 'All').map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Chip Filter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-[14px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-[#111827] focus:outline-hidden cursor-pointer min-w-[100px]"
            >
              {statuses.map((s, i) => (
                <option key={i} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>

          {/* Reset Action */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-[14px] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Reset all search criteria"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
