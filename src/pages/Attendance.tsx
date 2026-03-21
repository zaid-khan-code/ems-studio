import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { getStatusColor } from '../data/dummyData';
import { Download, Save } from 'lucide-react';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

type AttRow = {
  empId: string; name: string; dept: string; shift: string; expectedIn: string;
  checkIn: string; checkOut: string; status: string; lateBy: string; notes: string; acknowledged: boolean;
};

const STATUSES = ['Present', 'Late', 'Absent', 'Half Day', 'On Leave', 'Holiday'];

function calcLateBy(expectedIn: string, checkIn: string, lateAfter: number): string {
  if (!checkIn || checkIn === '-') return '';
  const [eh, em] = expectedIn.split(':').map(Number);
  const [ch, cm] = checkIn.split(':').map(Number);
  const diff = (ch * 60 + cm) - (eh * 60 + em);
  if (diff > lateAfter) return `${diff} min`;
  return '';
}

function autoStatus(expectedIn: string, checkIn: string, lateAfter: number, currentStatus: string): string {
  if (!checkIn || checkIn === '-') return currentStatus;
  const late = calcLateBy(expectedIn, checkIn, lateAfter);
  if (late && currentStatus !== 'Absent' && currentStatus !== 'On Leave' && currentStatus !== 'Holiday') return 'Late';
  return currentStatus === '' ? 'Present' : currentStatus;
}

export default function Attendance() {
  const { employees, departments, workLocations, shifts } = useData();
  const [tab, setTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2026-03-19');
  const [deptFilter, setDeptFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const { showToast } = useToastContext();

  const initRows = (): AttRow[] => employees.map((e: any) => {
    const s = shifts.find((sh: any) => sh.name === e.shift);
    const existing = e.id === 'EMP001' ? { checkIn: '09:02', checkOut: '18:05', status: 'Present' } :
      e.id === 'EMP002' ? { checkIn: '08:55', checkOut: '18:00', status: 'Present' } :
      e.id === 'EMP003' ? { checkIn: '09:22', checkOut: '18:10', status: 'Late' } :
      e.id === 'EMP004' ? { checkIn: '-', checkOut: '-', status: 'On Leave' } :
      { checkIn: '-', checkOut: '-', status: 'Absent' };
    return {
      empId: e.id, name: e.name, dept: e.department, shift: e.shift,
      expectedIn: s?.start || '09:00', checkIn: existing.checkIn, checkOut: existing.checkOut,
      status: existing.status, lateBy: calcLateBy(s?.start || '09:00', existing.checkIn, s?.lateAfter || 15),
      notes: e.id === 'EMP004' ? 'Annual Leave' : '', acknowledged: e.id !== 'EMP005',
    };
  });

  const [rows, setRows] = useState<AttRow[]>(initRows);

  const filteredRows = rows.filter(r => {
    if (deptFilter && r.dept !== deptFilter) return false;
    const emp = employees.find((e: any) => e.id === r.empId);
    if (locFilter && emp?.workLocation !== locFilter) return false;
    return true;
  });

  const summary = {
    Present: filteredRows.filter(r => r.status === 'Present').length,
    Absent: filteredRows.filter(r => r.status === 'Absent').length,
    Late: filteredRows.filter(r => r.status === 'Late').length,
    'On Leave': filteredRows.filter(r => r.status === 'On Leave').length,
    Holiday: filteredRows.filter(r => r.status === 'Holiday').length,
    Unmarked: filteredRows.filter(r => !r.status).length,
  };

  const updateRow = (idx: number, field: keyof AttRow, value: string | boolean) => {
    setRows(prev => {
      const next = [...prev];
      const realIdx = rows.indexOf(filteredRows[idx]);
      next[realIdx] = { ...next[realIdx], [field]: value };
      if (field === 'checkIn') {
        const s = shifts.find((sh: any) => sh.name === next[realIdx].shift);
        next[realIdx].lateBy = calcLateBy(next[realIdx].expectedIn, value as string, s?.lateAfter || 15);
        next[realIdx].status = autoStatus(next[realIdx].expectedIn, value as string, s?.lateAfter || 15, next[realIdx].status);
      }
      return next;
    });
  };

  const saveAll = () => {
    localStorage.setItem('ems_attendanceSheet_' + selectedDate, JSON.stringify(rows));
    showToast('All changes saved');
  };

  const borderColor = (status: string) => status === 'Present' ? 'var(--green)' : status === 'Late' ? 'var(--amber)' : status === 'Absent' ? 'var(--red)' : status === 'On Leave' ? 'var(--p)' : 'var(--br)';

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Attendance</div><div className="pg-sub">Track and manage employee attendance</div></div>
        <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-ghost"><Download size={13} /> Export Sheet PDF</button></div>
      </div>
      <DecisionBanner>DECISION NEEDED — Attendance Verification Method: Manual / Self-mark / Biometric? Confirm in meeting.</DecisionBanner>
      <div className="tabs" style={{ marginTop: 12 }}>
        <button className={`tab ${tab === 'daily' ? 'active' : ''}`} onClick={() => setTab('daily')}>Daily Sheet</button>
        <button className={`tab ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>Monthly Report</button>
      </div>
      {tab === 'daily' && (
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <input className="input" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: 160 }} />
              <select className="input select-input" style={{ width: 160 }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                <option value="">All Departments</option>{departments.map((d: string) => <option key={d}>{d}</option>)}
              </select>
              <select className="input select-input" style={{ width: 160 }} value={locFilter} onChange={e => setLocFilter(e.target.value)}>
                <option value="">All Locations</option>{workLocations.map((l: string) => <option key={l}>{l}</option>)}
              </select>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={saveAll}><Save size={13} /> Save All Changes</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {Object.entries(summary).map(([k, v]) => <span key={k} className={`pill ${k === 'Present' ? 'pill-green' : k === 'Late' ? 'pill-amber' : k === 'Absent' ? 'pill-red' : k === 'On Leave' ? 'pill-blue' : 'pill-steel'}`}>{k}: {v}</span>)}
          </div>
          {summary.Unmarked > 0 && <div className="decision-banner" style={{ marginBottom: 12, background: 'var(--amberl)', border: '1px solid var(--amber)' }}>⚠ {summary.Unmarked} employee(s) not yet marked</div>}
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Employee</th><th>Shift</th><th>Expected In</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Late By</th><th>Notes</th><th>Ack</th></tr></thead>
                <tbody>
                  {filteredRows.map((r, i) => (
                    <tr key={r.empId} style={{ borderLeft: `3px solid ${borderColor(r.status)}`, background: r.status === 'On Leave' ? 'var(--pl)' : !r.status ? '#fffbeb' : 'transparent' }}>
                      <td className="mono" style={{ color: 'var(--t3)' }}>{i + 1}</td>
                      <td><div style={{ fontWeight: 600, fontSize: 12.5 }}>{r.name}</div><div className="mono" style={{ fontSize: 10, color: 'var(--t3)' }}>{r.empId} · {r.dept}</div></td>
                      <td style={{ fontSize: 11 }}>{r.shift}</td>
                      <td className="mono">{r.expectedIn}</td>
                      <td><input className="input mono" type="time" value={r.checkIn === '-' ? '' : r.checkIn} onChange={e => updateRow(i, 'checkIn', e.target.value)} style={{ padding: '4px 6px', fontSize: 12, width: 80 }} /></td>
                      <td><input className="input mono" type="time" value={r.checkOut === '-' ? '' : r.checkOut} onChange={e => updateRow(i, 'checkOut', e.target.value)} style={{ padding: '4px 6px', fontSize: 12, width: 80 }} /></td>
                      <td><select className="input select-input" value={r.status} onChange={e => updateRow(i, 'status', e.target.value)} style={{ padding: '4px 6px', fontSize: 11, width: 110 }}><option value="">—</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></td>
                      <td className="mono" style={{ fontSize: 11, color: 'var(--amber)' }}>{r.lateBy || '-'}</td>
                      <td><input className="input" value={r.notes} onChange={e => updateRow(i, 'notes', e.target.value)} style={{ padding: '4px 6px', fontSize: 11, width: 100 }} /></td>
                      <td style={{ textAlign: 'center' }}><input type="checkbox" checked={r.acknowledged} onChange={e => updateRow(i, 'acknowledged', e.target.checked)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--t2)' }}>Total: {filteredRows.length} | Present: {summary.Present} | Late: {summary.Late} | Absent: {summary.Absent}</span>
            <button className="btn btn-primary" onClick={saveAll}><Save size={13} /> Save All Changes</button>
          </div>
        </div>
      )}
      {tab === 'monthly' && (
        <div className="card">
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <select className="input select-input" style={{ width: 120 }}><option>March</option><option>February</option></select>
            <input className="input mono" style={{ width: 80 }} value="2026" readOnly />
            <button className="btn btn-ghost"><Download size={13} /> Export Excel</button>
          </div>
          <table>
            <thead><tr><th>Employee</th><th>Present</th><th>Absent</th><th>Late</th><th>Half Day</th><th>On Leave</th><th>Total</th><th>%</th></tr></thead>
            <tbody>
              {employees.map((e: any, i: number) => {
                const pct = [95, 91, 88, 82, 74][i] || 80;
                return <tr key={i}><td style={{ fontWeight: 600 }}>{e.name}</td><td className="mono">18</td><td className="mono">1</td><td className="mono">1</td><td className="mono">0</td><td className="mono">2</td><td className="mono">22</td><td className="mono" style={{ fontWeight: 600, color: pct >= 90 ? 'var(--green)' : pct >= 75 ? 'var(--amber)' : 'var(--red)' }}>{pct}%</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
