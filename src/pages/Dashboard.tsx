import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, UserCheck, CalendarDays, Clock, ArrowRight, AlertTriangle, Activity, Cake, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { payrollMonthly, deptAttendance, formatRs } from '../data/dummyData';
import DecisionBanner from '../components/DecisionBanner';

export default function Dashboard() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const kpis = [
    { label: 'Total Employees', value: '24', icon: Users, cls: 'k1' },
    { label: 'Present Today', value: '19', sub: '/ 24', icon: UserCheck, cls: 'k2' },
    { label: 'On Leave', value: '2', icon: CalendarDays, cls: 'k3' },
    { label: 'Late Today', value: '3', icon: Clock, cls: 'k4' },
  ];

  const pendingActions = [
    { text: '3 leave requests awaiting approval', action: 'Review →' },
    { text: 'March 2026 payroll not generated', action: 'Start →' },
    { text: 'Bank info missing EMP004 EMP005', action: 'Fix →' },
    { text: 'Attendance incomplete 3 employees', action: 'Mark →' },
  ];

  const urgentAlerts = [
    { name: 'Usman Malik', text: 'Contract expiry in 8 days', badge: 'URGENT', badgeCls: 'pill-red' },
    { name: 'Fatima Raza', text: 'Probation ends 12 days', badge: 'PROBATION', badgeCls: 'pill-amber' },
    { name: 'Bilal Ahmed', text: 'Bank info missing', badge: 'MISSING', badgeCls: 'pill-red' },
    { name: 'Ahmed Ali', text: 'Absent 3 days in a row', badge: 'ABSENT', badgeCls: 'pill-amber' },
    { name: 'March Payroll', text: 'Not generated', badge: 'PENDING', badgeCls: 'pill-blue' },
  ];

  const recentActivity = [
    { initials: 'SK', color: '#e67e22', text: "Sara Khan's leave approved", time: '2 hrs ago', by: 'Super Admin' },
    { initials: 'BA', color: '#1565c0', text: 'Bilal Ahmed added as EMP005', time: 'Yesterday', by: 'HR1' },
    { initials: 'PY', color: '#1b7a4e', text: 'Feb payroll generated', time: '2 days ago', by: 'Super Admin' },
    { initials: 'UM', color: '#b71c1c', text: "Usman's leave rejected", time: '3 days ago', by: 'HR1' },
    { initials: 'FR', color: '#00695c', text: 'Fatima salary updated', time: '4 days ago', by: 'Super Admin' },
  ];

  const birthdays = [
    { name: 'Ahmed Ali', date: 'Mar 15', daysAway: 0, initials: 'AA' },
    { name: 'Sara Khan', date: 'Mar 28', daysAway: 9, initials: 'SK' },
    { name: 'Usman Malik', date: 'Apr 3', daysAway: 15, initials: 'UM' },
    { name: 'Fatima Raza', date: 'Apr 19', daysAway: 31, initials: 'FR' },
  ];

  return (
    <div>
      <div className="pg-head">
        <div>
          <div className="pg-greet">{greeting}, {user?.username === 'superadmin' ? 'Admin' : 'HR'} 👋</div>
          <div className="pg-sub">Here's what's happening in your organization today</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="live-badge"><div className="live-dot" /> LIVE</div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        {kpis.map((k, i) => (
          <div key={i} className={`kpi-item ${k.cls}`}>
            <div className={`kpi-ico ${k.cls}`}><k.icon size={17} /></div>
            <div>
              <div className="kpi-val">{k.value}</div>
              <div className="kpi-lbl">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="g2">
        <div className="card">
          <div className="ch">
            <div className="ct"><div className="ct-ico blue"><Activity size={13} /></div>Monthly Payroll Cost</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={payrollMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8edf8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7590a8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#7590a8', fontFamily: 'IBM Plex Mono' }} tickFormatter={v => `${(v/1000)}k`} />
              <Tooltip formatter={(v: number) => formatRs(v)} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {payrollMonthly.map((_, i) => (
                  <Cell key={i} fill={i === payrollMonthly.length - 1 ? '#42a5f5' : '#1565c0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="ch">
            <div className="ct"><div className="ct-ico green"><Users size={13} /></div>Department Attendance Rate</div>
          </div>
          <div>
            {deptAttendance.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < deptAttendance.length - 1 ? '1px solid var(--br2)' : 'none' }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--t3)', width: 16 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 12.5, color: 'var(--t2)' }}>{d.dept}</span>
                <div style={{ width: 120, height: 6, background: 'var(--inp)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.rate}%`, height: '100%', borderRadius: 3, background: d.rate >= 90 ? 'var(--p)' : d.rate >= 75 ? 'var(--amber)' : 'var(--red)' }} />
                </div>
                <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: d.rate >= 90 ? 'var(--p)' : d.rate >= 75 ? 'var(--amber)' : 'var(--red)', width: 36 }}>{d.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three columns */}
      <div className="g3">
        <div className="card">
          <div className="ch">
            <div className="ct"><div className="ct-ico amber"><AlertTriangle size={13} /></div>Pending Actions</div>
            <span className="pill pill-amber">4</span>
          </div>
          {pendingActions.map((a, i) => (
            <div key={i} className="action-row">
              <span style={{ flex: 1 }}>{a.text}</span>
              <button className="btn btn-sm btn-ghost">{a.action}</button>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="ch">
            <div className="ct"><div className="ct-ico red"><AlertTriangle size={13} /></div>Urgent Alerts</div>
          </div>
          {urgentAlerts.map((a, i) => (
            <div key={i} className="action-row" style={{ gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--t1)' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>{a.text}</div>
              </div>
              <span className={`pill ${a.badgeCls}`}>{a.badge}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="ch">
            <div className="ct"><div className="ct-ico steel"><Activity size={13} /></div>Recent Activity</div>
          </div>
          {recentActivity.map((a, i) => (
            <div key={i} className="feed-item">
              <div className="feed-av" style={{ background: a.color, fontSize: 9 }}>{a.initials}</div>
              <div style={{ flex: 1 }}>
                <div className="feed-text">{a.text}</div>
                <div className="feed-time">{a.time} · {a.by}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Birthday Options */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 12 }}>Birthday Display — Stakeholder Options</div>
        <div className="g3">
          <BirthdayOptionA />
          <BirthdayOptionB birthdays={birthdays} />
          <BirthdayOptionC birthdays={birthdays} />
        </div>
        <DecisionBanner>
          DECISION NEEDED — Birthday Display Format<br />
          Which option do you prefer? A (calendar), B (list), or C (combined)?<br />
          Please confirm in meeting so we build the right version.
        </DecisionBanner>
      </div>
    </div>
  );
}

function BirthdayOptionA() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const birthdayDates = [15, 28];
  return (
    <div className="card">
      <div className="ch">
        <div className="ct"><div className="ct-ico blue"><Cake size={13} /></div>Option A — Calendar</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <ChevronLeft size={14} style={{ cursor: 'pointer', color: 'var(--t3)' }} />
        <span style={{ fontSize: 12, fontWeight: 600 }}>March 2026</span>
        <ChevronRight size={14} style={{ cursor: 'pointer', color: 'var(--t3)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 9, textAlign: 'center' }}>
        {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} style={{ fontWeight: 600, color: 'var(--t3)', padding: 4 }}>{d}</div>)}
        {/* March 2026 starts on Sunday */}
        {days.map(d => (
          <div key={d} style={{ padding: 4, borderRadius: 4, position: 'relative', background: birthdayDates.includes(d) ? 'var(--pl)' : 'transparent', fontWeight: birthdayDates.includes(d) ? 600 : 400, color: birthdayDates.includes(d) ? 'var(--p)' : 'var(--t2)', fontSize: 10.5 }}>
            {d}
            {birthdayDates.includes(d) && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--p)', margin: '2px auto 0' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function BirthdayOptionB({ birthdays }: { birthdays: any[] }) {
  return (
    <div className="card">
      <div className="ch">
        <div className="ct"><div className="ct-ico amber"><Cake size={13} /></div>Option B — List 🎂</div>
      </div>
      {birthdays.filter(b => b.daysAway <= 30).map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--br2)', background: b.daysAway === 0 ? 'var(--pl)' : 'transparent', borderRadius: 6, paddingLeft: b.daysAway === 0 ? 8 : 0 }}>
          <div className="feed-av" style={{ background: 'var(--p)', width: 28, height: 28, fontSize: 9 }}>{b.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{b.name}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--t3)' }}>{b.date}</div>
          </div>
          <span className={`pill ${b.daysAway === 0 ? 'pill-green' : 'pill-blue'}`}>
            {b.daysAway === 0 ? 'TODAY 🎂' : `In ${b.daysAway} days`}
          </span>
        </div>
      ))}
    </div>
  );
}

function BirthdayOptionC({ birthdays }: { birthdays: any[] }) {
  return (
    <div className="card">
      <div className="ch">
        <div className="ct"><div className="ct-ico green"><Cake size={13} /></div>Option C — Combined</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', marginBottom: 6 }}>CALENDAR</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, fontSize: 8.5, textAlign: 'center' }}>
            {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} style={{ fontWeight: 600, color: 'var(--t4)', padding: 2 }}>{d}</div>)}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <div key={d} style={{ padding: 2, fontSize: 9, color: [15, 28].includes(d) ? 'var(--p)' : 'var(--t3)', fontWeight: [15, 28].includes(d) ? 700 : 400 }}>{d}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t3)', marginBottom: 6 }}>THIS MONTH</div>
          {birthdays.filter(b => b.date.startsWith('Mar')).map((b, i) => (
            <div key={i} style={{ fontSize: 11, padding: '4px 0', borderBottom: '1px solid var(--br2)' }}>
              <span style={{ fontWeight: 600 }}>{b.name}</span>
              <span className="mono" style={{ fontSize: 9, color: 'var(--t3)', marginLeft: 6 }}>{b.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
