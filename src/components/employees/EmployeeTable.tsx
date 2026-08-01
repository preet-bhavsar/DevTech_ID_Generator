import React, { useState } from 'react';
import { useEmployeeContext } from '../../context/EmployeeContext';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../types';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Search,
  UserPlus,
  Upload
} from 'lucide-react';

interface EmployeeTableProps {
  onEdit?: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  onOpenAddModal?: () => void;
  onOpenCardModal?: (emp: Employee) => void;
  onBulkImportClick?: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  onEdit, 
  onEditEmployee, 
  onOpenAddModal, 
  onOpenCardModal,
  onBulkImportClick 
}) => {
  const { 
    filteredEmployees, 
    deleteEmployee, 
    showToast 
  } = useEmployeeContext();
  
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const currentRecords = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    if (window.confirm(`Are you certain you want to revoke and remove employee record for ${name}?`)) {
      await deleteEmployee(id);
      showToast('Credential Revoked', 'warning', `Employee record for ${name} removed from active DevTech registry.`);
    }
  };

  const handleActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  const handleEditRecord = (emp: Employee) => {
    if (onEditEmployee) onEditEmployee(emp);
    else if (onEdit) onEdit(emp);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-saas overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-black uppercase text-[#6B7280] tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-4 pl-6 pr-4">Employee Avatar & Name</th>
                <th className="py-4 px-4">Atomic ID</th>
                <th className="py-4 px-4">Designation</th>
                <th className="py-4 px-4">Department Badge</th>
                <th className="py-4 px-4">Status Chip</th>
                <th className="py-4 px-4">Joining Cycle</th>
                <th className="py-4 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]/60 text-xs sm:text-sm font-medium text-[#111827]">
              {currentRecords.length > 0 ? (
                currentRecords.map((emp) => {
                  const isActive = emp.status === 'Active';
                  const emailStr = emp.companyEmail || (emp as any).email || 'employee@devtech.com';
                  const joiningDateStr = emp.dateOfJoining || (emp as any).joiningDate || 'Jan 2026';
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => navigate(`/employees/${emp.employeeId}`)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 pl-6 pr-4">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={emp.photo} 
                            alt={emp.fullName} 
                            className="w-10 h-10 rounded-[14px] object-cover border border-[#E5E7EB] shadow-2xs shrink-0 group-hover:scale-105 transition-transform" 
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#111827] group-hover:text-[#2563EB] transition-colors truncate">
                              {emp.fullName}
                            </p>
                            <p className="text-xs text-[#6B7280] truncate font-normal">{emailStr}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-xs text-[#2563EB]">
                        {emp.employeeId}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#111827] text-xs">
                        {emp.designation}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-[10px] bg-[#DBEAFE]/40 text-[#2563EB] text-[11px] font-black border border-[#DBEAFE]">
                          {emp.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-[11px] font-black border ${
                          isActive
                            ? 'bg-[#DCFCE7]/70 text-[#22C55E] border-[#BBF7D0]'
                            : 'bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]'
                        }`}>
                          {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{emp.status || 'Active'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-semibold text-[#6B7280]">
                        {joiningDateStr}
                      </td>

                      <td className="py-3.5 pl-4 pr-6 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleActionClick(e, emp.id)}
                          className="p-2 rounded-[12px] bg-[#F8FAFC] hover:bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-all shadow-2xs"
                          title="Record actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeDropdownId === emp.id && (
                          <div className="absolute right-6 top-12 w-48 rounded-[16px] bg-white border border-[#E5E7EB] shadow-saas-floating z-30 p-1.5 space-y-1 text-left animate-fadeIn">
                            <button
                              onClick={() => { setActiveDropdownId(null); navigate(`/employees/${emp.employeeId}`); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>View Profile & Badge</span>
                            </button>

                            {onOpenCardModal && (
                              <button
                                onClick={() => { setActiveDropdownId(null); onOpenCardModal(emp); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-[#0EA5E9]" />
                                <span>Quick PVC Preview</span>
                              </button>
                            )}

                            <button
                              onClick={() => { setActiveDropdownId(null); handleEditRecord(emp); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#F59E0B]" />
                              <span>Edit Record</span>
                            </button>

                            <div className="h-[1px] bg-[#E5E7EB] my-1"></div>

                            <button
                              onClick={(e) => handleDelete(e, emp.id, emp.fullName)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-bold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                              <span>Revoke & Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#DBEAFE]/50 flex items-center justify-center text-[#2563EB]">
                        <Search className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-black text-[#111827]">No Employee Records Found</h4>
                      <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                        We couldn't find any workforce credentials matching your filter or search query.
                      </p>
                      {onOpenAddModal && (
                        <button
                          onClick={onOpenAddModal}
                          className="saas-btn-primary !px-5 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 mt-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Onboard Employee</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#6B7280]">
          <div>
            Showing <strong className="text-[#111827]">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-[#111827]">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</strong> of <strong className="text-[#111827]">{filteredEmployees.length}</strong> verified personnel records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-[12px] bg-white text-[#111827] border border-[#E5E7EB] font-bold shadow-2xs hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="px-3.5 py-1.5 rounded-[12px] bg-[#2563EB] text-white font-black text-xs shadow-2xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3.5 py-1.5 rounded-[12px] bg-white text-[#111827] border border-[#E5E7EB] font-bold shadow-2xs hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
