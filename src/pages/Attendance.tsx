import React, { useState } from 'react';
import { allAttendanceToday, employees, departments, getStatusColor } from '../data/dummyData';
import { CalendarCheck, Download, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

export default function Attendance() {
  const [tab, setTab] = useState('daily');
  const [markModal, setMarkModal] = useState(false);
  const { showToast } = useToastContext();

  const summary = { Present: 19, Absent: 3, Late: 2, 'On Leave': 2, Unmarked: 1 };

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Attendance</div><div className="pg-sub">Track and manage employee attendance</div></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost"><Download size={13} /> Export</button>
          <button className="btn btn-primary" onClick={() => setMarkModal(true)}><Plus size={13} /> Mark Attendance</button>
        </div>
      </div>

      <DecisionBanner>
        DECISION NEEDED — Attendance Verification Method<br/>
        Option A: HR marks attendance manually every day (current flow shown here)<br/>
        Option B: Employee self-marks, HR approves<br/>
        Option C: Biometric device integration (future)<br/>
        Please confirm preferred method in meeting before this module is built.
      </DecisionBanner>

      <div className="tabs">
        <button className={`tab ${tab === 'daily' ? 'active' : ''}`} onClick={() => setTab('daily')}>Daily View</button>
        <button className={`tab ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>Monthly Report</button>
      </div>

      {tab === 'daily' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {Object.entries(summary).map(([k, v]) => (
              <span key={k} className={`pill ${k === 'Present' ? 'pill-green' : k === 'Late' ? 'pill-amber' : k === 'Absent' ? 'pill-red' : k === 'Unmarked' ? 'pill-steel' : 'pill-blue'}`}>{k}: {v}</span>
            ))}
          </div>
          {summary.Unmarked > 0 && <div className="decision-banner" style={{ marginBottom: 12 }}>⚠ {summary.Unmarked} employee(s) not yet marked today</div>}
          <div className="card">
            <table>
              <thead><tr><th>Emp ID</th><th>Name</th><th>Dept</th><th>Shift</th><th>Expected</th><th>In</th><th>Out</th><th>Status</th><th>Late By</th></tr></thead>
              <tbody>
                {allAttendanceToday.map((a, i) => (
                  <tr key={i}><td className="mono">{a.empId}</td><td style={{ fontWeight: 600 }}>{a.name}</td><td>{a.dept}</td><td style={{ fontSize: 11 }}>{a.shift}</td><td className="mono">{a.expectedIn}</td><td className="mono">{a.checkIn}</td><td className="mono">{a.checkOut}</td><td><span className={`pill ${getStatusColor(a.status)}`}>{a.status}</span></td><td className="mono">{a.lateBy || '-'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'monthly' && (
        <div className="card">
          <table>
            <thead><tr><th>Employee</th><th>Present</th><th>Absent</th><th>Late</th><th>Half Day</th><th>On Leave</th><th>Total</th><th>%</th></tr></thead>
            <tbody>
              {employees.map((e, i) => {
                const pct = [95, 91, 88, 82, 74][i];
                return <tr key={i}><td style={{ fontWeight: 600 }}>{e.name}</td><td className="mono">18</td><td className="mono">1</td><td className="mono">1</td><td className="mono">0</td><td className="mono">2</td><td className="mono">22</td><td className="mono" style={{ fontWeight: 600, color: pct >= 90 ? 'var(--green)' : pct >= 75 ? 'var(--amber)' : 'var(--red)' }}>{pct}%</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={markModal} onClose={() => setMarkModal(false)} title="Mark Attendance" footer={
        <><button className="btn btn-secondary" onClick={() => setMarkModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { showToast('Attendance marked'); setMarkModal(false); }}>Save</button></>
      }>
        <div className="form-group"><label className="form-label">Employee</label><select className="input select-input">{employees.map(e => <option key={e.id}>{e.id} — {e.name}</option>)}</select></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Date</label><input className="input" type="date" defaultValue="2026-03-19" /></div>
          <div className="form-group"><label className="form-label">Status</label><select className="input select-input"><option>Present</option><option>Late</option><option>Absent</option><option>Half Day</option><option>On Leave</option><option>Holiday</option></select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Check In</label><input className="input" type="time" /></div>
          <div className="form-group"><label className="form-label">Check Out</label><input className="input" type="time" /></div>
        </div>
        <div className="form-group"><label className="form-label">Notes</label><textarea className="input" rows={2} /></div>
      </Modal>
    </div>
  );
}
