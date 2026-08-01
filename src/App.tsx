import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { QRScannerModal } from './components/scanner/QRScannerModal';
import { CommandPalette } from './components/common/CommandPalette';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EmployeesPage } from './pages/Employees';
import { EmployeeProfilePage } from './pages/EmployeeProfile';
import { GenerateCardsPage } from './pages/GenerateCards';
import { VerifyEmployeePage } from './pages/VerifyEmployee';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VerificationLogsPage } from './pages/VerificationLogsPage';
import { AdminProfilePage } from './pages/AdminProfilePage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-extrabold text-[#6B7280] tracking-wider uppercase">Loading DevTech ID SaaS...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const location = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isPublicRoute = location.pathname.startsWith('/verify/') || location.pathname.startsWith('/employee/') || location.pathname === '/login';

  if (isPublicRoute) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:employeeId" element={<VerifyEmployeePage />} />
          <Route path="/employee/:employeeId" element={<VerifyEmployeePage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer />
      </>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827] antialiased font-sans">
        {/* Floating White SaaS Sidebar */}
        <Sidebar onOpenScanner={() => setIsScannerOpen(true)} />

        {/* Main Content Workspace with Ample Spacing */}
        <div className="flex-1 flex flex-col min-w-0 pr-4 pb-4 pt-0">
          <Navbar
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          <main className="flex-1 overflow-y-auto pt-6 pb-12">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                    onOpenScanner={() => setIsScannerOpen(true)}
                  />
                }
              />
              <Route
                path="/employees"
                element={
                  <EmployeesPage
                    isAddModalOpen={isAddModalOpen}
                    onCloseAddModal={() => setIsAddModalOpen(false)}
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                  />
                }
              />
              <Route path="/employees/:employeeId" element={<EmployeeProfilePage />} />
              <Route path="/generate-cards" element={<GenerateCardsPage />} />
              <Route path="/verification-logs" element={<VerificationLogsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<AdminProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* Global QR Scanner Modal */}
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
        />

        {/* Global Employee Onboarding Modal */}
        <EmployeeFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        {/* Floating Notification Toasts */}
        <ToastContainer />
      </div>
    </ProtectedRoute>
  );
};
