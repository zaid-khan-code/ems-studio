import React from 'react';
import { leaveRequests, getStatusColor } from '../data/dummyData';

export default function MyLeave() {
  const myLeaves = leaveRequests.filter(l => l.empId === 'EMP001');
  return (
    <div>
      <div className="pg-head"><div><div className="pg-greet">My Leave</div><div className="pg-sub">View and apply for leave</div></div></div>
      <div className="card">
        <table>
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>{myLeaves.map((l, i) => <tr key={i}><td>{l.leaveType}</td><td className="mono">{l.from}</td><td className="mono">{l.to}</td><td className="mono">{l.days}</td><td>{l.reason}</td><td><span className={`pill ${getStatusColor(l.status)}`}>{l.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
