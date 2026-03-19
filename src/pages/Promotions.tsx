import React, { useState } from 'react';
import { promotions, formatRs, getStatusColor } from '../data/dummyData';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

export default function Promotions() {
  const [modal, setModal] = useState(false);
  const { showToast } = useToastContext();
  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Promotions</div><div className="pg-sub">Track employee promotions and career growth</div></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={13} /> Record Promotion</button>
      </div>
      <DecisionBanner>
        DECISION NEEDED — Promotion Trigger Method<br/>
        Option A: Manual — HR records every promotion manually (shown here)<br/>
        Option B: Automatic — System flags employee after full-attendance month<br/>
        Option C: Both — System suggests, HR confirms before recording<br/>
        Please confirm preferred method in meeting.
      </DecisionBanner>
      <div className="card">
        <table>
          <thead><tr><th>Employee</th><th>Old Designation</th><th>New Designation</th><th>Before</th><th>After</th><th>Date</th><th>Approved By</th></tr></thead>
          <tbody>
            {promotions.map((p, i) => (
              <tr key={i}><td style={{ fontWeight: 600 }}>{p.empName}</td><td>{p.oldDesignation}</td><td>{p.newDesignation}</td><td className="mono">{formatRs(p.oldSalary)}</td><td className="mono" style={{ color: 'var(--green)' }}>{formatRs(p.newSalary)}</td><td className="mono">{p.date}</td><td>{p.approvedBy}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Record Promotion" footer={
        <><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { showToast('Promotion recorded'); setModal(false); }}>Save</button></>
      }>
        <div className="form-group"><label className="form-label">Employee</label><select className="input select-input"><option>EMP001 — Ahmed Ali</option></select></div>
        <div className="form-group"><label className="form-label">Promotion Date</label><input className="input" type="date" /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Old Designation</label><input className="input" value="Lead Developer" disabled /></div><div className="form-group"><label className="form-label">New Designation</label><input className="input" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Old Salary</label><input className="input mono" value="Rs 1,50,000" disabled /></div><div className="form-group"><label className="form-label">New Salary</label><input className="input mono" placeholder="Rs" /></div></div>
        <div className="form-group"><label className="form-label">Notes</label><textarea className="input" rows={2} /></div>
      </Modal>
    </div>
  );
}
