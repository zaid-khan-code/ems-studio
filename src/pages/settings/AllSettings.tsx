import React from 'react';
import SettingsPage from './SettingsPage';
import { useData } from '../../contexts/DataContext';

export function DepartmentsPage() {
  const { departments, setDepartments } = useData();
  return <SettingsPage title="Departments" columns={['Name', 'Active']} data={departments.map(d => ({ name: d, active: true }))}
    onAdd={(row) => setDepartments(prev => [...prev, row.Name || row.name])}
    onDelete={(idx) => setDepartments(prev => prev.filter((_, i) => i !== idx))} />;
}
export function DesignationsPage() {
  const { designations, setDesignations } = useData();
  return <SettingsPage title="Designations" columns={['Name', 'Active']} data={designations.map(d => ({ name: d, active: true }))}
    onAdd={(row) => setDesignations(prev => [...prev, row.Name || row.name])}
    onDelete={(idx) => setDesignations(prev => prev.filter((_, i) => i !== idx))} />;
}
export function WorkModesPage() {
  const { workModes, setWorkModes } = useData();
  return <SettingsPage title="Work Modes" columns={['Name', 'Active']} data={workModes.map(d => ({ name: d, active: true }))}
    onAdd={(row) => setWorkModes(prev => [...prev, row.Name || row.name])}
    onDelete={(idx) => setWorkModes(prev => prev.filter((_, i) => i !== idx))} />;
}
export function WorkLocationsPage() {
  const { workLocations, setWorkLocations } = useData();
  return <SettingsPage title="Work Locations" columns={['Name', 'Active']} data={workLocations.map(d => ({ name: d, active: true }))}
    onAdd={(row) => setWorkLocations(prev => [...prev, row.Name || row.name])}
    onDelete={(idx) => setWorkLocations(prev => prev.filter((_, i) => i !== idx))} />;
}
export function EmploymentTypesPage() {
  const { employmentTypes, setEmploymentTypes } = useData();
  return <SettingsPage title="Employment Types" columns={['Name', 'Active']} data={employmentTypes.map(d => ({ name: d, active: true }))}
    onAdd={(row) => setEmploymentTypes(prev => [...prev, row.Name || row.name])}
    onDelete={(idx) => setEmploymentTypes(prev => prev.filter((_, i) => i !== idx))} />;
}
export function JobStatusesPage() {
  const { jobStatuses, setJobStatuses } = useData();
  return <SettingsPage title="Job Statuses" columns={['Name', 'Active']} data={jobStatuses.map(d => ({ name: d, active: true }))}
    onAdd={(row) => setJobStatuses(prev => [...prev, row.Name || row.name])}
    onDelete={(idx) => setJobStatuses(prev => prev.filter((_, i) => i !== idx))} />;
}
export function ReportingManagersPage() {
  const { reportingManagers, setReportingManagers } = useData();
  return <SettingsPage title="Reporting Managers" columns={['Name', 'Active']} data={reportingManagers.map(d => ({ name: d, active: true }))}
    onAdd={(row) => setReportingManagers(prev => [...prev, row.Name || row.name])}
    onDelete={(idx) => setReportingManagers(prev => prev.filter((_, i) => i !== idx))} />;
}
export function ShiftsPage() {
  const { shifts, setShifts } = useData();
  return <SettingsPage title="Shifts" columns={['Name', 'Start', 'End', 'Late After (min)', 'Active']}
    data={shifts.map(s => ({ name: s.name, start: s.start, end: s.end, late: s.lateAfter, active: true }))}
    modalFields={[{ label: 'Name' }, { label: 'Start Time', type: 'time' }, { label: 'End Time', type: 'time' }, { label: 'Late After (minutes)', type: 'number' }]}
    onAdd={(row) => setShifts(prev => [...prev, { name: row.Name || '', start: row['Start Time'] || '09:00', end: row['End Time'] || '18:00', lateAfter: parseInt(row['Late After (minutes)']) || 15 }])}
    onDelete={(idx) => setShifts(prev => prev.filter((_, i) => i !== idx))} />;
}
export function LeaveTypesPage() {
  const { leaveTypes, setLeaveTypes } = useData();
  return <SettingsPage title="Leave Types" columns={['Name', 'Code', 'Active']} data={leaveTypes}
    onAdd={(row) => setLeaveTypes(prev => [...prev, { name: row.Name || '', code: (row.Name || '').substring(0, 2).toUpperCase(), active: true }])}
    onDelete={(idx) => setLeaveTypes(prev => prev.filter((_, i) => i !== idx))} />;
}
export function LeavePoliciesPage() {
  const { leavePolicies, setLeavePolicies } = useData();
  return <SettingsPage title="Leave Policies" columns={['Leave Type', 'Days', 'Year', 'Active']}
    data={leavePolicies.map(p => ({ type: p.leaveType, days: p.days, year: p.year, active: p.active }))}
    onAdd={(row) => setLeavePolicies(prev => [...prev, { leaveType: row['Leave Type'] || '', days: parseInt(row.Days) || 0, year: parseInt(row.Year) || 2026, active: true }])}
    onDelete={(idx) => setLeavePolicies(prev => prev.filter((_, i) => i !== idx))} />;
}
export function PayrollComponentsPage() {
  const { payrollComponents, setPayrollComponents } = useData();
  return (
    <div>
      <SettingsPage title="Payroll Components" columns={['Name', 'Type', 'Taxable', 'Order', 'Active']}
        data={payrollComponents.map(c => ({ name: c.name, type: c.type, taxable: c.taxable, order: c.order, active: c.active }))}
        onAdd={(row) => setPayrollComponents(prev => [...prev, { name: row.Name || '', type: 'Earning', taxable: false, order: prev.length + 1, active: true }])}
        onDelete={(idx) => setPayrollComponents(prev => prev.filter((_, i) => i !== idx))} />
      <div className="card" style={{ marginTop: 12, background: 'var(--pl)', border: '1px solid var(--p2)' }}>
        <div style={{ fontSize: 12, color: 'var(--p)' }}>ℹ Adding a component here automatically adds it to all future payroll generation forms.</div>
      </div>
    </div>
  );
}
export function PenaltiesConfigPage() {
  const { penaltiesConfig, setPenaltiesConfig } = useData();
  return <SettingsPage title="Penalties Config" columns={['Name', 'Category', 'Default Fine', 'Active']}
    data={penaltiesConfig.map(p => ({ name: p.name, category: p.category, fine: `PKR ${p.defaultFine.toLocaleString()}`, active: p.active }))}
    onAdd={(row) => setPenaltiesConfig(prev => [...prev, { name: row.Name || '', category: 'Behaviour', defaultFine: parseInt(row['Default Fine']) || 0, active: true }])}
    onDelete={(idx) => setPenaltiesConfig(prev => prev.filter((_, i) => i !== idx))} />;
}
