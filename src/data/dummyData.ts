export interface Employee {
  id: string;
  name: string;
  fatherName: string;
  dob: string;
  cnic: string;
  gender: string;
  department: string;
  designation: string;
  employmentType: string;
  jobStatus: string;
  workMode: string;
  workLocation: string;
  shift: string;
  reportingManager: string;
  dateOfJoining: string;
  dateOfExit?: string;
  contact1: string;
  contact2?: string;
  emergency1: string;
  emergency2?: string;
  permanentAddress: string;
  postalAddress: string;
  bankName: string;
  bankAccount: string;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  medications: string;
  avatar: string;
}

export const employees: Employee[] = [
  { id: 'EMP001', name: 'Ahmed Ali', fatherName: 'Ali Khan', dob: '1990-03-15', cnic: '35201-1234567-1', gender: 'Male', department: 'Engineering', designation: 'Senior Developer', employmentType: 'Full Time', jobStatus: 'Active', workMode: 'Hybrid', workLocation: 'Lahore HQ', shift: 'Morning Shift', reportingManager: 'N/A', dateOfJoining: '2020-01-15', contact1: '0301-1234567', contact2: '0321-7654321', emergency1: '0300-9876543', permanentAddress: 'House 45, Street 12, Gulberg III, Lahore', postalAddress: 'Same as permanent', bankName: 'HBL', bankAccount: '1234-5678-9012', bloodGroup: 'B+', allergies: 'None', chronicConditions: 'None', medications: 'None', avatar: 'AA' },
  { id: 'EMP002', name: 'Sara Khan', fatherName: 'Imran Khan', dob: '1992-03-28', cnic: '35202-2345678-2', gender: 'Female', department: 'Marketing', designation: 'Marketing Manager', employmentType: 'Full Time', jobStatus: 'Active', workMode: 'On-Site', workLocation: 'Lahore HQ', shift: 'Morning Shift', reportingManager: 'Ahmed Ali', dateOfJoining: '2019-06-01', contact1: '0302-2345678', emergency1: '0300-8765432', permanentAddress: 'Apartment 8, Block C, DHA Phase 5, Lahore', postalAddress: 'Same as permanent', bankName: 'UBL', bankAccount: '2345-6789-0123', bloodGroup: 'A+', allergies: 'Peanuts', chronicConditions: 'None', medications: 'None', avatar: 'SK' },
  { id: 'EMP003', name: 'Usman Malik', fatherName: 'Tariq Malik', dob: '1988-04-03', cnic: '35203-3456789-3', gender: 'Male', department: 'HR', designation: 'HR Executive', employmentType: 'Contract', jobStatus: 'Active', workMode: 'On-Site', workLocation: 'Lahore HQ', shift: 'Morning Shift', reportingManager: 'Sara Khan', dateOfJoining: '2021-03-10', contact1: '0303-3456789', emergency1: '0300-7654321', permanentAddress: 'House 12, Johar Town, Lahore', postalAddress: 'Same as permanent', bankName: 'MCB', bankAccount: '3456-7890-1234', bloodGroup: 'O+', allergies: 'None', chronicConditions: 'Asthma', medications: 'Inhaler', avatar: 'UM' },
  { id: 'EMP004', name: 'Fatima Raza', fatherName: 'Hassan Raza', dob: '1995-04-19', cnic: '35204-4567890-4', gender: 'Female', department: 'Sales', designation: 'Sales Officer', employmentType: 'Full Time', jobStatus: 'Probation', workMode: 'On-Site', workLocation: 'Karachi Office', shift: 'Morning Shift', reportingManager: 'Usman Malik', dateOfJoining: '2023-09-01', contact1: '0304-4567890', emergency1: '0300-6543210', permanentAddress: 'Flat 3B, Clifton, Karachi', postalAddress: 'Same as permanent', bankName: '', bankAccount: '', bloodGroup: 'AB-', allergies: 'Dust', chronicConditions: 'None', medications: 'None', avatar: 'FR' },
  { id: 'EMP005', name: 'Bilal Ahmed', fatherName: 'Kashif Ahmed', dob: '1993-05-07', cnic: '35205-5678901-5', gender: 'Male', department: 'Finance', designation: 'Accountant', employmentType: 'Full Time', jobStatus: 'Active', workMode: 'Remote', workLocation: 'Remote', shift: 'Night Shift', reportingManager: 'Sara Khan', dateOfJoining: '2022-01-20', contact1: '0305-5678901', emergency1: '0300-5432109', permanentAddress: 'House 67, Model Town, Lahore', postalAddress: 'Same as permanent', bankName: '', bankAccount: '', bloodGroup: 'A-', allergies: 'None', chronicConditions: 'None', medications: 'None', avatar: 'BA' },
];

export const departments = ['Engineering', 'Marketing', 'HR', 'Sales', 'Finance'];
export const designations = ['Senior Developer', 'Marketing Manager', 'HR Executive', 'Sales Officer', 'Accountant', 'Junior Developer', 'Lead Developer', 'Manager'];
export const workModes = ['On-Site', 'Remote', 'Hybrid'];
export const workLocations = ['Lahore HQ', 'Karachi Office', 'Islamabad Office', 'Remote'];
export const employmentTypes = ['Full Time', 'Part Time', 'Contract', 'Intern'];
export const jobStatuses = ['Active', 'Probation', 'Notice Period', 'Terminated'];
export const shifts = [
  { name: 'Morning Shift', start: '09:00', end: '18:00', lateAfter: 15 },
  { name: 'Evening Shift', start: '14:00', end: '23:00', lateAfter: 15 },
  { name: 'Night Shift', start: '22:00', end: '06:00', lateAfter: 15 },
];

export const attendanceData = [
  { date: '2026-03-19', day: 'Wed', empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '09:02', checkOut: '18:05', status: 'Present', lateBy: '', notes: '' },
  { date: '2026-03-18', day: 'Tue', empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '09:18', checkOut: '18:10', status: 'Late', lateBy: '18 min', notes: 'Traffic' },
  { date: '2026-03-17', day: 'Mon', empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '08:58', checkOut: '18:00', status: 'Present', lateBy: '', notes: '' },
  { date: '2026-03-14', day: 'Fri', empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '09:05', checkOut: '17:58', status: 'Present', lateBy: '', notes: '' },
  { date: '2026-03-13', day: 'Thu', empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '-', checkOut: '-', status: 'Absent', lateBy: '', notes: '' },
  { date: '2026-03-12', day: 'Wed', empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '09:00', checkOut: '18:02', status: 'Present', lateBy: '', notes: '' },
  { date: '2026-03-11', day: 'Tue', empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '09:03', checkOut: '18:00', status: 'Present', lateBy: '', notes: '' },
];

export const allAttendanceToday = [
  { empId: 'EMP001', name: 'Ahmed Ali', dept: 'Engineering', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '09:02', checkOut: '18:05', status: 'Present', lateBy: '', notes: '' },
  { empId: 'EMP002', name: 'Sara Khan', dept: 'Marketing', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '08:55', checkOut: '18:00', status: 'Present', lateBy: '', notes: '' },
  { empId: 'EMP003', name: 'Usman Malik', dept: 'HR', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '09:22', checkOut: '18:10', status: 'Late', lateBy: '22 min', notes: '' },
  { empId: 'EMP004', name: 'Fatima Raza', dept: 'Sales', shift: 'Morning Shift', expectedIn: '09:00', checkIn: '-', checkOut: '-', status: 'On Leave', lateBy: '', notes: 'Annual Leave' },
  { empId: 'EMP005', name: 'Bilal Ahmed', dept: 'Finance', shift: 'Night Shift', expectedIn: '22:00', checkIn: '-', checkOut: '-', status: 'Absent', lateBy: '', notes: '' },
];

export const leaveRequests = [
  { id: 'LR001', empId: 'EMP001', empName: 'Ahmed Ali', leaveType: 'Annual', from: '2026-03-01', to: '2026-03-05', days: 5, reason: 'Family vacation', appliedOn: '2026-02-25', status: 'Approved' },
  { id: 'LR002', empId: 'EMP002', empName: 'Sara Khan', leaveType: 'Casual', from: '2026-03-10', to: '2026-03-11', days: 2, reason: 'Personal work', appliedOn: '2026-03-08', status: 'Approved' },
  { id: 'LR003', empId: 'EMP003', empName: 'Usman Malik', leaveType: 'Sick', from: '2026-03-17', to: '2026-03-17', days: 1, reason: 'Fever and cold', appliedOn: '2026-03-17', status: 'Pending' },
  { id: 'LR004', empId: 'EMP004', empName: 'Fatima Raza', leaveType: 'Casual', from: '2026-03-20', to: '2026-03-21', days: 2, reason: 'Family event', appliedOn: '2026-03-18', status: 'Pending' },
  { id: 'LR005', empId: 'EMP005', empName: 'Bilal Ahmed', leaveType: 'Annual', from: '2026-03-25', to: '2026-03-29', days: 5, reason: 'Travel plans', appliedOn: '2026-03-15', status: 'Pending' },
  { id: 'LR006', empId: 'EMP001', empName: 'Ahmed Ali', leaveType: 'Casual', from: '2026-02-15', to: '2026-02-15', days: 1, reason: 'Bank work', appliedOn: '2026-02-14', status: 'Approved' },
  { id: 'LR007', empId: 'EMP002', empName: 'Sara Khan', leaveType: 'Annual', from: '2026-02-01', to: '2026-02-03', days: 3, reason: 'Trip', appliedOn: '2026-01-28', status: 'Approved' },
  { id: 'LR008', empId: 'EMP003', empName: 'Usman Malik', leaveType: 'Annual', from: '2026-01-20', to: '2026-01-22', days: 3, reason: 'Wedding', appliedOn: '2026-01-15', status: 'Rejected' },
];

export const payrollData = [
  { empId: 'EMP001', name: 'Ahmed Ali', basic: 150000, houseAllowance: 30000, transport: 10000, otherEarning: 5000, tax: 12000, loan: 0, latePenalty: 0, otherDeduction: 5000, status: 'Draft' },
  { empId: 'EMP002', name: 'Sara Khan', basic: 120000, houseAllowance: 24000, transport: 8000, otherEarning: 3000, tax: 9000, loan: 5000, latePenalty: 0, otherDeduction: 2000, status: 'Draft' },
  { empId: 'EMP003', name: 'Usman Malik', basic: 80000, houseAllowance: 16000, transport: 6000, otherEarning: 2000, tax: 5000, loan: 0, latePenalty: 2000, otherDeduction: 1000, status: 'Finalized' },
  { empId: 'EMP004', name: 'Fatima Raza', basic: 60000, houseAllowance: 12000, transport: 5000, otherEarning: 0, tax: 3000, loan: 0, latePenalty: 0, otherDeduction: 0, status: 'Draft' },
  { empId: 'EMP005', name: 'Bilal Ahmed', basic: 90000, houseAllowance: 18000, transport: 7000, otherEarning: 3000, tax: 6000, loan: 10000, latePenalty: 0, otherDeduction: 2000, status: 'Draft' },
];

export const promotions = [
  { id: 'PR001', empId: 'EMP001', empName: 'Ahmed Ali', oldDesignation: 'Junior Developer', newDesignation: 'Senior Developer', oldSalary: 80000, newSalary: 120000, date: '2022-01-01', approvedBy: 'Super Admin' },
  { id: 'PR002', empId: 'EMP001', empName: 'Ahmed Ali', oldDesignation: 'Senior Developer', newDesignation: 'Lead Developer', oldSalary: 120000, newSalary: 150000, date: '2024-01-01', approvedBy: 'Super Admin' },
  { id: 'PR003', empId: 'EMP002', empName: 'Sara Khan', oldDesignation: 'Marketing Executive', newDesignation: 'Marketing Manager', oldSalary: 70000, newSalary: 120000, date: '2023-06-01', approvedBy: 'Super Admin' },
];

export const penalties = [
  { id: 'PN001', empId: 'EMP003', empName: 'Usman Malik', type: 'Late 3+ days', amount: 2000, date: '2026-02-28', appliedBy: 'HR1', status: 'Active' },
];

export const payrollMonthly = [
  { month: 'Oct', amount: 485000 },
  { month: 'Nov', amount: 492000 },
  { month: 'Dec', amount: 510000 },
  { month: 'Jan', amount: 498000 },
  { month: 'Feb', amount: 505000 },
  { month: 'Mar', amount: 520000 },
];

export const deptAttendance = [
  { dept: 'Engineering', rate: 95 },
  { dept: 'HR', rate: 91 },
  { dept: 'Finance', rate: 88 },
  { dept: 'Marketing', rate: 82 },
  { dept: 'Sales', rate: 74 },
];

export const auditLog = [
  { id: 'AL001', timestamp: '2026-03-19 09:15:22', user: 'Super Admin', role: 'super_admin', action: 'LOGIN', module: 'Auth', recordId: '-', summary: 'Super Admin logged in' },
  { id: 'AL002', timestamp: '2026-03-19 09:20:10', user: 'Super Admin', role: 'super_admin', action: 'UPDATE', module: 'Employee', recordId: 'EMP001', summary: 'Updated salary for Ahmed Ali', before: { salary: '120,000' }, after: { salary: '150,000' } },
  { id: 'AL003', timestamp: '2026-03-18 14:30:45', user: 'HR1', role: 'hr', action: 'CREATE', module: 'Employee', recordId: 'EMP005', summary: 'Added Bilal Ahmed as new employee' },
  { id: 'AL004', timestamp: '2026-03-17 11:05:33', user: 'Super Admin', role: 'super_admin', action: 'UPDATE', module: 'Leave', recordId: 'LR001', summary: 'Approved leave for Ahmed Ali' },
  { id: 'AL005', timestamp: '2026-03-16 16:22:18', user: 'HR1', role: 'hr', action: 'UPDATE', module: 'Leave', recordId: 'LR008', summary: 'Rejected leave for Usman Malik' },
  { id: 'AL006', timestamp: '2026-03-15 10:00:00', user: 'Super Admin', role: 'super_admin', action: 'CREATE', module: 'Payroll', recordId: 'PY-FEB-2026', summary: 'Generated February 2026 payroll' },
  { id: 'AL007', timestamp: '2026-03-14 09:00:00', user: 'HR1', role: 'hr', action: 'LOGIN', module: 'Auth', recordId: '-', summary: 'HR1 logged in' },
  { id: 'AL008', timestamp: '2026-03-13 17:45:00', user: 'Super Admin', role: 'super_admin', action: 'DELETE', module: 'Employee', recordId: 'EMP006', summary: 'Deleted inactive employee record' },
];

export const leaveTypes = [
  { name: 'Annual Leave', code: 'AL', active: true },
  { name: 'Casual Leave', code: 'CL', active: true },
  { name: 'Medical Leave', code: 'ML', active: true },
  { name: 'Sick Leave', code: 'SL', active: true },
  { name: 'Maternity Leave', code: 'MAT', active: true },
];

export const leavePolicies = [
  { leaveType: 'Annual Leave', days: 12, year: 2026, active: true },
  { leaveType: 'Casual Leave', days: 12, year: 2026, active: true },
  { leaveType: 'Medical Leave', days: 8, year: 2026, active: true },
];

export const payrollComponents = [
  { name: 'Basic Salary', type: 'Earning', taxable: true, order: 1, active: true },
  { name: 'House Allowance', type: 'Earning', taxable: false, order: 2, active: true },
  { name: 'Transport Allowance', type: 'Earning', taxable: false, order: 3, active: true },
  { name: 'Other Allowance', type: 'Earning', taxable: false, order: 4, active: true },
  { name: 'Tax Deduction', type: 'Deduction', taxable: false, order: 5, active: true },
  { name: 'Loan Deduction', type: 'Deduction', taxable: false, order: 6, active: true },
  { name: 'Late Penalty', type: 'Deduction', taxable: false, order: 7, active: true },
  { name: 'Other Deductions', type: 'Deduction', taxable: false, order: 8, active: true },
];

export const penaltiesConfig = [
  { name: 'Late 3+ days in month', category: 'Attendance', defaultFine: 2000, active: true },
  { name: 'Eating at desk', category: 'Behaviour', defaultFine: 500, active: true },
  { name: 'Smoking in office', category: 'Behaviour', defaultFine: 1000, active: true },
  { name: 'Drinking at desk', category: 'Behaviour', defaultFine: 500, active: true },
];

export const hrAccounts = [
  { id: 'ACC001', username: 'superadmin', role: 'super_admin', linkedEmployee: '-', status: 'Active', created: '2020-01-01' },
  { id: 'ACC002', username: 'hr1', role: 'hr', linkedEmployee: 'EMP003 - Usman Malik', status: 'Active', created: '2021-03-10' },
];

export const customFields = {
  employee: [
    { label: 'NTN Number', type: 'Text', required: false, section: 'Employee Info', active: true },
  ],
  job: [
    { label: 'Project Assignment', type: 'Text', required: false, section: 'Job Info', active: true },
  ],
  medical: [],
  extra: [],
};

export function formatRs(amount: number): string {
  return 'Rs ' + amount.toLocaleString('en-PK');
}

export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (['present', 'active', 'approved', 'finalized'].includes(s)) return 'pill-green';
  if (['late', 'pending', 'probation', 'draft', 'notice period'].includes(s)) return 'pill-amber';
  if (['absent', 'rejected', 'terminated', 'inactive', 'fired'].includes(s)) return 'pill-red';
  if (['on leave', 'info'].includes(s)) return 'pill-blue';
  return 'pill-steel';
}
