import * as XLSX from 'xlsx';
import { Employee, BloodGroup, Gender, EmploymentType, EmployeeStatus } from '../types';

export const exportEmployeesToExcel = (employees: Employee[], filename = 'DevTech_Employees_Export.xlsx') => {
  const exportData = employees.map(emp => ({
    'Employee ID': emp.employeeId,
    'Full Name': emp.fullName,
    'Department': emp.department,
    'Designation': emp.designation,
    'Company Email': emp.companyEmail,
    'Personal Email': emp.personalEmail || '',
    'Phone': emp.phone,
    'Emergency Contact': emp.emergencyContact,
    'Date of Joining': emp.dateOfJoining,
    'Blood Group': emp.bloodGroup,
    'Gender': emp.gender,
    'Date of Birth': emp.dateOfBirth,
    'Status': emp.status,
    'Employment Type': emp.employmentType,
    'Manager Name': emp.managerName,
    'Address': emp.address,
    'City': emp.city,
    'State': emp.state,
    'Country': emp.country,
    'PIN Code': emp.pinCode,
    'Verifications': emp.verificationCount || 0,
    'Created At': emp.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

  // Auto-fit column widths
  const colWidths = Object.keys(exportData[0] || {}).map(key => ({
    wch: Math.max(key.length + 3, 15)
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
};

export const exportEmployeesToCSV = (employees: Employee[], filename = 'DevTech_Employees.csv') => {
  const exportData = employees.map(emp => ({
    'Employee ID': emp.employeeId || '',
    'Full Name': emp.fullName || '',
    'Department': emp.department || '',
    'Designation': emp.designation || '',
    'Company Email': emp.companyEmail || '',
    'Personal Email': emp.personalEmail || '',
    'Phone': emp.phone || '',
    'Emergency Contact': emp.emergencyContact || '',
    'Date of Joining': emp.dateOfJoining || '',
    'Blood Group': emp.bloodGroup || '',
    'Gender': emp.gender || '',
    'Date of Birth': emp.dateOfBirth || '',
    'Status': emp.status || 'Active',
    'Employment Type': emp.employmentType || 'Employee',
    'Manager Name': emp.managerName || '',
    'Address': emp.address || '',
    'City': emp.city || '',
    'State': emp.state || '',
    'Country': emp.country || '',
    'PIN Code': emp.pinCode || '',
    'Verifications': emp.verificationCount || 0,
    'Created At': emp.createdAt || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseEmployeesFromExcel = (file: File): Promise<Partial<Employee>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        const parsedEmployees: Partial<Employee>[] = jsonData.map((row) => ({
          fullName: row['Full Name'] || row['FullName'] || row['Name'] || 'New Employee',
          department: row['Department'] || 'Engineering',
          designation: row['Designation'] || 'Software Engineer',
          companyEmail: row['Company Email'] || row['Email'] || row['CompanyEmail'] || '',
          personalEmail: row['Personal Email'] || '',
          phone: row['Phone'] || row['Phone Number'] || '+1 555-0100',
          emergencyContact: row['Emergency Contact'] || '+1 555-0999',
          dateOfJoining: row['Date of Joining'] || row['Joining Date'] || new Date().toISOString().split('T')[0],
          bloodGroup: (row['Blood Group'] || 'O+') as BloodGroup,
          gender: (row['Gender'] || 'Male') as Gender,
          dateOfBirth: row['Date of Birth'] || '1995-01-01',
          address: row['Address'] || '750 Tech Blvd',
          city: row['City'] || 'San Francisco',
          state: row['State'] || 'California',
          country: row['Country'] || 'USA',
          pinCode: row['PIN Code'] || row['Zip'] || '94107',
          managerName: row['Manager Name'] || row['Manager'] || 'HR Manager',
          employmentType: (row['Employment Type'] || 'Full Time') as EmploymentType,
          status: (row['Status'] || 'Active') as EmployeeStatus,
        }));

        resolve(parsedEmployees);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
