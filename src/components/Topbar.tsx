import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Bell, Calendar } from 'lucide-react';

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/employees/add': 'Add Employee',
  '/attendance': 'Attendance',
  '/leave': 'Leave Management',
  '/payroll': 'Payroll',
  '/promotions': 'Promotions',
  '/accounts': 'HR Accounts',
  '/audit-log': 'Audit Log',
  '/my-dashboard': 'My Dashboard',
  '/my-attendance': 'My Attendance',
  '/my-payslips': 'My Payslips',
  '/my-leave': 'Leave',
  '/my-profile': 'My Profile',
};

export default function Topbar() {
  const { activeRole, switchRole } = useAuth();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pageName = routeNames[location.pathname] ||
    (location.pathname.startsWith('/settings/') ? location.pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Page') ||
    'Page';

  const dateStr = time.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' PKT';

  return (
    <div className="topbar">
      <div className="bc">
        <span className="bc-home">EMS</span>
        <span className="bc-sep">/</span>
        <span className="bc-cur">{pageName}</span>
      </div>

      <div className="topbar-search">
        <Search size={13} style={{ color: 'var(--t3)' }} />
        <span>Search…</span>
        <kbd>⌘K</kbd>
      </div>

      <div className="topbar-right">
        <div className="role-switcher">
          {(['hr', 'super_admin', 'employee'] as const).map(role => (
            <button
              key={role}
              className={activeRole === role ? 'active' : ''}
              onClick={() => switchRole(role)}
            >
              {role === 'hr' ? 'HR' : role === 'super_admin' ? 'Super Admin' : 'Employee'}
            </button>
          ))}
        </div>
        <span className="tdate">{dateStr}</span>
        <span className="tdate">{timeStr}</span>
        <div className="ico-btn">
          <Bell size={14} />
          <div className="n-pip" />
        </div>
        <div className="t-av">SA</div>
      </div>
    </div>
  );
}
