import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import devtechLogo from '../../assets/devtech-logo.png';
import { Intern } from '../../types';

interface InternHorizontalCardProps {
  intern: Partial<Intern>;
  isBack?: boolean;
  id?: string;
}

export const InternHorizontalCard: React.FC<InternHorizontalCardProps> = ({
  intern,
  isBack = false,
  id
}) => {
  const internId = intern.internId || 'DTS-INT-2026-001';
  const fullName = intern.fullName || 'Authorized Intern';
  const role = intern.role || 'Software Engineering Intern';
  const dept = intern.department || 'Development';
  const college = intern.college || 'IIT Bombay';
  const duration = intern.duration || '6 Months';
  const startDate = intern.startDate || '01 Feb 2026';
  const endDate = intern.endDate || '31 Jul 2026';
  const mentorName = intern.mentorName || 'Yash Sunil Mohite';
  const photo = intern.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80';
  const status = intern.status || 'Active';

  const baseURL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? window.location.origin 
    : 'https://devtechitsolution.com';
  const verificationUrl = `${baseURL}/verify-intern/${internId}`;

  const qrPayload = `DEVTECH IT SOLUTION PVT LTD • INTERN CREDENTIAL
ID: ${internId}
Name: ${fullName}
Role: ${role}
Dept: ${dept}
College: ${college}
Duration: ${duration} (${startDate} to ${endDate})
Mentor: ${mentorName}
Status: ${status}
Verify: ${verificationUrl}`;

  if (isBack) {
    return (
      <div
        id={id}
        className="w-[450px] h-[284px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-saas relative overflow-hidden flex flex-col justify-between select-none font-sans p-6 text-[#111827]"
        style={{ width: '450px', height: '284px', minWidth: '450px', minHeight: '284px' }}
      >
        <div className="absolute top-3.5 left-0 right-0 h-9 bg-[#111827] flex items-center justify-between px-6 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase opacity-95">
          <span>DEVTECH IT SOLUTION PVT. LTD.</span>
          <span>AUTHORIZED INTERNSHIP CREDENTIAL</span>
        </div>

        <div className="mt-11 flex-1 flex flex-col justify-between">
          {/* Company Title & Contact Details */}
          <div className="p-2.5 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB]">
            <h3 className="text-[11px] font-black tracking-wide text-[#111827] uppercase border-b border-[#E5E7EB]/80 pb-1 mb-1.5 flex items-center justify-between">
              <span>DEVTECH IT SOLUTION PVT. LTD.</span>
              <span className="text-[8px] font-bold text-[#059669]">INTERN ACCESS</span>
            </h3>
            <div className="flex items-center justify-between gap-2 text-left">
              <div className="min-w-0 flex-1">
                <span className="font-bold text-[#6B7280] block uppercase text-[8px] tracking-wider mb-0.5">Email</span>
                <span className="font-extrabold text-[#2563EB] text-[11px] select-all block font-mono">
                  hr@devtechitsolution.com
                </span>
              </div>
              <div className="min-w-0 flex-1 text-right">
                <span className="font-bold text-[#6B7280] block uppercase text-[8px] tracking-wider mb-0.5">Website</span>
                <span className="font-extrabold text-[#111827] text-[11px] select-all block font-mono">
                  www.devtechitsolution.com
                </span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="my-auto py-1 px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#111827]">
                TERMS &amp; CONDITIONS
              </span>
              <span className="text-[8px] font-extrabold text-[#059669] bg-[#DCFCE7] px-2 py-0.5 rounded-full uppercase border border-[#BBF7D0]">
                Strict Compliance
              </span>
            </div>
            <ul className="text-[8.5px] text-[#475569] font-semibold space-y-0.5 leading-tight pl-3 list-disc marker:text-[#059669]">
              <li>This card is the property of DevTech IT Solution Pvt. Ltd.</li>
              <li>Intern must carry and display badge at all times on premises.</li>
              <li>Valid only for the authorized internship tenure ({duration}).</li>
              <li>Loss or theft must be reported immediately to the HR mentor.</li>
              <li>Surrender badge upon completion or termination of internship.</li>
            </ul>
          </div>

          {/* Bottom security assurance footer */}
          <div className="pt-1.5 border-t border-[#E5E7EB] flex items-center justify-end text-[8.5px] font-extrabold shrink-0">
            <span className="font-mono text-[#94A3B8] shrink-0">{internId} • DUPLEX-B-INT</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="w-[450px] h-[284px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-saas relative overflow-hidden flex flex-col justify-between select-none font-sans text-[#111827]"
      style={{ width: '450px', height: '284px', minWidth: '450px', minHeight: '284px' }}
    >
      <div className="h-2 w-full bg-[#2563EB]"></div>

      <div className="px-5 pb-5 pt-2.5 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#E5E7EB]/80 pb-1.5">
          <div className="flex items-center -my-2 -ml-2">
            <img src={devtechLogo} alt="DevTech IT Solution Pvt Ltd" className="h-[52px] w-auto max-w-[260px] object-contain object-left" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] text-[10px] font-black flex items-center gap-1 uppercase shrink-0 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> ACTIVE INTERN
          </span>
        </div>

        <div className="my-auto py-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src={photo}
                alt={fullName}
                className="w-22 h-22 rounded-[14px] object-cover border border-[#E5E7EB] shadow-xs"
                crossOrigin="anonymous"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#059669] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tight">
                INT
              </span>
            </div>

            <div className="min-w-0 pr-1 flex-1">
              <p className="text-[11px] font-mono font-extrabold text-[#2563EB] mb-0.5 tracking-wider truncate">
                {internId}
              </p>
              <h2 className="text-base font-black text-[#111827] tracking-tight leading-tight truncate">
                {fullName}
              </h2>
              <p className="text-[11px] font-extrabold text-[#111827] mt-0.5 truncate">
                {role} • <span className="text-[#475569] font-bold">{dept}</span>
              </p>
              <p className="text-[10px] font-extrabold text-[#2563EB] truncate mt-0.5 bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE] inline-block">
                🎓 {college}
              </p>
              <p className="text-[10px] font-semibold text-[#6B7280] truncate mt-0.5">
                Mentor: <strong className="text-[#334155] font-extrabold">{mentorName}</strong>
              </p>
            </div>
          </div>

          <div className="p-2 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] shadow-2xs shrink-0 flex flex-col items-center justify-center">
            <QRCodeSVG value={qrPayload} size={64} fgColor="#111827" bgColor="transparent" level="M" />
            <span className="text-[7.5px] font-mono font-extrabold text-[#059669] tracking-wider uppercase mt-1">
              Intern Scan
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E5E7EB]/80 flex items-center justify-between text-[9.5px] text-[#6B7280] font-bold">
          <span className="truncate pr-2">
            Tenure: <strong className="text-[#111827]">{duration}</strong> ({startDate} – {endDate})
          </span>
          <span className="font-mono text-[#059669] font-black uppercase shrink-0">INTERN PASS</span>
        </div>

      </div>
    </div>
  );
};
