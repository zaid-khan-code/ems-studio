import React, { useState } from 'react';
import { leaveRequests, getStatusColor } from '../data/dummyData';
import { Plus, Check, X, Pencil, RotateCcw } from 'lucide-react';
import Modal from '../components/Modal';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

export default function Leave() {
  const [tab, setTab] = useState('all');
  const [earlyModal, setEarlyModal] = useState(false);
  const { showToast } = useToastContext();

  const counts = { total: leaveRequests.length, pending: leaveRequests.filter(l => l.status === 'Pending').length, approved: leaveRequests.filter(l => l.status === 'Approved').length, rejected: leaveRequests.filter(l => l.status === 'Rejected').length };
  const filtered = tab === 'all' ? leaveRequests : leaveRequests.filter(l => l.status.toLowerCase() === tab);

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Leave Management</div><div className="pg-sub">Manage leave requests and approvals</div></div>
        <button className="btn btn-primary"><Plus size={13} /> New Leave Request</button>
      </div>

      <div className="kpi-strip" style={{ marginBottom: 12 }}>
        {[{ l: 'Total', v: counts.total, c: 'k1' }, { l: 'Pending', v: counts.pending, c: 'k3' }, { l: 'Approved', v: counts.approved, c: 'k2' }, { l: 'Rejected', v: counts.rejected, c: 'k4' }].map((k, i) => (
          <div key={i} className={`kpi-item ${k.c}`}><div><div className="kpi-val">{k.v}</div><div className="kpi-lbl">{k.l}</div></div></div>
        ))}
      </div>

      <div className="tabs">
        {['all', 'pending', 'approved', 'rejected'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{l.empName}</td><td>{l.leaveType}</td><td className="mono">{l.from}</td><td className="mono">{l.to}</td><td className="mono">{l.days}</td><td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason}</td><td className="mono">{l.appliedOn}</td>
                <td><span className={`pill ${getStatusColor(l.status)}`}>{l.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {l.status === 'Pending' && <>
                      <button className="btn btn-sm" style={{ background: 'var(--greenl)', color: 'var(--green)', border: 'none' }} onClick={() => showToast('Leave approved')}><Check size={12} /></button>
                      <button className="btn btn-sm" style={{ background: 'var(--redl)', color: 'var(--red)', border: 'none' }} onClick={() => showToast('Leave rejected', 'error')}><X size={12} /></button>
                    </>}
                    {l.status === 'Approved' && <button className="btn btn-sm btn-ghost" onClick={() => setEarlyModal(true)}><RotateCcw size={12} /> Return</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={earlyModal} onClose={() => setEarlyModal(false)} title="Mark Early Return" footer={
        <><button className="btn btn-secondary" onClick={() => setEarlyModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { showToast('Early return recorded'); setEarlyModal(false); }}>Confirm Early Return</button></>
      }>
        <div style={{ background: 'var(--inp)', padding: 12, borderRadius: 'var(--rsm)', marginBottom: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 600 }}>Ahmed Ali — Annual Leave</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--t3)' }}>Original: 1 Mar 2026 to 10 Mar 2026 (10 days)</div>
        </div>
        <div className="form-group"><label className="form-label">Employee returned on:</label><input className="input" type="date" /></div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12.5 }}>
          <div>Days Actually Taken: <strong className="mono">7</strong></div>
          <div>Days to Restore: <strong className="mono" style={{ color: 'var(--green)' }}>3</strong></div>
        </div>
      </Modal>
    </div>
  );
}
