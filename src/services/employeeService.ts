import { Employee, EmployeeStatus, VerificationLog, AuditLog, SystemSettings, Intern } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_SETTINGS, INITIAL_AUDIT_LOGS, INITIAL_VERIFICATION_LOGS, INITIAL_INTERNS } from '../data/initialData';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  addDoc 
} from 'firebase/firestore';

const LOCAL_STORAGE_KEYS = {
  EMPLOYEES: 'devtech_employees_v1',
  SETTINGS: 'devtech_settings_v1',
  AUDIT_LOGS: 'devtech_audit_logs_v1',
  VERIFICATION_LOGS: 'devtech_verification_logs_v1',
  INTERNS: 'devtech_interns_v1',
};

export const OFFICIAL_DEPARTMENTS = [
  'Development',
  'Cyber Security',
  'Human Resources',
  'Artificial Intelligence',
  'Operations',
  'Marketing',
  'Finance',
  'Administration',
  'Sales',
  'Design',
  'Quality Assurance',
  'Networking',
  'Cloud Computing',
  'Data Science',
  'Support',
] as const;

/**
 * Resolve any department name or abbreviation to its official 2/3 letter Enterprise code
 */
export const getDepartmentCode = (department?: string): string => {
  if (!department) return 'DEV';
  const clean = department.trim().toUpperCase();
  const codeMap: Record<string, string> = {
    'DEVELOPMENT': 'DEV',
    'ENGINEERING': 'DEV',
    'SOFTWARE ENGINEERING': 'DEV',
    'CYBER SECURITY': 'CYB',
    'SECURITY': 'CYB',
    'INFORMATION SECURITY': 'CYB',
    'HUMAN RESOURCES': 'HR',
    'EXECUTIVE HR': 'HR',
    'HR': 'HR',
    'ARTIFICIAL INTELLIGENCE': 'AI',
    'AI': 'AI',
    'OPERATIONS': 'OPS',
    'MARKETING': 'MKT',
    'FINANCE': 'FIN',
    'ADMINISTRATION': 'ADM',
    'ADMIN': 'ADM',
    'SALES': 'SAL',
    'SALES & GROWTH': 'SAL',
    'DESIGN': 'DSG',
    'DESIGN STUDIO': 'DSG',
    'UI/UX': 'DSG',
    'QUALITY ASSURANCE': 'QA',
    'QA': 'QA',
    'NETWORKING': 'NET',
    'NETWORK': 'NET',
    'CLOUD COMPUTING': 'CLD',
    'CLOUD ARCHITECTURE': 'CLD',
    'CLOUD': 'CLD',
    'DATA SCIENCE': 'DS',
    'SUPPORT': 'SUP',
  };
  if (codeMap[clean]) return codeMap[clean];
  
  if (clean.includes('DEV') || clean.includes('ENG') || clean.includes('TECH') || clean.includes('SOFT')) return 'DEV';
  if (clean.includes('SEC') || clean.includes('CYB')) return 'CYB';
  if (clean.includes('CLOUD')) return 'CLD';
  if (clean.includes('DESIGN') || clean.includes('STUDIO')) return 'DSG';
  if (clean.includes('HR')) return 'HR';
  if (clean.includes('SALE') || clean.includes('GROWTH')) return 'SAL';
  
  return 'ADM';
};

/**
 * Generate enterprise ID in format DTS-[TYPE]-[DEPARTMENT]-[SERIAL] with independent sequence increments
 */
export const generateEnterpriseId = (
  typeCode: 'EMP' | 'INT' | string,
  department: string,
  existingRecords: Array<{ employeeId?: string; internId?: string; employeeCode?: string; internCode?: string }> = []
): string => {
  const deptCode = getDepartmentCode(department);
  const prefix = `DTS-${typeCode.toUpperCase()}-${deptCode}-`;

  let maxSeq = 0;
  existingRecords.forEach(rec => {
    const idsToTest = [rec.employeeId, rec.internId, rec.employeeCode, rec.internCode].filter(Boolean) as string[];
    idsToTest.forEach(idStr => {
      if (idStr.startsWith(prefix)) {
        const remainder = idStr.slice(prefix.length);
        const match = remainder.match(/^(\d+)$/);
        if (match && match[1]) {
          const seq = parseInt(match[1], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    });
  });

  let nextSeq = maxSeq + 1;
  while (true) {
    const candidate = `${prefix}${nextSeq.toString().padStart(4, '0')}`;
    const collision = existingRecords.some(rec => 
      rec.employeeId === candidate || rec.internId === candidate || rec.employeeCode === candidate || rec.internCode === candidate
    );
    if (!collision) return candidate;
    nextSeq++;
  }
};

// Initialize LocalStorage with seed data if empty, and auto-migrate legacy ID formats to enterprise standard
const initLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  const existingEmployees = localStorage.getItem(LOCAL_STORAGE_KEYS.EMPLOYEES);
  if (!existingEmployees) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
  } else {
    try {
      const parsed: Employee[] = JSON.parse(existingEmployees);
      let updated = false;
      if (Array.isArray(parsed)) {
        const migratedList: Employee[] = [];
        parsed.forEach((emp) => {
          let modified = false;
          const validRegex = /^DTS-EMP-[A-Z0-9]+-\d{4}$/;
          if (!emp.employeeId || !validRegex.test(emp.employeeId) || !emp.employeeCode) {
            const newCode = generateEnterpriseId('EMP', emp.department || 'Development', migratedList);
            emp.employeeId = newCode;
            emp.employeeCode = newCode;
            modified = true;
          }
          migratedList.push(emp);
          if (modified) updated = true;
        });
        if (updated) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(migratedList));
        }
      }
    } catch (e) {
      console.warn('Employee migration check failed:', e);
    }
  }

  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify(INITIAL_VERIFICATION_LOGS));
  }

  const existingInterns = localStorage.getItem(LOCAL_STORAGE_KEYS.INTERNS);
  if (!existingInterns) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify(INITIAL_INTERNS));
  } else {
    try {
      const parsed: Intern[] = JSON.parse(existingInterns);
      let updated = false;
      if (Array.isArray(parsed)) {
        const migratedList: Intern[] = [];
        parsed.forEach((intRec) => {
          let modified = false;
          const validRegex = /^DTS-INT-[A-Z0-9]+-\d{4}$/;
          if (!intRec.internId || !validRegex.test(intRec.internId) || !intRec.internCode) {
            const newCode = generateEnterpriseId('INT', intRec.department || 'Development', migratedList);
            intRec.internId = newCode;
            intRec.internCode = newCode;
            modified = true;
          }
          migratedList.push(intRec);
          if (modified) updated = true;
        });
        if (updated) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify(migratedList));
        }
      }
    } catch (e) {
      console.warn('Intern migration check failed:', e);
    }
  }
};

initLocalStorage();

/**
 * Convert any designation or job role into a professional short form acronym (legacy wrapper support)
 */
export const getDesignationShortForm = (designation?: string): string => {
  if (!designation) return 'SDE';
  const clean = designation.trim().toUpperCase();
  if (!clean) return 'SDE';

  const map: Record<string, string> = {
    'SOFTWARE ENGINEER': 'SDE',
    'SOFTWARE DEVELOPMENT ENGINEER': 'SDE',
    'SENIOR SOFTWARE ENGINEER': 'SSDE',
    'JUNIOR SOFTWARE ENGINEER': 'JSDE',
    'PRODUCT MANAGER': 'PM',
    'PROJECT MANAGER': 'PJM',
    'HR EXECUTIVE': 'HR',
    'HR MANAGER': 'HRM',
    'EXECUTIVE HR': 'HR',
    'UI/UX DESIGNER': 'UX',
    'PRODUCT DESIGNER': 'DES',
    'DESIGNER': 'DES',
    'DEVOPS ENGINEER': 'DEVOPS',
    'DATA SCIENTIST': 'DS',
    'DATA ENGINEER': 'DE',
    'BUSINESS ANALYST': 'BA',
    'QUALITY ASSURANCE': 'QA',
    'QA ENGINEER': 'QA',
    'SYSTEM ADMINISTRATOR': 'SYS',
    'TECH LEAD': 'TL',
    'TECHNICAL LEAD': 'TL',
    'ENGINEERING MANAGER': 'EM',
    'ACCOUNTANT': 'FIN',
    'FINANCE MANAGER': 'FIN',
    'MARKETING MANAGER': 'MKT',
    'SALES EXECUTIVE': 'SALES',
    'CHIEF EXECUTIVE OFFICER': 'CEO',
    'CHIEF TECHNOLOGY OFFICER': 'CTO',
    'CHIEF OPERATING OFFICER': 'COO',
    'SECURITY SPECIALIST': 'SEC',
    'CYBERSECURITY SPECIALIST': 'SEC',
    'CYBERSECURITY ENGINEER': 'SEC',
    'CLOUD ARCHITECT': 'ARC',
    'SYSTEMS ARCHITECT': 'ARC',
    'SOLUTIONS ARCHITECT': 'ARC',
    'INTERN': 'INT',
    'MANAGER': 'MGR',
    'EMPLOYEE': 'EMP',
  };

  if (map[clean]) return map[clean];
  return clean.replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'EMP';
};

/**
 * Generate next unique Employee ID (Legacy wrapper forwarding to generateEnterpriseId)
 */
export const generateNextEmployeeId = (employees: { employeeId?: string }[], designation?: string): string => {
  return generateEnterpriseId('EMP', designation || 'Development', employees as any);
};

/**
 * Fetch all employees
 */
export const getEmployees = async (): Promise<Employee[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const list: Employee[] = [];
      querySnapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Employee);
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('Firestore fetch failed, reading local storage:', e);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.EMPLOYEES);
  return raw ? JSON.parse(raw) : INITIAL_EMPLOYEES;
};

/**
 * Fetch employee by Employee ID (e.g., DTS-2026-0001) - Secure read for verification
 */
export const getEmployeeByEmployeeId = async (employeeId: string): Promise<Employee | null> => {
  const cleanId = employeeId.trim().toUpperCase();
  
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'employees'), where('employeeId', '==', cleanId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Employee;
      }
    } catch (e) {
      console.warn('Firestore query failed, searching local storage:', e);
    }
  }

  const employees = await getEmployees();
  return employees.find(emp => emp.employeeId.toUpperCase() === cleanId) || null;
};

/**
 * Save / Create new employee
 */
export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'verificationCount'>): Promise<Employee> => {
  const employees = await getEmployees();
  
  let enterpriseId = employeeData.employeeId;
  const validEnterpriseRegex = /^DTS-EMP-[A-Z0-9]+-\d{4}$/;
  if (!enterpriseId || !validEnterpriseRegex.test(enterpriseId) || enterpriseId.includes('Will be generated') || employees.some(e => e.employeeId === enterpriseId || e.employeeCode === enterpriseId)) {
    enterpriseId = generateEnterpriseId('EMP', employeeData.department || 'Development', employees);
  }

  const now = new Date().toISOString();
  const newDocId = `emp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const newEmployee: Employee = {
    ...employeeData,
    id: newDocId,
    employeeId: enterpriseId,
    employeeCode: enterpriseId,
    verificationCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'employees', newDocId), newEmployee);
    } catch (e) {
      console.error('Firebase save failed:', e);
    }
  }

  const updatedList = [newEmployee, ...employees];
  localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedList));

  await addAuditLog({
    action: 'Employee Created',
    performedBy: employeeData.createdBy || 'HR Admin',
    targetEmployeeId: enterpriseId,
    targetEmployeeName: employeeData.fullName,
    details: `Created new enterprise record in ${employeeData.department} department (ID: ${enterpriseId}).`
  });

  return newEmployee;
};

/**
 * Update existing employee (enforces permanent ID immutability)
 */
export const updateEmployee = async (id: string, updates: Partial<Employee>, updatedBy: string = 'HR Admin'): Promise<Employee> => {
  const employees = await getEmployees();
  const index = employees.findIndex(emp => emp.id === id || emp.employeeId === id || emp.employeeCode === id);
  if (index === -1) throw new Error('Employee not found');

  const existing = employees[index];
  
  // Strip out identifiers to enforce immutability after creation
  const safeUpdates = { ...updates };
  delete (safeUpdates as any).employeeId;
  delete (safeUpdates as any).employeeCode;

  const updated: Employee = {
    ...existing,
    ...safeUpdates,
    employeeId: existing.employeeCode || existing.employeeId || generateEnterpriseId('EMP', existing.department, employees),
    employeeCode: existing.employeeCode || existing.employeeId || generateEnterpriseId('EMP', existing.department, employees),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'employees', existing.id), updated as Record<string, any>);
    } catch (e) {
      console.error('Firebase update failed:', e);
    }
  }

  employees[index] = updated;
  localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));

  await addAuditLog({
    action: 'Employee Updated',
    performedBy: updatedBy,
    targetEmployeeId: updated.employeeId,
    targetEmployeeName: updated.fullName,
    details: `Updated employee parameters (${Object.keys(updates).join(', ')}).`
  });

  return updated;
};

/**
 * Update employee status (Active, Inactive, Suspended, Resigned, Terminated)
 */
export const updateEmployeeStatus = async (id: string, status: EmployeeStatus, updatedBy: string = 'HR Admin'): Promise<Employee> => {
  return updateEmployee(id, { status }, updatedBy);
};

/**
 * Delete employee
 */
export const deleteEmployee = async (id: string, deletedBy: string = 'HR Admin'): Promise<void> => {
  const employees = await getEmployees();
  const existing = employees.find(emp => emp.id === id || emp.employeeId === id);
  
  if (existing) {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'employees', existing.id));
      } catch (e) {
        console.error('Firebase delete failed:', e);
      }
    }

    const filtered = employees.filter(emp => emp.id !== existing.id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(filtered));

    await addAuditLog({
      action: 'Employee Deleted',
      performedBy: deletedBy,
      targetEmployeeId: existing.employeeId,
      targetEmployeeName: existing.fullName,
      details: `Removed employee from database.`
    });
  }
};

/**
 * Record Public Verification Log when a QR code is scanned
 */
export const recordVerification = async (employeeId: string, status: EmployeeStatus | 'NotFound', employeeName: string = 'Unknown'): Promise<void> => {
  const now = new Date();
  const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);

  // Detect user agent & device info
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser';
  let deviceType = 'Desktop';
  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  if (/ipad|tablet/i.test(ua)) deviceType = 'Tablet';

  let browser = 'Modern Web Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  const newLog: VerificationLog = {
    id: `vlog_${Date.now()}`,
    employeeId,
    employeeName,
    timestamp: timestampStr,
    browser: `${browser} (${deviceType})`,
    deviceType,
    location: 'Verified via Web Portal',
    status
  };

  // 1. Save log
  const existingLogsRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS);
  const existingLogs: VerificationLog[] = existingLogsRaw ? JSON.parse(existingLogsRaw) : INITIAL_VERIFICATION_LOGS;
  localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify([newLog, ...existingLogs]));

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, 'verification_logs'), newLog);
    } catch (e) {
      console.error('Firestore log failed:', e);
    }
  }

  // 2. Increment verification count on employee if found
  if (status !== 'NotFound') {
    const employee = await getEmployeeByEmployeeId(employeeId);
    if (employee) {
      await updateEmployee(employee.id, {
        verificationCount: (employee.verificationCount || 0) + 1,
        lastVerifiedAt: timestampStr,
      }, 'Public Verification Portal');
    }
  }
};

/**
 * Fetch Verification Logs
 */
export const getVerificationLogs = async (): Promise<VerificationLog[]> => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.VERIFICATION_LOGS);
  return raw ? JSON.parse(raw) : INITIAL_VERIFICATION_LOGS;
};

/**
 * Audit Logs
 */
export const addAuditLog = async (logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
  const newLog: AuditLog = {
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    ...logData
  };

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS);
  const logs: AuditLog[] = raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([newLog, ...logs]));
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS);
  return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
};

/**
 * Settings Management
 */
export const getSystemSettings = (): SystemSettings => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
  if (!raw) return INITIAL_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    let modified = false;
    if (parsed.companyName && parsed.companyName.includes('Solutions')) {
      parsed.companyName = parsed.companyName.replace(/Solutions/g, 'Solution');
      modified = true;
    }
    if (parsed.contactPhone === '+91 93218 12345') {
      parsed.contactPhone = '+919321812345';
      modified = true;
    }
    if (parsed.headquartersAddress && parsed.headquartersAddress.includes('421301')) {
      parsed.headquartersAddress = 'Kalyan, Kalyan, India';
      modified = true;
    }
    if (modified) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
    }
    return { ...INITIAL_SETTINGS, ...parsed };
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const updateSystemSettings = (newSettings: Partial<SystemSettings>): SystemSettings => {
  const current = getSystemSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
};

/**
 * Interns Management
 */
export const getInterns = async (): Promise<Intern[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'interns'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: Intern[] = [];
      snapshot.forEach(docSnapshot => {
        items.push({ id: docSnapshot.id, ...docSnapshot.data() } as Intern);
      });
      if (items.length > 0) return items;
    } catch (e) {
      console.error('Firebase interns fetch error:', e);
    }
  }
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.INTERNS);
  return raw ? JSON.parse(raw) : INITIAL_INTERNS;
};

export const createIntern = async (data: Omit<Intern, 'id' | 'createdAt' | 'updatedAt'>): Promise<Intern> => {
  const internsList = await getInterns();
  
  let enterpriseId = data.internId;
  const validInternRegex = /^DTS-INT-[A-Z0-9]+-\d{4}$/;
  if (!enterpriseId || !validInternRegex.test(enterpriseId) || enterpriseId.includes('Will be generated') || internsList.some(i => i.internId === enterpriseId || i.internCode === enterpriseId)) {
    enterpriseId = generateEnterpriseId('INT', data.department || 'Development', internsList);
  }

  const newId = `int_${Date.now()}`;
  const now = new Date().toISOString();
  const newIntern: Intern = {
    ...data,
    id: newId,
    internId: enterpriseId,
    internCode: enterpriseId,
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'interns'), newIntern);
      newIntern.id = docRef.id;
    } catch (e) {
      console.error('Firebase create intern error:', e);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.INTERNS);
  const existing: Intern[] = raw ? JSON.parse(raw) : INITIAL_INTERNS;
  const updated = [newIntern, ...existing];
  localStorage.setItem(LOCAL_STORAGE_KEYS.INTERNS, JSON.stringify(updated));

  await addAuditLog({
    action: 'Employee Created',
    performedBy: 'HR Admin',
    targetEmployeeId: newIntern.internId,
    targetEmployeeName: newIntern.fullName,
    details: `Created enterprise intern credential for ${newIntern.role} in ${newIntern.department} department (ID: ${enterpriseId}).`
  });

  return newIntern;
};
