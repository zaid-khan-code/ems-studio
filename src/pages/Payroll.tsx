import React, { useState } from 'react';
import { payrollData, employees, formatPKR, getStatusColor, numberToWords } from '../data/dummyData';
import { Plus, Eye, Pencil, Lock, FileText, Printer, Download } from 'lucide-react';
import Modal from '../components/Modal';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

export default function Payroll() {
  const { showToast } = useToastContext();
  const [genModal, setGenModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewEmp, setViewEmp] = useState(payrollData[0]);
  const [monthFilter, setMonthFilter] = useState('March');
  const [statusFilter, setStatusFilter] = useState('');

  // Generate form state
  const [selEmp, setSelEmp] = useState('EMP001');
  const [workingDays] = useState(31);
  const [empWorkingDays, setEmpWorkingDays] = useState(28);
  const [clUsed, setClUsed] = useState(0);
  const [mlUsed, setMlUsed] = useState(0);
  const [alUsed, setAlUsed] = useState(0);
  const [absents, setAbsents] = useState(3);
  const [basic, setBasic] = useState(150000);
  const [houseRent, setHouseRent] = useState(30000);
  const [medical, setMedical] = useState(10000);
  const [conveyance, setConveyance] = useState(5000);
  const [commission, setCommission] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [loanInstallment, setLoanInstallment] = useState(0);
  const [tax, setTax] = useState(12000);
  const [otherDed, setOtherDed] = useState(0);
  const latePenalty = 0;

  const paidDays = empWorkingDays;
  const absentDeduction = absents > 0 ? (basic / workingDays) * absents : 0;
  const totalEarnings = basic + houseRent + medical + conveyance + commission;
  const totalDeductions = absentDeduction + latePenalty + advance + loanInstallment + tax + otherDed;
  const grossSalary = totalEarnings;
  const netSalary = grossSalary - totalDeductions;

  const filtered = payrollData.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const openView = (p: typeof payrollData[0]) => { setViewEmp(p); setViewModal(true); };

  const loadSalary = () => {
    const emp = employees.find(e => e.id === selEmp);
    if (emp) {
      setBasic(emp.salary.basic);
      setHouseRent(emp.salary.houseRent);
      setMedical(emp.salary.medical);
      setConveyance(emp.salary.conveyance);
      setCommission(emp.salary.commission);
    }
  };

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Payroll</div><div className="pg-sub">March 2026</div></div>
        <button className="btn btn-primary" onClick={() => { loadSalary(); setGenModal(true); }}><Plus size={13} /> Generate Payroll</button>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="input select-input" style={{ width: 140 }} value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
            <option>March</option><option>February</option><option>January</option>
          </select>
          <input className="input mono" style={{ width: 80 }} value="2026" readOnly />
          <select className="input select-input" style={{ width: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All</option><option>Draft</option><option>Finalized</option>
          </select>
        </div>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Emp ID</th><th>Name</th><th>Working Days</th><th>Paid Days</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((p, i) => {
              const g = p.basic + p.houseRent + p.medical + p.conveyance + p.commission;
              const d = p.absentDeduction + p.tax + p.loan + p.advance + p.latePenalty + p.otherDeduction;
              return (
                <tr key={i}>
                  <td className="mono">{p.empId}</td><td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td className="mono">{p.workingDays}</td><td className="mono">{p.paidDays}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>{formatPKR(g)}</td>
                  <td className="mono" style={{ color: 'var(--red)' }}>{formatPKR(d)}</td>
                  <td className="mono" style={{ fontWeight: 600, color: 'var(--green)' }}>{formatPKR(g - d)}</td>
                  <td><span className={`pill ${getStatusColor(p.status)}`}>{p.status}</span></td>
                  <td><div style={{ display: 'flex', gap: 4 }}>
                    <button className="ico-btn" style={{ width: 28, height: 28 }} title="View Payslip" onClick={() => openView(p)}><Eye size={13} /></button>
                    {p.status === 'Draft' && <button className="ico-btn" style={{ width: 28, height: 28 }} title="Edit"><Pencil size={13} /></button>}
                    {p.status === 'Draft' && <button className="ico-btn" style={{ width: 28, height: 28 }} title="Finalize" onClick={() => showToast('Payroll finalized')}><Lock size={13} /></button>}
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Generate Payroll Modal */}
      <Modal open={genModal} onClose={() => setGenModal(false)} title="Generate Payroll — March 2026" wide footer={
        <><button className="btn btn-secondary" onClick={() => { showToast('Saved as draft'); setGenModal(false); }}>Save as Draft</button><button className="btn btn-primary" onClick={() => { showToast('Payroll finalized'); setGenModal(false); }}>Finalize & Lock Payroll</button></>
      }>
        {/* Step 1 - Employee */}
        <div className="form-row">
          <div className="form-group"><label className="form-label">Employee</label>
            <select className="input select-input" value={selEmp} onChange={e => setSelEmp(e.target.value)}>
              {employees.map(e => <option key={e.id} value={e.id}>{e.id} — {e.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={loadSalary}>Load Salary Structure</button>
          </div>
        </div>

        {/* Step 2 - Working Days */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 }}>Working Days</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Total Working Days</label><input className="input mono" value={workingDays} readOnly style={{ background: 'var(--steell)', width: 80 }} /></div>
          <div className="form-group"><label className="form-label">Employee Working Days</label><input className="input mono" type="number" value={empWorkingDays} onChange={e => setEmpWorkingDays(+e.target.value)} style={{ width: 80 }} /></div>
          <div className="form-group"><label className="form-label">Absents</label><input className="input mono" type="number" value={absents} onChange={e => setAbsents(+e.target.value)} style={{ width: 80 }} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">CL Used</label><input className="input mono" type="number" value={clUsed} onChange={e => setClUsed(+e.target.value)} style={{ width: 80 }} /></div>
          <div className="form-group"><label className="form-label">ML Used</label><input className="input mono" type="number" value={mlUsed} onChange={e => setMlUsed(+e.target.value)} style={{ width: 80 }} /></div>
          <div className="form-group"><label className="form-label">AL Used</label><input className="input mono" type="number" value={alUsed} onChange={e => setAlUsed(+e.target.value)} style={{ width: 80 }} /></div>
          <div className="form-group"><label className="form-label">Total Paid Days</label><input className="input mono" value={paidDays} readOnly style={{ background: 'var(--steell)', width: 80 }} /></div>
        </div>

        {/* Step 3 - Earnings */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 }}>Earnings</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Basic Salary</label><input className="input mono" type="number" value={basic} onChange={e => setBasic(+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">House Rent Allowance</label><input className="input mono" type="number" value={houseRent} onChange={e => setHouseRent(+e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Medical Allowance</label><input className="input mono" type="number" value={medical} onChange={e => setMedical(+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Conveyance</label><input className="input mono" type="number" value={conveyance} onChange={e => setConveyance(+e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Commission</label><input className="input mono" type="number" value={commission} onChange={e => setCommission(+e.target.value)} /></div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginTop: 4 }}>Total Earnings: <span className="mono" style={{ color: 'var(--green)' }}>{formatPKR(totalEarnings)}</span></div>

        {/* Step 4 - Deductions */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 }}>Deductions</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Absent Deduction (auto)</label><input className="input mono" value={formatPKR(absentDeduction)} disabled style={{ background: 'var(--amberl)' }} /></div>
          <div className="form-group"><label className="form-label">Late Penalty (auto)</label><input className="input mono" value={formatPKR(latePenalty)} disabled style={{ background: 'var(--amberl)' }} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Advance</label><input className="input mono" type="number" value={advance} onChange={e => setAdvance(+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Loan Installment</label><input className="input mono" type="number" value={loanInstallment} onChange={e => setLoanInstallment(+e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Tax</label><input className="input mono" type="number" value={tax} onChange={e => setTax(+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Other Deductions</label><input className="input mono" type="number" value={otherDed} onChange={e => setOtherDed(+e.target.value)} /></div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginTop: 4 }}>Total Deductions: <span className="mono" style={{ color: 'var(--red)' }}>{formatPKR(totalDeductions)}</span></div>

        {/* Summary */}
        <div style={{ background: 'var(--inp)', padding: 14, borderRadius: 'var(--rsm)', marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Gross Salary</span><span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--p)' }}>{formatPKR(grossSalary)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Total Deductions</span><span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>{formatPKR(totalDeductions)}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--br)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>NET SALARY</span><span className="mono" style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>{formatPKR(netSalary)}</span>
          </div>
          <div style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--t3)', marginTop: 6 }}>Amount in Words: {numberToWords(Math.floor(netSalary))}</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <DecisionBanner>
            DECISION NEEDED — Pro-Rated Salary & Tax<br />
            1. Is basic salary pro-rated per absent day, or always paid full?<br />
            2. Is tax auto-calculated by salary bracket, or manual entry by HR?<br />
            3. What is the exact formula for absent deduction?<br />
            Please confirm in meeting.
          </DecisionBanner>
        </div>
      </Modal>

      {/* Payslip View Modal */}
      <Modal open={viewModal} onClose={() => setViewModal(false)} title="" wide>
        <PayslipView data={viewEmp} onClose={() => setViewModal(false)} />
      </Modal>
    </div>
  );
}

function PayslipView({ data, onClose }: { data: typeof payrollData[0]; onClose: () => void }) {
  const emp = employees.find(e => e.id === data.empId) || employees[0];
  const grossEarnings = data.basic + data.houseRent + data.medical + data.conveyance + data.commission;
  const totalDed = data.absentDeduction + data.tax + data.loan + data.advance + data.latePenalty + data.otherDeduction;
  const net = grossEarnings - totalDed;

  const cellStyle: React.CSSProperties = { padding: '6px 10px', fontSize: 12, borderBottom: '1px solid var(--br)' };
  const headerStyle: React.CSSProperties = { background: 'var(--sb)', color: '#fff', padding: '6px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.05em' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        <button className="btn btn-ghost"><Printer size={13} /> Print</button>
        <button className="btn btn-ghost"><Download size={13} /> Download PDF</button>
      </div>
      <div style={{ border: '2px solid var(--sb)', borderRadius: 'var(--rsm)', overflow: 'hidden' }}>
        {/* Title */}
        <div style={{ ...headerStyle, textAlign: 'center', fontSize: 14, padding: '10px' }}>PAY SLIP</div>

        {/* Employee Details + Slip Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div style={headerStyle}>Employee Details</div>
            {[['Employee Code', emp.id], ['Name', emp.name], ['Designation', emp.designation], ['Department', emp.department], ['DOJ', emp.dateOfJoining]].map(([l, v], i) => (
              <div key={i} style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--t3)' }}>{l}</span><span className="mono" style={{ fontWeight: 500 }}>{v}</span></div>
            ))}
          </div>
          <div style={{ borderLeft: '1px solid var(--br)' }}>
            <div style={headerStyle}>Slip Information</div>
            {[['Slip No', '25'], ['Dated', 'Thursday, Mar 31, 2026'], ['Pay Slip for', 'March'], ['Year', '2026']].map(([l, v], i) => (
              <div key={i} style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--t3)' }}>{l}</span><span className="mono" style={{ fontWeight: 500 }}>{v}</span></div>
            ))}
          </div>
        </div>

        {/* Working Days + Salary Structure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div style={headerStyle}>Working Days</div>
            {[['Working Days', data.workingDays], ['CL', data.clUsed], ['ML', data.mlUsed], ['AL', data.alUsed], ['Absents', data.absents], ['Total Paid Days', data.paidDays]].map(([l, v], i) => (
              <div key={i} style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--t3)' }}>{l}</span><span className="mono">{v}</span></div>
            ))}
          </div>
          <div style={{ borderLeft: '1px solid var(--br)' }}>
            <div style={headerStyle}>Salary Structure</div>
            {[['Basic Salary', data.basic], ['House Rent All.', data.houseRent], ['Medical All.', data.medical], ['Conveyance', data.conveyance], ['Commission', data.commission]].map(([l, v], i) => (
              <div key={i} style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--t3)' }}>{l}</span><span className="mono">{formatPKR(v as number)}</span></div>
            ))}
            <div style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>Total</span><span className="mono">{formatPKR(grossEarnings)}</span></div>
          </div>
        </div>

        {/* Earnings + Deductions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div style={headerStyle}>Earnings</div>
            <div style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between' }}><span>Gross Salary</span><span className="mono">{formatPKR(grossEarnings)}</span></div>
            <div style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between' }}><span>Deduction</span><span className="mono" style={{ color: 'var(--red)' }}>{formatPKR(totalDed)}</span></div>
            <div style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>Net Salary</span><span className="mono" style={{ color: 'var(--green)', fontSize: 14 }}>{formatPKR(net)}</span></div>
          </div>
          <div style={{ borderLeft: '1px solid var(--br)' }}>
            <div style={headerStyle}>Deductions</div>
            {[['Advance', data.advance], ['Loan', data.loan], ['Absents', data.absentDeduction], ['Tax', data.tax], ['Late Penalty', data.latePenalty]].map(([l, v], i) => (
              <div key={i} style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--t3)' }}>{l}</span><span className="mono">{formatPKR(v as number)}</span></div>
            ))}
            <div style={{ ...cellStyle, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>Total</span><span className="mono" style={{ color: 'var(--red)' }}>{formatPKR(totalDed)}</span></div>
          </div>
        </div>

        {/* Amount in Words */}
        <div style={{ ...cellStyle, fontStyle: 'italic', fontSize: 11, color: 'var(--t2)' }}>Amount in Words: {numberToWords(Math.floor(net))}</div>

        {/* Payment Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 10px', borderTop: '1px solid var(--br)' }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Payment Mode:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}><input type="checkbox" checked={data.paymentMode === 'Cash'} readOnly /> Cash</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}><input type="checkbox" checked={data.paymentMode === 'Online Transfer'} readOnly /> Online Transfer</label>
        </div>

        {/* Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--br)', padding: '20px 10px 10px' }}>
          {['Prepared By:', 'Employee Sign:', 'Issued By:'].map((l, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid var(--t3)', width: '80%', margin: '0 auto 6px', height: 30 }} />
              <div style={{ fontSize: 10, color: 'var(--t3)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
