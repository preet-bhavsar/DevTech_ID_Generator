import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployeeContext } from '../context/EmployeeContext';
import { InteractiveBadgePreview } from '../components/cards/InteractiveBadgePreview';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Award, 
  CreditCard, 
  User, 
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

type TabType = 'Overview' | 'Documents' | 'Certificates' | 'Badge';

export const EmployeeProfilePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employees, showToast } = useEmployeeContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  const employee = employees.find(e => e.employeeId === employeeId || e.id === employeeId);

  if (!employee) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12 bg-white rounded-[24px] border border-[#E5E7EB] shadow-saas">
        <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto font-black">
          !
        </div>
        <h3 className="text-lg font-black text-[#111827]">Employee Record Not Found</h3>
        <p className="text-xs text-[#6B7280]">The ID code you are searching for is not registered in the DevTech IT Solution database.</p>
        <button onClick={() => navigate('/employees')} className="saas-btn-primary !w-full">Return to Directory</button>
      </div>
    );
  }

  const emailStr = employee.companyEmail || (employee as any).email || 'employee@devtech.com';
  const joiningStr = employee.dateOfJoining || (employee as any).joiningDate || 'January 14, 2026';
  const verificationUrl = `${window.location.origin}/verify/${employee.employeeId}`;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'Overview', label: 'Overview', icon: User },
    { id: 'Badge', label: 'Badge Studio', icon: CreditCard },
    { id: 'Documents', label: 'Documents', icon: FileText },
    { id: 'Certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div className="px-6 space-y-8 animate-fadeIn max-w-[1600px] mx-auto select-none">
      
      <div>
        <button
          onClick={() => navigate('/employees')}
          className="text-xs font-extrabold text-[#6B7280] hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </button>
      </div>

      {/* Top Banner Hero */}
      <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-saas overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#DBEAFE]/80 via-[#E0F2FE]/50 to-white px-8 pt-6 flex items-start justify-end relative">
          <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] font-black text-xs uppercase flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span>Verification Status: {employee.status || 'Active'}</span>
          </span>
        </div>

        <div className="px-8 pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12">
            <img
              src={employee.photo}
              alt={employee.fullName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-[24px] object-cover border-4 border-white shadow-saas-md shrink-0 bg-white"
            />
            <div className="space-y-2 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">{employee.fullName}</h1>
                <span className="px-3 py-1 rounded-[10px] bg-[#EFF6FF] text-[#2563EB] font-mono text-xs font-black border border-[#2563EB]/20 uppercase shadow-2xs">
                  {employee.employeeId}
                </span>
                {employee.bloodGroup && (
                  <span className="px-2.5 py-1 rounded-[10px] bg-[#2563EB] text-white text-xs font-extrabold shadow-xs">
                    Blood Tag: {employee.bloodGroup}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#2563EB]">
                <span>{employee.designation}</span>
                {employee.employmentType && (
                  <>
                    <span className="text-[#94A3B8]">•</span>
                    <span className="text-[11px] bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-2 py-0.5 rounded-md font-extrabold uppercase">
                      {employee.employmentType}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#6B7280] font-semibold flex flex-wrap items-center gap-2 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>{employee.department} Division</span>
                </span>
                <span className="text-[#94A3B8]">•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>{emailStr}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0 xl:pb-1">
            <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs hover:border-[#CBD5E1] transition-colors">
              <QRCodeSVG value={verificationUrl} size={48} fgColor="#111827" bgColor="transparent" />
              <div className="text-left">
                <span className="text-[10px] font-mono font-extrabold uppercase text-[#94A3B8] block">Live QR Preview</span>
                <button
                  onClick={() => window.open(verificationUrl, '_blank')}
                  className="text-xs font-black text-[#2563EB] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>Public Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('Badge')}
              className="saas-btn-primary !py-3.5 !px-6 !rounded-[16px] flex items-center gap-2.5 shadow-md shadow-[#2563EB]/25 font-black text-xs uppercase tracking-wide shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>Download Badge</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB] select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs sm:text-sm font-extrabold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827] border border-[#E5E7EB]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {activeTab === 'Overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-5">
              <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider pb-3 border-b border-[#E5E7EB]">
                Executive Employment Hierarchy & Assignment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">Full Employee Name</span>
                  <strong className="text-sm text-[#111827] font-extrabold mt-0.5 block">{employee.fullName}</strong>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">Assigned Division</span>
                  <strong className="text-sm text-[#2563EB] font-extrabold mt-0.5 block">{employee.department} HQ</strong>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">Designation Role</span>
                  <strong className="text-sm text-[#111827] font-extrabold mt-0.5 block">{employee.designation}</strong>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-extrabold block uppercase">Official Onboarding Cycle</span>
                  <strong className="text-sm text-[#111827] font-extrabold mt-0.5 block">{joiningStr}</strong>
                </div>
              </div>
              <div className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#6B7280] font-medium leading-relaxed mt-4">
                This employee holds active physical access rights to DevTech IT Solution headquarters, technology server clusters, and biometric turnstiles.
              </div>
            </div>

            <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4">
              <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider pb-3 border-b border-[#E5E7EB]">
                Contact & Security Info
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/60">
                  <span className="text-[#6B7280]">Work Email:</span>
                  <span className="font-bold text-[#111827]">{emailStr}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#E5E7EB]/60">
                  <span className="text-[#6B7280]">Work Phone:</span>
                  <span className="font-bold text-[#111827]">{employee.phone || '+1 (555) 389-9800'}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#6B7280]">Security Clearance:</span>
                  <span className="font-extrabold text-[#22C55E]">Tier 3 Master</span>
                </div>
              </div>
              <button onClick={() => setActiveTab('Badge')} className="saas-btn-secondary !w-full text-center">
                Launch Smart Badge Studio
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'Badge' && (
          <motion.div key="badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <InteractiveBadgePreview employee={employee} />
          </motion.div>
        )}

        {activeTab === 'Documents' && (
          <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider">Verified Employee Document Vault</h3>
              <span className="text-xs text-[#22C55E] font-extrabold flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Encrypted Vault</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {['Offer Letter & NDA Agreement.pdf', 'Government Photo Identity verified.pdf', 'Annual Compensation Appraisal 2026.pdf'].map((doc, idx) => (
                <div key={idx} className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] flex flex-col justify-between h-32 hover:bg-white hover:shadow-saas transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-[#2563EB] shrink-0 mt-0.5" />
                    <strong className="text-xs font-bold text-[#111827] leading-tight line-clamp-2">{doc}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#E5E7EB]/70">
                    <span className="text-[#94A3B8] font-mono">PDF • 2.4 MB</span>
                    <button onClick={() => showToast('Download Started', 'info', 'Downloading encrypted HR dossier...')} className="text-[#2563EB] font-extrabold hover:underline">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'Certificates' && (
          <motion.div key="cert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-saas space-y-4">
            <h3 className="text-sm font-black text-[#111827] uppercase tracking-wider pb-3 border-b border-[#E5E7EB]">Corporate Compliance & Technical Certifications</h3>
            <div className="space-y-3">
              {[
                { title: 'ISO 27001 Enterprise Cybersecurity Master', issued: 'July 2026', badge: 'DevTech Shield Verified' },
                { title: 'Cloud Systems Architecture & Biometrics', issued: 'June 2026', badge: 'Distinction' }
              ].map((c, idx) => (
                <div key={idx} className="p-4 rounded-[16px] bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Award className="w-8 h-8 text-[#06B6D4] bg-[#E0F2FE] p-1.5 rounded-[12px] shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold text-[#111827]">{c.title}</h4>
                      <span className="text-xs text-[#6B7280]">Issued: {c.issued}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-extrabold text-xs shrink-0">{c.badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
