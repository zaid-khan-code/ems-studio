import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getStatusColor } from '../data/dummyData';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToastContext } from '../contexts/ToastContext';

export default function Employees() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const { employees, deleteEmployee, departments, jobStatuses, workModes } = useData();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = employees.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter && e.department !== deptFilter) return false;
    if (statusFilter && e.jobStatus !== statusFilter) return false;
    if (modeFilter && e.workMode !== modeFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Employees</div><div className="pg-sub">Manage all employees in your organization</div></div>
        <button className="btn btn-primary" onClick={() => navigate('/employees/add')}><Plus size={13} /> Add Employee</button>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }} />
            <input className="input" style={{ paddingLeft: 32 }} placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input select-input" style={{ width: 160 }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="input select-input" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {jobStatuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="input select-input" style={{ width: 140 }} value={modeFilter} onChange={e => setModeFilter(e.target.value)}>
            <option value="">All Work Modes</option>
            {workModes.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Emp ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Type</th><th>Status</th><th>Shift</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td className="mono">{e.id}</td>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{e.department}</td>
                  <td>{e.designation}</td>
                  <td>{e.employmentType}</td>
                  <td><span className={`pill ${getStatusColor(e.jobStatus)}`}>{e.jobStatus}</span></td>
                  <td style={{ fontSize: 11.5 }}>{e.shift}</td>
                  <td className="mono">{e.dateOfJoining}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="ico-btn" style={{ width: 28, height: 28 }} onClick={() => navigate(`/employees/${e.id}`)}><Eye size={13} /></button>
                      <button className="ico-btn" style={{ width: 28, height: 28 }} onClick={() => navigate('/employees/add')}><Pencil size={13} /></button>
                      <button className="ico-btn" style={{ width: 28, height: 28 }} onClick={() => setDeleteTarget(e.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget}? This action cannot be undone.`}
        onConfirm={() => { deleteEmployee(deleteTarget!); showToast(`Employee ${deleteTarget} deleted`); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
