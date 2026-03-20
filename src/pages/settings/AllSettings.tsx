import React from 'react';
import SettingsPage from './SettingsPage';
import { departments, designations, workModes, workLocations, employmentTypes, jobStatuses, shifts, leaveTypes, leavePolicies, payrollComponents, penaltiesConfig, reportingManagers } from '../../data/dummyData';

export function DepartmentsPage() { return <SettingsPage title="Departments" columns={['Name', 'Active']} data={departments.map(d => ({ name: d, active: true }))} />; }
export function DesignationsPage() { return <SettingsPage title="Designations" columns={['Name', 'Active']} data={designations.map(d => ({ name: d, active: true }))} />; }
export function WorkModesPage() { return <SettingsPage title="Work Modes" columns={['Name', 'Active']} data={workModes.map(d => ({ name: d, active: true }))} />; }
export function WorkLocationsPage() { return <SettingsPage title="Work Locations" columns={['Name', 'Active']} data={workLocations.map(d => ({ name: d, active: true }))} />; }
export function EmploymentTypesPage() { return <SettingsPage title="Employment Types" columns={['Name', 'Active']} data={employmentTypes.map(d => ({ name: d, active: true }))} />; }
export function JobStatusesPage() { return <SettingsPage title="Job Statuses" columns={['Name', 'Active']} data={jobStatuses.map(d => ({ name: d, active: true }))} />; }
export function ReportingManagersPage() { return <SettingsPage title="Reporting Managers" columns={['Name', 'Active']} data={reportingManagers.map(d => ({ name: d, active: true }))} />; }
export function ShiftsPage() { return <SettingsPage title="Shifts" columns={['Name', 'Start', 'End', 'Late After (min)', 'Active']} data={shifts.map(s => ({ name: s.name, start: s.start, end: s.end, late: s.lateAfter, active: true }))} modalFields={[{ label: 'Name' }, { label: 'Start Time', type: 'time' }, { label: 'End Time', type: 'time' }, { label: 'Late After (minutes)', type: 'number' }]} />; }
export function LeaveTypesPage() { return <SettingsPage title="Leave Types" columns={['Name', 'Code', 'Active']} data={leaveTypes} />; }
export function LeavePoliciesPage() { return <SettingsPage title="Leave Policies" columns={['Leave Type', 'Days', 'Year', 'Active']} data={leavePolicies.map(p => ({ type: p.leaveType, days: p.days, year: p.year, active: p.active }))} />; }
export function PayrollComponentsPage() {
  return (
    <div>
      <SettingsPage title="Payroll Components" columns={['Name', 'Type', 'Taxable', 'Order', 'Active']} data={payrollComponents.map(c => ({ name: c.name, type: c.type, taxable: c.taxable, order: c.order, active: c.active }))} />
      <div className="card" style={{ marginTop: 12, background: 'var(--pl)', border: '1px solid var(--p2)' }}>
        <div style={{ fontSize: 12, color: 'var(--p)' }}>ℹ Adding a component here automatically adds it to all future payroll generation forms.</div>
      </div>
    </div>
  );
}
export function PenaltiesConfigPage() { return <SettingsPage title="Penalties Config" columns={['Name', 'Category', 'Default Fine', 'Active']} data={penaltiesConfig.map(p => ({ name: p.name, category: p.category, fine: `PKR ${p.defaultFine.toLocaleString()}`, active: p.active }))} />; }
