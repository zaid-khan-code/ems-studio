import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Bell } from 'lucide-react';

const routeNames: Record<string, string> = {
  '/dashboard': 'Command Center',
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
  const { user, activeRole, switchRole } = useAuth();
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

  return (
    <div className="topbar">
      <div className="bc">
        <span className="bc-home">HR Pro ERP</span>
        <span className="bc-sep">·</span>
        <span className="bc-cur">{pageName}</span>
      </div>

      <div className="topbar-search" style={{ marginLeft: 'auto', marginRight: 8 }}>
        <Search size={13} style={{ color: 'var(--t3)' }} />
        <span>Search employees, records, reports...</span>
        <kbd>⌘K</kbd>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="pill pill-blue" style={{ fontSize: 9, cursor: 'pointer' }}>● FY 2025–26</span>
        <span className="pill pill-blue" style={{ fontSize: 9, cursor: 'pointer' }}>● Q4</span>
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
        <div className="ico-btn">
          <Bell size={14} />
          <div className="n-pip" />
        </div>
        <div className="t-av">{user?.username?.substring(0, 2).toUpperCase() || 'SA'}</div>
      </div>
    </div>
  );
}
