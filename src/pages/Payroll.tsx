import React, { useState } from 'react';
import { payrollData, employees, formatRs, getStatusColor } from '../data/dummyData';
import { Plus, Eye, Pencil, FileText } from 'lucide-react';
import Modal from '../components/Modal';
import { useToastContext } from '../contexts/ToastContext';

export default function Payroll() {
  const { showToast } = useToastContext();
  const [genModal, setGenModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [basic, setBasic] = useState(150000);
  const [house, setHouse] = useState(30000);
  const [transport, setTransport] = useState(10000);
  const [otherE, setOtherE] = useState(5000);
  const [tax, setTax] = useState(12000);
  const [loan, setLoan] = useState(0);
  const [otherD, setOtherD] = useState(5000);
  const latePenalty = 0;
  const gross = basic + house + transport + otherE;
  const totalDed = tax + loan + latePenalty + otherD;
  const net = gross - totalDed;

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Payroll</div><div className="pg-sub">March 2026</div></div>
        <button className="btn btn-primary" onClick={() => setGenModal(true)}><Plus size={13} /> Generate Payroll</button>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <select className="input select-input" style={{ width: 140 }}><option>March</option><option>February</option></select>
          <input className="input mono" style={{ width: 80 }} value="2026" readOnly />
          <select className="input select-input" style={{ width: 120 }}><option>All</option><option>Draft</option><option>Finalized</option></select>
        </div>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Emp ID</th><th>Name</th><th>Basic</th><th>Earnings</th><th>Deductions</th><th>Gross</th><th>Net</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {payrollData.map((p, i) => {
              const g = p.basic + p.houseAllowance + p.transport + p.otherEarning;
              const d = p.tax + p.loan + p.latePenalty + p.otherDeduction;
              return (
                <tr key={i}>
                  <td className="mono">{p.empId}</td><td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td className="mono">{formatRs(p.basic)}</td><td className="mono">{formatRs(g - p.basic)}</td><td className="mono" style={{ color: 'var(--red)' }}>{formatRs(d)}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>{formatRs(g)}</td><td className="mono" style={{ fontWeight: 600, color: 'var(--green)' }}>{formatRs(g - d)}</td>
                  <td><span className={`pill ${getStatusColor(p.status)}`}>{p.status}</span></td>
                  <td><div style={{ display: 'flex', gap: 4 }}>
                    <button className="ico-btn" style={{ width: 28, height: 28 }} onClick={() => setViewModal(true)}><Eye size={13} /></button>
                    {p.status === 'Draft' && <button className="ico-btn" style={{ width: 28, height: 28 }}><Pencil size={13} /></button>}
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Generate Modal */}
      <Modal open={genModal} onClose={() => setGenModal(false)} title="Generate Payroll — March 2026" wide footer={
        <><button className="btn btn-secondary" onClick={() => { showToast('Saved as draft'); setGenModal(false); }}>Save as Draft</button><button className="btn btn-primary" onClick={() => { showToast('Payroll finalized'); setGenModal(false); }}>Finalize & Lock</button></>
      }>
        <div className="form-group"><label className="form-label">Employee</label><select className="input select-input">{employees.map(e => <option key={e.id}>{e.id} — {e.name}</option>)}</select></div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 }}>Earnings</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Basic Salary</label><input className="input mono" type="number" value={basic} onChange={e => setBasic(+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">House Allowance</label><input className="input mono" type="number" value={house} onChange={e => setHouse(+e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Transport</label><input className="input mono" type="number" value={transport} onChange={e => setTransport(+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Other Allowance</label><input className="input mono" type="number" value={otherE} onChange={e => setOtherE(+e.target.value)} /></div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 }}>Deductions</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Tax</label><input className="input mono" type="number" value={tax} onChange={e => setTax(+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Loan</label><input className="input mono" type="number" value={loan} onChange={e => setLoan(+e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Late Penalty (auto)</label><input className="input mono" value={formatRs(latePenalty)} disabled style={{ background: 'var(--amberl)' }} /></div>
          <div className="form-group"><label className="form-label">Other</label><input className="input mono" type="number" value={otherD} onChange={e => setOtherD(+e.target.value)} /></div>
        </div>
        <div style={{ background: 'var(--inp)', padding: 14, borderRadius: 'var(--rsm)', marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Gross Salary</span><span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--p)' }}>{formatRs(gross)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Total Deductions</span><span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>{formatRs(totalDed)}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--br)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Net Salary</span><span className="mono" style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>{formatRs(net)}</span>
          </div>
        </div>
      </Modal>

      {/* View Payslip Modal */}
      <Modal open={viewModal} onClose={() => setViewModal(false)} title="Payslip — March 2026" wide footer={
        <><button className="btn btn-ghost"><FileText size={13} /> Print</button><button className="btn btn-primary">Download PDF</button></>
      }>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Employee Management System</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Payslip for March 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, fontSize: 12 }}>
          <div><strong>Employee:</strong> Ahmed Ali</div><div><strong>ID:</strong> EMP001</div><div><strong>Dept:</strong> Engineering</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginBottom: 6 }}>EARNINGS</div>
            {[['Basic Salary', 150000], ['House Allowance', 30000], ['Transport', 10000], ['Other', 5000]].map(([n, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--br2)', fontSize: 12 }}><span>{n}</span><span className="mono">{formatRs(v as number)}</span></div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', marginBottom: 6 }}>DEDUCTIONS</div>
            {[['Tax', 12000], ['Other', 5000]].map(([n, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--br2)', fontSize: 12 }}><span>{n}</span><span className="mono">{formatRs(v as number)}</span></div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--inp)', padding: 12, borderRadius: 'var(--rsm)', marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div><div style={{ fontSize: 11, color: 'var(--t3)' }}>Gross</div><div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{formatRs(195000)}</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, color: 'var(--t3)' }}>Net</div><div className="mono" style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>{formatRs(178000)}</div></div>
        </div>
      </Modal>
    </div>
  );
}
