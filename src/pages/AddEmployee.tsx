import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { departments, designations, employmentTypes, jobStatuses, workModes, workLocations, shifts, reportingManagers, formatPKR } from '../data/dummyData';
import { Check, Lock, Upload, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

const STEPS = ['Personal', 'Contact', 'Bank', 'Job Info', 'Salary', 'Medical', 'Attachments', 'Account'];

export default function AddEmployee() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [animating, setAnimating] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');
  const [ice1, setIce1] = useState('');
  const [ice2, setIce2] = useState('');
  const [permAddress, setPermAddress] = useState('');
  const [postAddress, setPostAddress] = useState('');
  const [sameAddress, setSameAddress] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online Transfer');
  const [dept, setDept] = useState(departments[0]);
  const [desig, setDesig] = useState(designations[0]);
  const [empType, setEmpType] = useState(employmentTypes[0]);
  const [jobStat, setJobStat] = useState(jobStatuses[0]);
  const [wMode, setWMode] = useState(workModes[0]);
  const [wLoc, setWLoc] = useState(workLocations[0]);
  const [rm, setRm] = useState(reportingManagers[0]);
  const [shift, setShift] = useState(shifts[0].name);
  const [doj, setDoj] = useState('');
  const [doe, setDoe] = useState('');
  const [commissionEligible, setCommissionEligible] = useState(false);
  const [salBasic, setSalBasic] = useState(0);
  const [salHouse, setSalHouse] = useState(0);
  const [salMedical, setSalMedical] = useState(0);
  const [salConveyance, setSalConveyance] = useState(0);
  const [salCommission, setSalCommission] = useState(0);
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronic, setChronic] = useState('');
  const [medications, setMedications] = useState('');
  const [accountMethod, setAccountMethod] = useState<'A' | 'B'>('A');
  const [username, setUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [empEmail, setEmpEmail] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedShift = shifts.find(s => s.name === shift);
  const totalSalary = salBasic + salHouse + salMedical + salConveyance + (commissionEligible ? salCommission : 0);

  const formatCnic = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return digits.slice(0, 5) + '-' + digits.slice(5);
    return digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!fullName.trim()) e.fullName = 'Full name is required';
      if (!cnic.trim()) e.cnic = 'CNIC is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setDirection('right');
      setAnimating(true);
      setTimeout(() => { setStep(step + 1); setAnimating(false); }, 300);
    }
  };
  const goBack = () => {
    if (step > 0) {
      setDirection('left');
      setAnimating(true);
      setTimeout(() => { setStep(step - 1); setAnimating(false); }, 300);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast('Employee saved successfully'); navigate('/employees'); }, 800);
  };

  const stepContent = () => {
    switch (step) {
      case 0: return (
        <div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <div style={{ position: 'relative' }}>
                <input className="input mono" value="EMP006" disabled style={{ background: 'var(--steell)', paddingRight: 32 }} />
                <Lock size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: 'var(--red)' }}>*</span></label>
              <input className="input" placeholder="Enter full name" value={fullName} onChange={e => setFullName(e.target.value)} style={errors.fullName ? { borderColor: 'var(--red)' } : {}} />
              {errors.fullName && <div style={{ color: 'var(--red)', fontSize: 11, marginTop: 4 }}>{errors.fullName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Father Name <span style={{ color: 'var(--red)' }}>*</span></label>
              <input className="input" placeholder="Enter father's name" value={fatherName} onChange={e => setFatherName(e.target.value)} />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">CNIC <span style={{ color: 'var(--red)' }}>*</span></label>
              <input className="input mono" placeholder="00000-0000000-0" value={cnic} onChange={e => setCnic(formatCnic(e.target.value))} style={errors.cnic ? { borderColor: 'var(--red)' } : {}} />
              {errors.cnic && <div style={{ color: 'var(--red)', fontSize: 11, marginTop: 4 }}>{errors.cnic}</div>}
            </div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input className="input" type="date" value={dob} onChange={e => setDob(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Gender</label><select className="input select-input" value={gender} onChange={e => setGender(e.target.value)}><option>Male</option><option>Female</option></select></div>
          </div>
        </div>
      );
      case 1: return (
        <div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Contact 1 <span style={{ color: 'var(--red)' }}>*</span></label><input className="input" placeholder="03XX-XXXXXXX" value={contact1} onChange={e => setContact1(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Contact 2</label><input className="input" placeholder="Optional" value={contact2} onChange={e => setContact2(e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Emergency Contact 1 — ICE 1</label><input className="input" value={ice1} onChange={e => setIce1(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Emergency Contact 2 — ICE 2</label><input className="input" value={ice2} onChange={e => setIce2(e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Permanent Address</label><textarea className="input" rows={2} value={permAddress} onChange={e => setPermAddress(e.target.value)} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--t2)', margin: '8px 0' }}>
            <input type="checkbox" checked={sameAddress} onChange={e => { setSameAddress(e.target.checked); if (e.target.checked) setPostAddress(permAddress); }} />
            Same as permanent address
          </label>
          <div className="form-group"><label className="form-label">Postal Address</label><textarea className="input" rows={2} value={sameAddress ? permAddress : postAddress} onChange={e => setPostAddress(e.target.value)} disabled={sameAddress} /></div>
        </div>
      );
      case 2: return (
        <div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Bank Name</label><input className="input" placeholder="e.g. HBL, UBL" value={bankName} onChange={e => setBankName(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Bank Account Number</label><input className="input mono" placeholder="XXXX-XXXX-XXXX" value={bankAccount} onChange={e => setBankAccount(e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Payment Mode</label>
            <select className="input select-input" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
              <option>Cash</option><option>Online Transfer</option><option>Cheque</option>
            </select>
          </div>
        </div>
      );
      case 3: return (
        <div>
          <div className="form-row-3">
            <div className="form-group"><label className="form-label">Department <span style={{ color: 'var(--red)' }}>*</span></label><select className="input select-input" value={dept} onChange={e => setDept(e.target.value)}>{departments.map(d => <option key={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Designation <span style={{ color: 'var(--red)' }}>*</span></label><select className="input select-input" value={desig} onChange={e => setDesig(e.target.value)}>{designations.map(d => <option key={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Employment Type</label><select className="input select-input" value={empType} onChange={e => setEmpType(e.target.value)}>{employmentTypes.map(d => <option key={d}>{d}</option>)}</select></div>
          </div>
          <div className="form-row-3">
            <div className="form-group"><label className="form-label">Job Status</label><select className="input select-input" value={jobStat} onChange={e => setJobStat(e.target.value)}>{jobStatuses.map(d => <option key={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Posting / Work Location <span style={{ color: 'var(--red)' }}>*</span></label><select className="input select-input" value={wLoc} onChange={e => setWLoc(e.target.value)}>{workLocations.map(d => <option key={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Work Mode</label><select className="input select-input" value={wMode} onChange={e => setWMode(e.target.value)}>{workModes.map(d => <option key={d}>{d}</option>)}</select></div>
          </div>
          <div className="form-row-3">
            <div className="form-group"><label className="form-label">Reporting Manager <span style={{ color: 'var(--red)' }}>*</span></label><select className="input select-input" value={rm} onChange={e => setRm(e.target.value)}>{reportingManagers.map(d => <option key={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Shift <span style={{ color: 'var(--red)' }}>*</span></label><select className="input select-input" value={shift} onChange={e => setShift(e.target.value)}>{shifts.map(s => <option key={s.name}>{s.name}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Timing</label><input className="input mono" value={selectedShift ? `${selectedShift.start} – ${selectedShift.end} PKT` : ''} readOnly style={{ background: 'var(--steell)' }} /></div>
          </div>
          <div className="form-row-3">
            <div className="form-group"><label className="form-label">Date of Joining <span style={{ color: 'var(--red)' }}>*</span></label><input className="input" type="date" value={doj} onChange={e => setDoj(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Date of Exit (optional)</label><input className="input" type="date" value={doe} onChange={e => setDoe(e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Commission Eligible</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, cursor: 'pointer' }}>
                  <input type="radio" checked={commissionEligible} onChange={() => setCommissionEligible(true)} /> Yes
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, cursor: 'pointer' }}>
                  <input type="radio" checked={!commissionEligible} onChange={() => setCommissionEligible(false)} /> No
                </label>
              </div>
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 12 }}>Salary components are configurable from Settings → Payroll Components</div>
          <div className="card" style={{ padding: 0 }}>
            <table>
              <thead><tr><th>Component</th><th>Monthly Amount (PKR)</th><th>Include</th></tr></thead>
              <tbody>
                <tr><td>Basic Salary</td><td><input className="input mono" type="number" value={salBasic || ''} onChange={e => setSalBasic(+e.target.value)} placeholder="0" style={{ width: 160 }} /></td><td><input type="checkbox" defaultChecked /></td></tr>
                <tr><td>House Rent Allowance</td><td><input className="input mono" type="number" value={salHouse || ''} onChange={e => setSalHouse(+e.target.value)} placeholder="0" style={{ width: 160 }} /></td><td><input type="checkbox" defaultChecked /></td></tr>
                <tr><td>Medical Allowance</td><td><input className="input mono" type="number" value={salMedical || ''} onChange={e => setSalMedical(+e.target.value)} placeholder="0" style={{ width: 160 }} /></td><td><input type="checkbox" defaultChecked /></td></tr>
                <tr><td>Conveyance Allowance</td><td><input className="input mono" type="number" value={salConveyance || ''} onChange={e => setSalConveyance(+e.target.value)} placeholder="0" style={{ width: 160 }} /></td><td><input type="checkbox" defaultChecked /></td></tr>
                {commissionEligible && <tr><td>Commission</td><td><input className="input mono" type="number" value={salCommission || ''} onChange={e => setSalCommission(+e.target.value)} placeholder="0" style={{ width: 160 }} /></td><td><input type="checkbox" defaultChecked /></td></tr>}
              </tbody>
            </table>
          </div>
          <div style={{ background: 'var(--inp)', padding: 14, borderRadius: 'var(--rsm)', marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Total Monthly Package</span>
            <span className="mono" style={{ fontSize: 18, fontWeight: 800, color: 'var(--p)' }}>{formatPKR(totalSalary)}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <DecisionBanner>
              DECISION NEEDED — Salary Components<br />
              Are components the same for all employees or different per person?<br />
              Can HR add a one-employee-only component? Confirm in meeting.
            </DecisionBanner>
          </div>
        </div>
      );
      case 5: return (
        <div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Blood Group</label><select className="input select-input" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Allergies</label><textarea className="input" rows={2} value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="None" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Chronic Conditions</label><textarea className="input" rows={2} value={chronic} onChange={e => setChronic(e.target.value)} placeholder="None" /></div>
            <div className="form-group"><label className="form-label">Current Medications</label><textarea className="input" rows={2} value={medications} onChange={e => setMedications(e.target.value)} placeholder="None" /></div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>More fields can be added from Settings → Custom Fields</div>
          <div style={{ marginTop: 12 }}>
            <DecisionBanner>
              DECISION NEEDED — Can employees edit their own medical info? Confirm in meeting.
            </DecisionBanner>
          </div>
        </div>
      );
      case 6: return (
        <div>
          {[
            { label: 'CNIC Copy', status: 'uploaded', file: 'cnic_scan.pdf' },
            { label: 'Profile Photo', status: 'uploaded', file: 'ahmed_photo.jpg' },
            { label: 'Electric Bill', status: 'missing', file: '' },
            { label: 'Employment Contract', status: 'missing', file: '' },
          ].map((att, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--br2)' }}>
              <FileText size={16} style={{ color: 'var(--t3)' }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{att.label}</span>
              {att.status === 'uploaded' ? (
                <>
                  <span className="pill pill-green">✓ Uploaded — {att.file}</span>
                  <button className="btn btn-sm btn-ghost">View</button>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--red)' }}>Remove</button>
                </>
              ) : (
                <>
                  <span className="pill pill-amber">⚠ Missing</span>
                  <button className="btn btn-sm btn-primary" onClick={() => { /* File picker UI only */ const input = document.createElement('input'); input.type = 'file'; input.click(); }}>
                    <Upload size={12} /> Upload
                  </button>
                </>
              )}
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <DecisionBanner>
              DECISION NEEDED — Which attachments are mandatory? Confirm in meeting.
            </DecisionBanner>
          </div>
        </div>
      );
      case 7: return (
        <div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: 'var(--inp)', borderRadius: 'var(--rsm)', overflow: 'hidden', border: '1px solid var(--br)' }}>
            <button className={accountMethod === 'A' ? 'wizard-toggle active' : 'wizard-toggle'} onClick={() => setAccountMethod('A')}>HR Creates Credentials</button>
            <button className={accountMethod === 'B' ? 'wizard-toggle active' : 'wizard-toggle'} onClick={() => setAccountMethod('B')}>Send Invite Link</button>
          </div>
          {accountMethod === 'A' ? (
            <div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Username</label><input className="input" placeholder="auto-generated" value={username || (fullName ? fullName.toLowerCase().replace(/\s+/g, '.') : '')} onChange={e => setUsername(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Temporary Password</label><input className="input" type="password" value={tempPassword} onChange={e => setTempPassword(e.target.value)} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} /> Send credentials via email to employee
              </label>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Employee Email</label>
              <input className="input" type="email" placeholder="employee@company.com" value={empEmail} onChange={e => setEmpEmail(e.target.value)} />
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 6 }}>Employee will receive a link and set their own password on first login</div>
            </div>
          )}

          {/* Review Summary */}
          <div style={{ background: 'var(--inp)', padding: 14, borderRadius: 'var(--rsm)', marginTop: 20, fontSize: 12.5 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 8 }}>Review Summary</div>
            <div style={{ fontWeight: 600 }}>{fullName || 'New Employee'} (EMP006) · {dept} · {desig} · {shift}</div>
            <div className="mono" style={{ marginTop: 4, color: 'var(--t2)' }}>Total Package: {formatPKR(totalSalary)}/month · Joining: {doj || 'Not set'}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <DecisionBanner>
              DECISION NEEDED — Account creation method: Option A or B? Confirm in meeting.
            </DecisionBanner>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Wizard Header */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 12 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                  background: i < step ? 'var(--p)' : i === step ? 'var(--p)' : 'transparent',
                  color: i <= step ? '#fff' : 'var(--t3)',
                  border: i > step ? '2px solid var(--br)' : 'none',
                }}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <div style={{ fontSize: 9.5, marginTop: 4, fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--p)' : 'var(--t3)' }}>{s}</div>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--p)' : 'var(--br)', margin: '0 -4px', marginBottom: 16, minWidth: 20, maxWidth: 60 }} />}
            </React.Fragment>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--br)', borderRadius: 2 }}>
          <div style={{ height: '100%', background: 'var(--p)', borderRadius: 2, width: `${((step + 1) / STEPS.length) * 100}%`, transition: 'width .3s ease' }} />
        </div>
      </div>

      {/* Step Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="card" style={{
          animation: animating ? (direction === 'right' ? 'slideOutLeft .3s ease' : 'slideOutRight .3s ease') : 'slideInFromRight .3s ease',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{STEPS[step]}</div>
          {stepContent()}
        </div>
      </div>

      {/* Sticky Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', marginTop: 12, borderTop: '1px solid var(--br)',
      }}>
        <button className="btn btn-secondary" onClick={() => navigate('/employees')}><X size={13} /> Cancel</button>
        <span style={{ fontSize: 12, color: 'var(--t3)' }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && <button className="btn btn-secondary" onClick={goBack}><ChevronLeft size={13} /> Back</button>}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={goNext}>Next <ChevronRight size={13} /></button>
          ) : (
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: 160 }}>
              {saving ? 'Saving...' : '✓ Save Employee'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
