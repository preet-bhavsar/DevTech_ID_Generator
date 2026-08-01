# DevTech IT Solutions - Smart Employee ID Card Management System

A modern, production-ready, MNC-grade **Employee ID Card Management System** built with **React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, QR Generator & Camera Scanner, PDF Exporter, Excel Bulk Import/Export, and Firebase Integration**.

---

## 🌟 Key Features

1. **HR Admin Master Dashboard**:
   - Total Employees, Active Ratio, Pending ID Badges, Scans Metric Cards.
   - Live Audit Logs & Realtime System Activity Timeline.
   - Quick HR Actions (Add Employee, Scan QR Code, Batch Print Badges).

2. **Automated Employee ID Generator (`DTS-2026-XXXX`)**:
   - Sequence format: `DTS-2026-0001`, `DTS-2026-0002`, `DTS-2026-0003`, etc.
   - Auto-checks existing sequence numbers to prevent duplicate IDs.

3. **MNC Printable Credit-Card Sized ID Badges**:
   - Standard CR80 Dimensions (85.6mm x 54mm portrait aspect ratio).
   - **Front Side**: Corporate Header, Photo, Name, ID, Department, Designation, Blood Group, DO Joining, QR Code, Validity.
   - **Back Side**: Emergency Contact, Office Address, Terms, Barcode simulation, Authorized Signature line.
   - **Interactive 3D Badge Flip**: Flip card animation on hover/click.
   - **4 Corporate Style Themes**: Corporate Navy, Modern Dark, Glassmorphic, Executive Gold.

4. **Secure QR Code Generator & Camera Scanner**:
   - QR encodes `https://<domain>/verify/DTS-2026-XXXX` (Never exposes raw PII).
   - Built-in Camera QR Reader (`html5-qrcode`), Image File Reader, and Manual ID entry.

5. **Public Employee Verification Portal (`/verify/:employeeId`)**:
   - Public view, no login required.
   - **Large Green Badge**: `✅ VERIFIED EMPLOYEE` (Active).
   - **Large Red Badge**: `❌ INVALID / INACTIVE EMPLOYEE` or `❌ EMPLOYEE NOT FOUND`.
   - Displays Photo, Name, ID, Department, Designation, Status, Blood Group, Verification Timestamp, Device Type, and Browser.
   - Celebratory confetti animation on valid scan!

6. **Bulk Excel & CSV Import / Export**:
   - Export full employee directory to Excel (`.xlsx`) or `.csv`.
   - Bulk import employee list from Excel with automatic sequence ID assignment.

7. **Firebase & Hybrid Local Demo Engine**:
   - Pre-loaded with out-of-the-box local demo data for immediate testing.
   - Connects seamlessly to Firebase Auth, Firestore, and Firebase Storage via `.env` variables.
   - Includes `firestore.rules` and `firestore.indexes.json`.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Login Credentials

The application is pre-configured with **Instant Demo Admin Access**:
- **Admin Email**: `admin@devtechitsolution.com`
- **Password**: `admin123`
- Or simply click **"Instant Demo Admin Access"** on the login page!

---

## ⚡ Environment Configuration (Firebase Optional)

Copy `.env.example` to `.env` or `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=devtech-employee-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=devtech-employee-id
VITE_FIREBASE_STORAGE_BUCKET=devtech-employee-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

---

## 📁 Project Architecture

```
├── firestore.rules          # Firebase Firestore security rules
├── firestore.indexes.json    # Firestore query indexes
├── src/
│   ├── types/               # Employee, VerificationLog, AuditLog, Settings types
│   ├── data/                # Pre-seeded DevTech IT Solutions dataset
│   ├── services/            # Firebase SDK, Employee CRUD, QR, PDF, Excel services
│   ├── context/             # AuthContext, ThemeContext, EmployeeContext
│   ├── components/
│   │   ├── common/          # ToastContainer, PhotoCropperModal
│   │   ├── layout/          # Sidebar, Navbar
│   │   ├── dashboard/       # StatCards, RecentActivity
│   │   ├── employees/       # EmployeeTable, EmployeeFormModal
│   │   ├── cards/           # EmployeeCardFront, EmployeeCardBack, InteractiveBadgePreview
│   │   └── scanner/         # QRScannerModal (Camera + Upload)
│   └── pages/               # Login, Dashboard, Employees, Profile, Verify, Analytics, Settings, Print
```

---

## 📄 License
© 2026 DevTech IT Solutions. All Rights Reserved.
