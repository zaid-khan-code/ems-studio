import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { departments, designations, employmentTypes, jobStatuses, workModes, workLocations, shifts } from '../data/dummyData';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DecisionBanner from '../components/DecisionBanner';
import { useToastContext } from '../contexts/ToastContext';

function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card section-card">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <h3>{title}</h3>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

export default function AddEmployee() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [saving, setSaving] = useState(false);
  const [accountMethod, setAccountMethod] = useState<'A' | 'B'>('A');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast('Employee saved successfully'); navigate('/employees'); }, 800);
  };

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Add New Employee</div><div className="pg-sub">Fill in all required information</div></div>
      </div>

      <Section title="Personal Information">
        <div className="form-row-3">
          <div className="form-group"><label className="form-label">Employee ID</label><input className="input mono" value="EMP006" disabled /></div>
          <div className="form-group"><label className="form-label">Full Name</label><input className="input" placeholder="Enter full name" /></div>
          <div className="form-group"><label className="form-label">Father Name</label><input className="input" placeholder="Enter father's name" /></div>
        </div>
        <div className="form-row-3">
          <div className="form-group"><label className="form-label">CNIC</label><input className="input mono" placeholder="XXXXX-XXXXXXX-X" /></div>
          <div className="form-group"><label className="form-label">Date of Birth</label><input className="input" type="date" /></div>
          <div className="form-group"><label className="form-label">Gender</label><select className="input select-input"><option>Male</option><option>Female</option></select></div>
        </div>
      </Section>

      <Section title="Contact Information">
        <div className="form-row">
          <div className="form-group"><label className="form-label">Contact 1</label><input className="input" placeholder="03XX-XXXXXXX" /></div>
          <div className="form-group"><label className="form-label">Contact 2</label><input className="input" placeholder="Optional" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Emergency Contact 1</label><input className="input" /></div>
          <div className="form-group"><label className="form-label">Emergency Contact 2</label><input className="input" placeholder="Optional" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Permanent Address</label><textarea className="input" rows={2} /></div>
          <div className="form-group"><label className="form-label">Postal Address</label><textarea className="input" rows={2} /></div>
        </div>
      </Section>

      <Section title="Bank Information">
        <div className="form-row">
          <div className="form-group"><label className="form-label">Bank Name</label><input className="input" placeholder="e.g. HBL, UBL" /></div>
          <div className="form-group"><label className="form-label">Bank Account Number</label><input className="input mono" placeholder="XXXX-XXXX-XXXX" /></div>
        </div>
      </Section>

      <Section title="Job Information">
        <div className="form-row-3">
          <div className="form-group"><label className="form-label">Department</label><select className="input select-input">{departments.map(d => <option key={d}>{d}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Designation</label><select className="input select-input">{designations.map(d => <option key={d}>{d}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Employment Type</label><select className="input select-input">{employmentTypes.map(d => <option key={d}>{d}</option>)}</select></div>
        </div>
        <div className="form-row-3">
          <div className="form-group"><label className="form-label">Job Status</label><select className="input select-input">{jobStatuses.map(d => <option key={d}>{d}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Work Mode</label><select className="input select-input">{workModes.map(d => <option key={d}>{d}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Work Location</label><select className="input select-input">{workLocations.map(d => <option key={d}>{d}</option>)}</select></div>
        </div>
        <div className="form-row-3">
          <div className="form-group"><label className="form-label">Shift</label><select className="input select-input">{shifts.map(s => <option key={s.name}>{s.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Date of Joining</label><input className="input" type="date" /></div>
          <div className="form-group"><label className="form-label">Date of Exit (optional)</label><input className="input" type="date" /></div>
        </div>
      </Section>

      <Section title="Medical Information">
        <div className="form-row">
          <div className="form-group"><label className="form-label">Blood Group</label><input className="input" placeholder="e.g. B+" /></div>
          <div className="form-group"><label className="form-label">Allergies</label><input className="input" placeholder="None" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Chronic Conditions</label><input className="input" placeholder="None" /></div>
          <div className="form-group"><label className="form-label">Current Medications</label><input className="input" placeholder="None" /></div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>Additional fields configurable from Settings → Custom Fields</div>
        <div style={{ marginTop: 12 }}>
          <DecisionBanner>
            DECISION NEEDED — Medical Info Permission<br />
            Can employees fill in their own medical information, or is this HR-only?<br />
            Please confirm in meeting.
          </DecisionBanner>
        </div>
      </Section>

      <Section title="Login Account">
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
            <input type="radio" checked={accountMethod === 'A'} onChange={() => setAccountMethod('A')} /> Option A: HR Creates Credentials
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
            <input type="radio" checked={accountMethod === 'B'} onChange={() => setAccountMethod('B')} /> Option B: Send Invite Link
          </label>
        </div>
        {accountMethod === 'A' ? (
          <div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Username</label><input className="input" placeholder="auto-generated" /></div>
              <div className="form-group"><label className="form-label">Temporary Password</label><input className="input" type="password" /></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
              <input type="checkbox" /> Send credentials via email
            </label>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Employee Email</label>
            <input className="input" type="email" placeholder="employee@company.com" />
            <button className="btn btn-secondary" style={{ marginTop: 8 }}>Send Invite Link</button>
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <DecisionBanner>
            DECISION NEEDED — Account Creation Method<br />
            Option A: HR creates login credentials manually.<br />
            Option B: System sends invite link, employee self-registers.<br />
            Please confirm which method to use.
          </DecisionBanner>
        </div>
      </Section>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/employees')}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Employee'}</button>
      </div>
    </div>
  );
}
