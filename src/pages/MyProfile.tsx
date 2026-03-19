import React from 'react';
import { employees } from '../data/dummyData';

export default function MyProfile() {
  const emp = employees[0];
  return (
    <div>
      <div className="pg-head"><div><div className="pg-greet">My Profile</div><div className="pg-sub">View your personal information</div></div></div>
      <div className="card" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="avatar avatar-lg" style={{ background: 'var(--p)' }}>{emp.avatar}</div>
        <div><div style={{ fontSize: 18, fontWeight: 800 }}>{emp.name}</div><div className="mono" style={{ fontSize: 11, color: 'var(--t3)' }}>{emp.id} · {emp.department} · {emp.designation}</div></div>
      </div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[['Full Name', emp.name], ['Father Name', emp.fatherName], ['DOB', emp.dob], ['CNIC', emp.cnic], ['Gender', emp.gender], ['Contact', emp.contact1], ['Department', emp.department], ['Designation', emp.designation], ['Work Mode', emp.workMode], ['Shift', emp.shift], ['Joined', emp.dateOfJoining], ['Blood Group', emp.bloodGroup]].map(([l, v], i) => (
            <div key={i}><div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 4 }}>{l}</div><div style={{ fontSize: 13 }}>{v}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
