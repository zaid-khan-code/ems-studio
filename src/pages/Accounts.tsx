import React, { useState } from 'react';
import { hrAccounts, getStatusColor } from '../data/dummyData';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { useToastContext } from '../contexts/ToastContext';

export default function Accounts() {
  const [modal, setModal] = useState(false);
  const { showToast } = useToastContext();
  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">HR Accounts</div><div className="pg-sub">Manage system user accounts</div></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={13} /> Add HR Account</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Linked Employee</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {hrAccounts.map((a, i) => (
              <tr key={i}><td className="mono">{a.id}</td><td style={{ fontWeight: 600 }}>{a.username}</td><td><span className="pill pill-blue">{a.role}</span></td><td>{a.linkedEmployee}</td><td><span className={`pill ${getStatusColor(a.status)}`}>{a.status}</span></td><td className="mono">{a.created}</td>
                <td>{a.role !== 'super_admin' && <button className="btn btn-sm btn-danger" onClick={() => showToast('Account deactivated', 'error')}>Deactivate</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add HR Account" footer={
        <><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { showToast('Account created'); setModal(false); }}>Create Account</button></>
      }>
        <div className="form-group"><label className="form-label">Username</label><input className="input" /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="input" type="password" /></div>
        <div className="form-group"><label className="form-label">Confirm Password</label><input className="input" type="password" /></div>
        <div className="form-group"><label className="form-label">Link to Employee (optional)</label><select className="input select-input"><option value="">None</option><option>EMP003 — Usman Malik</option></select></div>
        <div className="form-group"><label className="form-label">Role</label><input className="input" value="hr" disabled /></div>
      </Modal>
    </div>
  );
}
