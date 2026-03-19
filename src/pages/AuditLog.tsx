import React, { useState } from 'react';
import { auditLog, getStatusColor } from '../data/dummyData';

const actionColors: Record<string, string> = { CREATE: 'pill-green', UPDATE: 'pill-blue', DELETE: 'pill-red', LOGIN: 'pill-steel', LOGOUT: 'pill-steel' };

export default function AuditLog() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Audit Log</div><div className="pg-sub">Track all system activities</div></div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="input" type="date" style={{ width: 150 }} />
          <input className="input" type="date" style={{ width: 150 }} />
          <select className="input select-input" style={{ width: 140 }}><option>All Users</option><option>Super Admin</option><option>HR1</option></select>
          <select className="input select-input" style={{ width: 140 }}><option>All Actions</option><option>CREATE</option><option>UPDATE</option><option>DELETE</option><option>LOGIN</option></select>
        </div>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Module</th><th>Record</th><th>Summary</th></tr></thead>
          <tbody>
            {auditLog.map((log) => (
              <React.Fragment key={log.id}>
                <tr style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
                  <td className="mono" style={{ fontSize: 11 }}>{log.timestamp}</td>
                  <td style={{ fontWeight: 600 }}>{log.user}</td>
                  <td><span className="pill pill-blue">{log.role}</span></td>
                  <td><span className={`pill ${actionColors[log.action] || 'pill-steel'}`}>{log.action}</span></td>
                  <td>{log.module}</td>
                  <td className="mono">{log.recordId}</td>
                  <td>{log.summary}</td>
                </tr>
                {expanded === log.id && log.before && (
                  <tr><td colSpan={7} style={{ background: 'var(--inp)', padding: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 12 }}>
                      <div><div style={{ fontWeight: 600, color: 'var(--t3)', marginBottom: 4 }}>BEFORE</div>{Object.entries(log.before).map(([k, v]) => <div key={k}>{k}: <span className="mono">{v}</span></div>)}</div>
                      <div><div style={{ fontWeight: 600, color: 'var(--t3)', marginBottom: 4 }}>AFTER</div>{log.after && Object.entries(log.after).map(([k, v]) => <div key={k} style={{ background: 'var(--amberl)', padding: '2px 4px', borderRadius: 3 }}>{k}: <span className="mono">{v}</span></div>)}</div>
                    </div>
                  </td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
