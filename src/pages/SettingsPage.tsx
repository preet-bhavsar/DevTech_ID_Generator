import React, { useState } from 'react';
import { useEmployeeContext } from '../context/EmployeeContext';
import { 
  Building2, 
  Save 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast } = useEmployeeContext();
  
  // Corporate Profile State
  const [companyName, setCompanyName] = useState(settings.companyName || 'DevTech IT Solution Pvt. Ltd.');
  const [website, setWebsite] = useState(settings.website || 'www.devtechitsolution.com');
  const [hrEmail, setHrEmail] = useState(settings.contactEmail || 'hr@devtechitsolution.com');
  const [supportPhone, setSupportPhone] = useState(settings.contactPhone || '+919321812345');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      website,
      contactEmail: hrEmail,
      contactPhone: supportPhone
    });
    showToast('Corporate profile specifications saved successfully!', 'success');
  };

  return (
    <div className="px-6 space-y-6 animate-fadeIn max-w-[1500px] mx-auto select-none py-2">
      
      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Corporate Profile Settings (2 Columns) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E7EB] shadow-saas space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight border-b border-[#E5E7EB] pb-4">
            Corporate Profile Settings
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="saas-input font-extrabold text-sm"
                />
              </div>

              {/* Company Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">Company Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="saas-input font-mono font-bold text-sm text-[#475569]"
                />
              </div>

              {/* HR Contact Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">HR Contact Email</label>
                <input
                  type="email"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  className="saas-input font-mono font-bold text-sm text-[#475569]"
                />
              </div>

              {/* Support Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#111827]">Support Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="saas-input font-mono font-bold text-sm text-[#475569]"
                />
              </div>

            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
              <button
                type="submit"
                className="saas-btn-primary !px-6 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Corporate Branches (1 Column) */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E7EB] shadow-saas space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E7EB]">
            <Building2 className="w-5 h-5 text-[#2563EB] shrink-0" />
            <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
              Corporate Branches
            </h2>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-[20px] bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#2563EB]/40 transition-colors space-y-2 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-black text-[#111827]">
                  Kalyan HQ Branch
                </h4>
                <span className="px-2.5 py-0.5 rounded-[6px] bg-[#DCFCE7] text-[#16A34A] text-[10px] font-mono font-black border border-[#BBF7D0] tracking-wider shrink-0">
                  HQ
                </span>
              </div>
              <p className="text-xs font-bold text-[#6B7280]">
                Kalyan, Kalyan, India
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
