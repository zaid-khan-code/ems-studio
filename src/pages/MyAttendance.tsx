import React from 'react';
import { attendanceData } from '../data/dummyData';
import { Calendar } from 'lucide-react';
import { getStatusColor } from '../data/dummyData';

export default function MyAttendance() {
  return (
    <div>
      <div className="pg-head"><div><div className="pg-greet">My Attendance</div><div className="pg-sub">View your attendance history</div></div></div>
      <div className="card">
        <div className="ch"><div className="ct"><div className="ct-ico blue"><Calendar size={13} /></div>March 2026</div></div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {[{ l: 'Present', v: 5, c: 'pill-green' }, { l: 'Absent', v: 1, c: 'pill-red' }, { l: 'Late', v: 1, c: 'pill-amber' }].map((s, i) => <span key={i} className={`pill ${s.c}`}>{s.l}: {s.v}</span>)}
        </div>
        <table>
          <thead><tr><th>Date</th><th>Day</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Late By</th></tr></thead>
          <tbody>{attendanceData.map((a, i) => <tr key={i}><td className="mono">{a.date}</td><td>{a.day}</td><td className="mono">{a.checkIn}</td><td className="mono">{a.checkOut}</td><td><span className={`pill ${getStatusColor(a.status)}`}>{a.status}</span></td><td className="mono">{a.lateBy || '-'}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
