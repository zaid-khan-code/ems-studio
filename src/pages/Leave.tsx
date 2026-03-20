import React, { useState, useMemo } from 'react';
import { leaveRequests as initialLeaveRequests, employees, leaveTypes, getStatusColor } from '../data/dummyData';
import { Plus, Check, X, Pencil, RotateCcw, CalendarDays } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

interface LeaveRow {
  id: string; empId: string; empName: string; leaveType: string;
  from: string; to: string; days: number; reason: string;
  appliedOn: string; status: string;
}

function calcDays(from: string, to: string): number {
  if (!from || !to) return 0;
  const a = new Date(from), b = new Date(to);
  if (b < a) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
}

export default function Leave() {
  const [data, setData] = useState<LeaveRow[]>(() => initialLeaveRequests.map(l => ({ ...l })));
  const [tab, setTab] = useState('all');
  const { showToast } = useToastContext();

  // Modals
  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState<LeaveRow | null>(null);
  const [earlyModal, setEarlyModal] = useState<LeaveRow | null>(null);
  const [saving, setSaving] = useState(false);

  // New leave form
  const [newEmp, setNewEmp] = useState('');
  const [newType, setNewType] = useState('Annual');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newReason, setNewReason] = useState('');

  // Edit leave form
  const [editType, setEditType] = useState('');
  const [editFrom, setEditFrom] = useState('');
  const [editTo, setEditTo] = useState('');
  const [editReason, setEditReason] = useState('');

  // Early return
  const [earlyDate, setEarlyDate] = useState('');

  const counts = useMemo(() => ({
    total: data.length,
    pending: data.filter(l => l.status === 'Pending').length,
    approved: data.filter(l => l.status === 'Approved').length,
    rejected: data.filter(l => l.status === 'Rejected').length,
    onLeaveToday: 2,
  }), [data]);

  const filtered = tab === 'all' ? data : data.filter(l => l.status.toLowerCase() === tab);

  // Actions
  function handleApprove(id: string) {
    setData(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
    showToast('Leave approved');
  }
  function handleReject(id: string) {
    setData(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));
    showToast('Leave rejected', 'error');
  }

  function openEdit(row: LeaveRow) {
    setEditType(row.leaveType);
    setEditFrom(row.from);
    setEditTo(row.to);
    setEditReason(row.reason);
    setEditModal(row);
  }

  function saveEdit() {
    if (!editModal) return;
    setSaving(true);
    setTimeout(() => {
      setData(prev => prev.map(l => l.id === editModal.id ? {
        ...l, leaveType: editType, from: editFrom, to: editTo,
        days: calcDays(editFrom, editTo), reason: editReason
      } : l));
      setSaving(false);
      setEditModal(null);
      showToast('Leave request updated');
    }, 600);
  }

  function openEarly(row: LeaveRow) {
    setEarlyDate('');
    setEarlyModal(row);
  }

  function confirmEarly() {
    if (!earlyModal || !earlyDate) return;
    setSaving(true);
    setTimeout(() => {
      const actualDays = calcDays(earlyModal.from, earlyDate);
      setData(prev => prev.map(l => l.id === earlyModal.id ? { ...l, to: earlyDate, days: actualDays } : l));
      setSaving(false);
      setEarlyModal(null);
      showToast('Early return recorded');
    }, 600);
  }

  const newDays = calcDays(newFrom, newTo);

  function submitNew() {
    if (!newEmp || !newFrom || !newTo || !newReason) { showToast('Please fill all required fields', 'error'); return; }
    setSaving(true);
    setTimeout(() => {
      const emp = employees.find(e => e.id === newEmp);
      const newRow: LeaveRow = {
        id: 'LR' + String(data.length + 1).padStart(3, '0'),
        empId: newEmp,
        empName: emp?.name || '',
        leaveType: newType,
        from: newFrom, to: newTo,
        days: newDays,
        reason: newReason,
        appliedOn: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };
      setData(prev => [newRow, ...prev]);
      setSaving(false);
      setNewModal(false);
      setNewEmp(''); setNewType('Annual'); setNewFrom(''); setNewTo(''); setNewReason('');
      showToast('Leave request submitted');
    }, 600);
  }

  // Early return calcs
  const earlyOrigDays = earlyModal ? calcDays(earlyModal.from, earlyModal.to) : 0;
  const earlyActual = earlyModal && earlyDate ? calcDays(earlyModal.from, earlyDate) : earlyOrigDays;
  const earlyRestore = earlyOrigDays - earlyActual;

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Leave Management</div><div className="pg-sub">Manage leave requests and approvals</div></div>
        <button className="btn btn-primary" onClick={() => setNewModal(true)}><Plus size={13} /> New Leave Request</button>
      </div>

      <div className="kpi-strip" style={{ marginBottom: 12 }}>
        {[
          { l: 'Total', v: counts.total, c: 'k1' },
          { l: 'Pending', v: counts.pending, c: 'k3' },
          { l: 'Approved', v: counts.approved, c: 'k2' },
          { l: 'Rejected', v: counts.rejected, c: 'k4' },
          { l: 'On Leave Today', v: counts.onLeaveToday, c: 'k1' },
        ].map((k, i) => (
          <div key={i} className={`kpi-item ${k.c}`}><div><div className="kpi-val">{k.v}</div><div className="kpi-lbl">{k.l}</div></div></div>
        ))}
      </div>

      <div className="tabs">
        {['all', 'pending', 'approved', 'rejected'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {t !== 'all' && <span className="mono" style={{ fontSize: 10, marginLeft: 4, opacity: .6 }}>({t === 'pending' ? counts.pending : t === 'approved' ? counts.approved : counts.rejected})</span>}
          </button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--t3)' }}>
            <CalendarDays size={32} style={{ margin: '0 auto 8px', opacity: .4 }} />
            <div style={{ fontSize: 13 }}>No leave requests found</div>
          </div>
        ) : (
          <table>
            <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.empName}<div style={{ fontSize: 10, color: 'var(--t3)' }}>{l.empId}</div></td>
                  <td>{l.leaveType}</td>
                  <td className="mono">{l.from}</td>
                  <td className="mono">{l.to}</td>
                  <td className="mono">{l.days}</td>
                  <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</td>
                  <td className="mono">{l.appliedOn}</td>
                  <td><span className={`pill ${getStatusColor(l.status)}`}>{l.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {l.status === 'Pending' && <>
                        <button className="ico-btn" title="Approve" style={{ background: 'var(--greenl)', color: 'var(--green)', border: 'none', width: 28, height: 28 }} onClick={() => handleApprove(l.id)}><Check size={13} /></button>
                        <button className="ico-btn" title="Reject" style={{ background: 'var(--redl)', color: 'var(--red)', border: 'none', width: 28, height: 28 }} onClick={() => handleReject(l.id)}><X size={13} /></button>
                        <button className="ico-btn" title="Edit" style={{ width: 28, height: 28 }} onClick={() => openEdit(l)}><Pencil size={13} /></button>
                      </>}
                      {l.status === 'Approved' && (
                        <button className="btn btn-sm btn-ghost" onClick={() => openEarly(l)}><RotateCcw size={12} /> Early Return</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* NEW LEAVE REQUEST MODAL */}
      <Modal open={newModal} onClose={() => setNewModal(false)} title="New Leave Request" footer={
        <><button className="btn btn-secondary" onClick={() => setNewModal(false)}>Cancel</button>
        <button className="btn btn-primary" onClick={submitNew} disabled={saving}>{saving ? 'Submitting...' : 'Submit Request'}</button></>
      }>
        <div className="form-group">
          <label className="form-label">Employee *</label>
          <select className="input select-input" value={newEmp} onChange={e => setNewEmp(e.target.value)}>
            <option value="">Select employee...</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Leave Type</label>
          <select className="input select-input" value={newType} onChange={e => setNewType(e.target.value)}>
            {leaveTypes.filter(t => t.active).map(t => <option key={t.code} value={t.name.replace(' Leave', '')}>{t.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">From Date *</label>
            <input className="input" type="date" value={newFrom} onChange={e => setNewFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">To Date *</label>
            <input className="input" type="date" value={newTo} onChange={e => setNewTo(e.target.value)} />
          </div>
        </div>
        {newFrom && newTo && (
          <div style={{ fontSize: 12, marginBottom: 8, color: 'var(--p)', fontWeight: 600 }}>
            Days Requested: <span className="mono">{newDays}</span>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Reason *</label>
          <textarea className="input" rows={3} value={newReason} onChange={e => setNewReason(e.target.value)} placeholder="Enter reason for leave..." />
        </div>
      </Modal>

      {/* EDIT LEAVE MODAL */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit Leave Request" footer={
        <><button className="btn btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
        <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></>
      }>
        <DecisionBanner>DECISION NEEDED — HR Edit Permissions: Which fields can HR edit? Leave type, dates, reason, or all? Please confirm in meeting.</DecisionBanner>
        <div style={{ marginTop: 12 }} />
        <div className="form-group">
          <label className="form-label">Employee</label>
          <input className="input" value={editModal?.empName || ''} disabled style={{ background: 'var(--inp)', opacity: .7 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Leave Type</label>
          <select className="input select-input" value={editType} onChange={e => setEditType(e.target.value)}>
            {leaveTypes.filter(t => t.active).map(t => <option key={t.code} value={t.name.replace(' Leave', '')}>{t.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input className="input" type="date" value={editFrom} onChange={e => setEditFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input className="input" type="date" value={editTo} onChange={e => setEditTo(e.target.value)} />
          </div>
        </div>
        {editFrom && editTo && (
          <div style={{ fontSize: 12, marginBottom: 8, color: 'var(--p)', fontWeight: 600 }}>
            Days: <span className="mono">{calcDays(editFrom, editTo)}</span>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Reason</label>
          <textarea className="input" rows={3} value={editReason} onChange={e => setEditReason(e.target.value)} />
        </div>
      </Modal>

      {/* EARLY RETURN MODAL */}
      <Modal open={!!earlyModal} onClose={() => setEarlyModal(null)} title="Mark Early Return" footer={
        <><button className="btn btn-secondary" onClick={() => setEarlyModal(null)}>Cancel</button>
        <button className="btn btn-primary" onClick={confirmEarly} disabled={saving || !earlyDate}>{saving ? 'Saving...' : 'Confirm Early Return'}</button></>
      }>
        <div style={{ background: 'var(--inp)', padding: 12, borderRadius: 'var(--rsm)', marginBottom: 12, fontSize: 12.5 }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{earlyModal?.empName} — {earlyModal?.leaveType} Leave</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--t3)' }}>Original: {earlyModal?.from} to {earlyModal?.to} ({earlyOrigDays} days)</div>
        </div>
        <div className="form-group">
          <label className="form-label">Employee returned on:</label>
          <input className="input" type="date" value={earlyDate} onChange={e => setEarlyDate(e.target.value)}
            min={earlyModal?.from} max={earlyModal?.to} />
        </div>
        {earlyDate && (
          <div style={{ display: 'flex', gap: 20, fontSize: 12.5, padding: '8px 0' }}>
            <div>Days Actually Taken: <strong className="mono">{earlyActual}</strong></div>
            <div>Days to Restore: <strong className="mono" style={{ color: 'var(--green)' }}>{earlyRestore > 0 ? earlyRestore : 0}</strong></div>
          </div>
        )}
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>
          The original leave approval is preserved. The early return date is recorded separately.
        </div>
      </Modal>
    </div>
  );
}
