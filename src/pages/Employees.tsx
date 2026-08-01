import React, { useState } from 'react';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { InteractiveBadgePreview } from '../components/cards/InteractiveBadgePreview';
import { parseEmployeesFromExcel } from '../services/excelService';
import { useEmployeeContext } from '../context/EmployeeContext';
import { Employee } from '../types';
import { Users, UserPlus, Upload, X, CreditCard, Sparkles } from 'lucide-react';
import { EmployeeFilters } from '../components/employees/EmployeeFilters';

interface EmployeesProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const EmployeesPage: React.FC<EmployeesProps> = ({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const { bulkImport, showToast } = useEmployeeContext();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [cardModalEmp, setCardModalEmp] = useState<Employee | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImporting(true);
      try {
        const parsed = await parseEmployeesFromExcel(file);
        const count = await bulkImport(parsed as Partial<Employee>[]);
        showToast('Bulk Import Successful', 'success', `Successfully loaded ${count} staff records.`);
        setIsImportModalOpen(false);
      } catch (err) {
        showToast('Import Error', 'error', 'Failed to parse Excel file format.');
      } finally {
        setImporting(false);
      }
    }
  };

  return (
    <div className="px-6 space-y-6 animate-fadeIn max-w-[1600px] mx-auto select-none">
      
      {/* Header Banner */}
      <div className="p-6 rounded-[24px] bg-white border border-[#E5E7EB] shadow-saas flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[14px] bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#111827] tracking-tight">
                Employee Directory & Registry Studio
              </h1>
              <span className="text-[11px] font-bold text-[#6B7280]">
                Manage DevTech IT Solution workforce records, assign sequence numbers, and print smart ID badges.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="saas-btn-secondary !px-4 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-[#22C55E]" />
            <span>Bulk Import Excel</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="saas-btn-primary !px-5 !py-2.5 !text-xs !rounded-[14px] flex items-center gap-2 shadow-md shadow-[#2563EB]/25"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <EmployeeFilters />

      {/* Main Table */}
      <EmployeeTable
        onEditEmployee={handleEdit}
        onOpenAddModal={onOpenAddModal}
        onOpenCardModal={(emp) => setCardModalEmp(emp)}
        onBulkImportClick={() => setIsImportModalOpen(true)}
      />

      {/* Registration & Edit Form Modal */}
      <EmployeeFormModal
        isOpen={Boolean(editingEmployee)}
        onClose={() => {
          setEditingEmployee(null);
        }}
        employeeToEdit={editingEmployee}
      />

      {/* Quick ID Card Preview Modal */}
      {cardModalEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[8px] animate-fadeIn">
          <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-saas-floating p-6 max-w-xl w-full relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#DBEAFE]/60 text-[#2563EB] flex items-center justify-center font-black">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-black text-[#111827] text-sm">
                  Smart Access Badge Studio • {cardModalEmp.employeeId}
                </h3>
              </div>
              <button
                onClick={() => setCardModalEmp(null)}
                className="p-1.5 rounded-full hover:bg-[#FEF2F2] text-[#6B7280] hover:text-[#EF4444] transition-all border border-transparent hover:border-[#FECACA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <InteractiveBadgePreview employee={cardModalEmp} />
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[8px] animate-fadeIn">
          <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-saas-floating p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-[#22C55E]" />
                <h3 className="font-black text-[#111827] text-sm">
                  Bulk Workforce Import (.XLSX / .CSV)
                </h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-[#6B7280] hover:text-[#111827]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
              Upload an Excel (.xlsx) file containing staff columns. Auto-sequence IDs (`DTS-2026-XXXX`) will be assigned automatically.
            </p>

            <div className="p-8 border-2 border-dashed border-[#E5E7EB] rounded-[20px] bg-[#F8FAFC] hover:bg-white text-center space-y-3 transition-colors">
              <Upload className="w-10 h-10 text-[#22C55E] mx-auto" />
              <label className="cursor-pointer saas-btn-primary !py-2.5 !px-5 !text-xs !rounded-[14px] inline-flex items-center gap-2">
                {importing ? 'Processing File...' : 'Choose Excel / CSV File'}
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
