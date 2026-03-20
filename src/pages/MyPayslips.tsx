import React from 'react';
import { formatPKR } from '../data/dummyData';

export default function MyPayslips() {
  const payslips = [
    { period: 'March 2026', gross: 195000, net: 178000, status: 'Draft' },
    { period: 'February 2026', gross: 195000, net: 178000, status: 'Finalized' },
    { period: 'January 2026', gross: 185000, net: 170000, status: 'Finalized' },
  ];
  return (
    <div>
      <div className="pg-head"><div><div className="pg-greet">My Payslips</div><div className="pg-sub">View your salary details</div></div></div>
      <div className="card">
        <table>
          <thead><tr><th>Period</th><th>Gross</th><th>Net</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{payslips.map((p, i) => <tr key={i}><td>{p.period}</td><td className="mono">{formatPKR(p.gross)}</td><td className="mono" style={{ fontWeight: 600, color: 'var(--green)' }}>{formatPKR(p.net)}</td><td><span className={`pill ${p.status === 'Finalized' ? 'pill-green' : 'pill-amber'}`}>{p.status}</span></td><td><button className="btn btn-sm btn-ghost">View</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
