import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEmployeeContext } from '../context/EmployeeContext';
import devtechLogo from '../assets/devtech-logo.png';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, loginAsDemoSuperAdmin, loginAsDemoHR } = useAuth();
  const { showToast } = useEmployeeContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      await login(email, password);
      const isSup = email.toLowerCase().includes('admin') || email.toLowerCase().includes('super');
      showToast('Login Successful', 'success', `Welcome to DevTech ID Suite (${isSup ? 'Super Admin' : 'HR Admin'} Access)!`);
      navigate('/');
    } catch (err) {
      setLoginError('Invalid corporate login credentials or password.');
      showToast('Authentication Failed', 'error', 'Authentication failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuperAdminDemo = () => {
    loginAsDemoSuperAdmin();
    showToast('Super Admin Access', 'success', 'Logged into Portal with Super Administrator privileges!');
    navigate('/');
  };

  const handleHRDemo = () => {
    loginAsDemoHR();
    showToast('HR Admin Access', 'success', 'Logged into Portal with HR Administrator privileges!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="bg-white w-full max-w-4xl rounded-[24px] border border-[#E5E7EB] shadow-saas-floating overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeIn">
        
        {/* Left Side: Enterprise Value Proposition */}
        <div className="bg-gradient-to-br from-[#DBEAFE]/80 via-[#E0F2FE]/50 to-white p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5E7EB]">
          <div>
            <div className="flex items-center">
              <img 
                src={devtechLogo} 
                alt="DevTech IT Solution Pvt Ltd" 
                className="h-[54px] w-auto max-w-[280px] object-contain object-left"
              />
            </div>

            <div className="mt-12 space-y-4">
              <span className="px-3 py-1 rounded-[12px] bg-white text-[#2563EB] text-xs font-black border border-[#2563EB]/20 shadow-2xs inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>2026 Enterprise Edition</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827] leading-tight tracking-tight">
                Modern Employee Identity & Smart Badging.
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed">
                Manage corporate staff onboarding, generate cryptographic PVC CR80 credentials, and verify external QR turnstile taps with zero-PII security.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-8 text-xs text-[#6B7280] font-bold border-t border-[#E5E7EB]/80 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>Microsoft & Google Style Minimal PVC Studios</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>Zebra Thermal Printer & Duplex Integration</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#111827]">Sign In to Workspace</h3>
            <p className="text-xs text-[#6B7280] font-medium">Enter your administrative HR credentials to open the dashboard.</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-[14px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-extrabold animate-fadeIn">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#111827]">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@devtech.com"
                  required
                  className="saas-input pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#111827]">Password</label>
                <span className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer">Forgot access key?</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="saas-input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="saas-btn-primary !w-full !py-3 !text-sm !rounded-[14px] shadow-md shadow-[#2563EB]/30 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>Sign In to Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="h-[1px] w-full bg-[#E5E7EB]"></div>
            <span className="px-3 text-[10px] font-mono font-extrabold bg-white text-[#94A3B8] uppercase tracking-wider absolute">
              Role-Based Instant Demo Passes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleSuperAdminDemo}
              disabled={isSubmitting}
              className="px-4 py-3 rounded-[14px] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#2563EB] text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Super Admin ID Pass</span>
            </button>

            <button
              type="button"
              onClick={handleHRDemo}
              disabled={isSubmitting}
              className="px-4 py-3 rounded-[14px] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-[#059669] text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>HR Admin ID Pass</span>
            </button>
          </div>

          <p className="text-center text-[10px] text-[#94A3B8] font-bold pt-2">
            Protected by DevTech IT Solution Cloud Security SLA.
          </p>
        </div>

      </div>
    </div>
  );
};
