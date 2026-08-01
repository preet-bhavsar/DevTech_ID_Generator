import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployeeContext } from '../context/EmployeeContext';
import { 
  CheckCircle2, 
  Check, 
  XCircle, 
  ArrowLeft, 
  Lock, 
  Printer 
} from 'lucide-react';
import devtechLogo from '../assets/devtech-logo.png';

export const VerifyEmployeePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employees } = useEmployeeContext();
  const navigate = useNavigate();

  const [verificationTime] = useState<string>(() => {
    try {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
      return `${datePart} at ${timePart}`;
    } catch (e) {
      return new Date().toLocaleString();
    }
  });

  const employee = employees.find(
    e => e.employeeId === employeeId || e.id === employeeId || e.employeeId.toLowerCase() === employeeId?.toLowerCase()
  );

  const isValid = employee && employee.status === 'Active';

  const formatJoiningDate = (dateStr?: string) => {
    if (!dateStr) return '10 Mar 2022';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    } catch (e) {
      // Ignore fallback
    }
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans p-4 sm:p-8 flex flex-col items-center justify-center animate-fadeIn select-none">
      
      {/* Top Bar Navigation */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/login')}
          className="text-xs font-extrabold text-[#6B7280] hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>DevTech IT Solution Corporate Portal</span>
        </button>
        <span className="text-[11px] font-mono font-extrabold px-3 py-1 rounded-full bg-white text-[#6B7280] border border-[#E5E7EB] shadow-2xs flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-[#2563EB]" /> Zero-PII SSL Gateway
        </span>
      </div>

      {/* Main Verification Trust Card */}
      <div className="bg-white w-full max-w-2xl rounded-[28px] border border-[#E5E7EB] shadow-saas-floating p-6 sm:p-8 space-y-8">
        
        {/* Header Row: Logo & ID Badge */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]/80">
          <img src={devtechLogo} alt="DevTech Logo" className="h-10 sm:h-12 w-auto object-contain" />
          <div className="px-4 py-1.5 rounded-[12px] bg-[#FEF3C7] text-[#D97706] font-mono font-black text-xs sm:text-sm border border-[#FDE68A] shadow-2xs shrink-0">
            ID: {employee?.employeeId || employeeId || 'N/A'}
          </div>
        </div>

        {/* Status Banner Box */}
        {isValid && employee ? (
          <>
            <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-b from-[#DCFCE7]/70 to-[#F0FDF4] border border-[#BBF7D0] text-center shadow-2xs space-y-2.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#22C55E]/15 border-2 border-[#22C55E] text-[#16A34A] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#15803D] flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#22C55E] shrink-0" />
                <span>Employee Verified</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#15803D]/90">
                Official Authorized Credentials Confirmed
              </p>
            </div>

            {/* Employee Information Data Sheet */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold tracking-widest uppercase text-[#6B7280] px-1">
                EMPLOYEE INFORMATION
              </h3>

              <div className="rounded-[20px] bg-white border border-[#E5E7EB] shadow-2xs overflow-hidden divide-y divide-[#E5E7EB]">
                
                {/* Name */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Name</span>
                  <span className="text-sm font-black text-[#111827] w-full sm:w-2/3 sm:text-left">{employee.fullName || 'N/A'}</span>
                </div>

                {/* Employee ID */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Employee ID</span>
                  <span className="text-sm font-mono font-black text-[#F59E0B] w-full sm:w-2/3 sm:text-left">{employee.employeeId || 'N/A'}</span>
                </div>

                {/* Company */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Company</span>
                  <span className="text-sm font-extrabold text-[#111827] w-full sm:w-2/3 sm:text-left">DevTech IT Solution Pvt. Ltd.</span>
                </div>

                {/* Designation */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Designation</span>
                  <span className="text-sm font-extrabold text-[#2563EB] w-full sm:w-2/3 sm:text-left">{employee.designation || 'Staff Member'}</span>
                </div>

                {/* Department */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Department</span>
                  <span className="text-sm font-extrabold text-[#111827] w-full sm:w-2/3 sm:text-left">{employee.department || 'General Operations'}</span>
                </div>

                {/* Status */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Status</span>
                  <div className="w-full sm:w-2/3 sm:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-extrabold text-xs border border-[#BBF7D0]">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                      Active
                    </span>
                  </div>
                </div>

                {/* Joined On */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Joined On</span>
                  <span className="text-sm font-extrabold text-[#111827] w-full sm:w-2/3 sm:text-left">{formatJoiningDate(employee.dateOfJoining)}</span>
                </div>

                {/* Valid Till */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#F8FAFC]/50 transition-colors">
                  <span className="text-xs font-bold text-[#6B7280] w-full sm:w-1/3">Valid Till</span>
                  <span className="text-sm font-bold text-[#16A34A] w-full sm:w-2/3 sm:text-left">{employee.validTill || 'Until Employment'}</span>
                </div>

              </div>
            </div>

            {/* Verified Successfully Summary & Timestamp Box */}
            <div className="p-5 sm:p-6 rounded-[20px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#15803D] font-black text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                <span>Verified Successfully</span>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] font-medium">
                This employee is an authorized member of <strong className="text-[#111827] font-black">DevTech IT Solution Pvt. Ltd.</strong>
              </p>
              <div className="pt-3 mt-2 border-t border-[#E5E7EB]/80 text-xs text-[#6B7280] font-bold flex flex-wrap items-center justify-between gap-3">
                <span>Verification Time: <strong className="text-[#111827] font-mono font-bold">{verificationTime}</strong></span>
                <button
                  onClick={() => window.print()}
                  className="saas-btn-secondary !py-1.5 !px-3 !text-xs shrink-0 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Record</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-b from-[#FEF2F2]/80 to-[#FFF5F5] border border-[#FECACA] text-center shadow-2xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EF4444]/15 border-2 border-[#EF4444] text-[#DC2626] flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <XCircle className="w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#DC2626]">
              Credential Invalid / Revoked
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#DC2626]/90 max-w-md mx-auto">
              This ID card code does not correspond to an active employee record or has been revoked by HR operations.
            </p>
            <div className="p-4 rounded-[16px] bg-white border border-[#FECACA] text-xs font-mono text-[#94A3B8]">
              Query Target: {employeeId || 'Unknown Code'}
            </div>
          </div>
        )}

        {/* Copyright Footer */}
        <div className="pt-4 text-center text-xs font-bold text-[#6B7280] border-t border-[#E5E7EB]/70">
          © DevTech IT Solution Pvt. Ltd. All Rights Reserved.
        </div>

      </div>
    </div>
  );
};

