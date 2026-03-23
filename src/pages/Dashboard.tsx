import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  CalendarDays,
  AlertTriangle,
  Activity,
  Cake,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Briefcase,
  BarChart3,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { formatPKR } from "../data/dummyData";
import DecisionBanner from "../components/DecisionBanner";

const deptDistribution = [
  { name: "Engineering", value: 84, color: "#1565c0" },
  { name: "Sales", value: 49, color: "#1b7a4e" },
  { name: "Marketing", value: 45, color: "#b06000" },
  { name: "HR", value: 34, color: "#00695c" },
  { name: "Finance", value: 35, color: "#37474f" },
];

const empTypeDistribution = [
  { name: "Full Time", value: 146, color: "#1565c0" },
  { name: "Part Time", value: 55, color: "#1b7a4e" },
  { name: "Contract", value: 32, color: "#b06000" },
  { name: "Intern", value: 14, color: "#00695c" },
];

const monthlyAttendance = [
  { month: "Oct", present: 205, absent: 30, pct: 87 },
  { month: "Nov", present: 192, absent: 45, pct: 81 },
  { month: "Dec", present: 180, absent: 57, pct: 76 },
  { month: "Jan", present: 220, absent: 17, pct: 93 },
  { month: "Feb", present: 215, absent: 22, pct: 91 },
  { month: "Mar", present: 218, absent: 29, pct: 88 },
];

const headcountGrowth = [
  { month: "Oct", count: 214 },
  { month: "Nov", count: 224 },
  { month: "Dec", count: 228 },
  { month: "Jan", count: 236 },
  { month: "Feb", count: 242 },
  { month: "Mar", count: 247 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = time.toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = time.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const total = 247;

  const pendingActions = [
    {
      text: "3 leave requests awaiting approval",
      action: "Review →",
      emoji: "📋",
      onClick: () => navigate("/leave?tab=pending"),
    },
    {
      text: "Attendance incomplete 3 employees",
      action: "Mark →",
      emoji: "⏰",
      onClick: () => navigate("/attendance?highlight=unmarked"),
    },
    {
      text: "Bank info missing EMP004, EMP005",
      action: "Fix →",
      emoji: "🏦",
      onClick: () => navigate("/employees?highlight=EMP004,EMP005"),
    },
  ];

  const urgentAlerts = [
    {
      name: "Usman Malik",
      text: "Contract expiry in 8 days",
      badge: "URGENT",
      badgeCls: "pill-red",
    },
    {
      name: "Fatima Raza",
      text: "Probation ends in 12 days",
      badge: "PROBATION",
      badgeCls: "pill-amber",
    },
    {
      name: "Bilal Ahmed",
      text: "Bank info missing",
      badge: "MISSING",
      badgeCls: "pill-red",
    },
    {
      name: "Ahmed Ali",
      text: "Absent 3 days in a row",
      badge: "ABSENT",
      badgeCls: "pill-amber",
    },
  ];

  const recentActivity = [
    {
      initials: "SK",
      color: "#e67e22",
      text: "Sara Khan's leave approved",
      time: "2 hrs ago",
      by: "Super Admin",
      badge: "Approved",
      badgeCls: "pill-green",
    },
    {
      initials: "BA",
      color: "#1565c0",
      text: "Bilal Ahmed added as EMP005",
      time: "Yesterday",
      by: "HR1",
      badge: "New Hire",
      badgeCls: "pill-blue",
    },
    {
      initials: "UM",
      color: "#b71c1c",
      text: "Usman's leave rejected",
      time: "3 days ago",
      by: "HR1",
      badge: "Rejected",
      badgeCls: "pill-red",
    },
    {
      initials: "FR",
      color: "#00695c",
      text: "Fatima salary updated",
      time: "4 days ago",
      by: "Super Admin",
      badge: "Updated",
      badgeCls: "pill-steel",
    },
  ];

  const birthdays = [
    { name: "Ahmed Ali", date: "Mar 15", daysAway: 0, initials: "AA" },
    { name: "Sara Khan", date: "Mar 28", daysAway: 9, initials: "SK" },
    { name: "Usman Malik", date: "Apr 3", daysAway: 15, initials: "UM" },
    { name: "Fatima Raza", date: "Apr 19", daysAway: 31, initials: "FR" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="pg-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="pg-greet">
              {greeting}, {user?.username === "superadmin" ? "Admin" : "HR"} 👋
            </div>
            <div className="live-badge">
              <div className="live-dot" /> LIVE
            </div>
          </div>
          <div className="pg-sub" style={{ marginTop: 4 }}>
            📅 {dateStr} · 🕐 <span className="mono">{timeStr}</span> PKT ·
            ESSPL · Electronic Safety & Security (Pvt.) Ltd
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/employees/add")}
          >
            <Plus size={13} /> Add Employee
          </button>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <StatCard
          icon={<Users size={18} />}
          iconBg="var(--pl)"
          iconColor="var(--p)"
          borderColor="var(--p)"
          value="247"
          label="Total Employees"
          trend="↑ 2.4%"
          trendColor="var(--green)"
          trendBg="var(--greenl)"
          sub="+6 this month · 5 depts"
        />
        <StatCard
          icon={<UserCheck size={18} />}
          iconBg="var(--greenl)"
          iconColor="var(--green)"
          borderColor="var(--green)"
          value="218"
          label="Present Today"
          trend="↑ 3.1%"
          trendColor="var(--green)"
          trendBg="var(--greenl)"
          sub="88.3% rate · 17 late"
        />
        <StatCard
          icon={<CalendarDays size={18} />}
          iconBg="var(--amberl)"
          iconColor="var(--amber)"
          borderColor="var(--amber)"
          value="12"
          label="On Leave Today"
          trend="— same"
          trendColor="var(--steel)"
          trendBg="var(--steell)"
          sub="3 pending · 9 approved"
        />
      </div>

      {/* Donut Charts */}
      <div className="g2">
        <DonutCard
          title="Employees by Department"
          icon={<Users size={13} />}
          data={deptDistribution}
          total={total}
        />
        <DonutCard
          title="By Employment Type"
          icon={<Briefcase size={13} />}
          data={empTypeDistribution}
          total={total}
        />
      </div>

      {/* Bar + Line Charts */}
      <div className="g2">
        <div className="card">
          <div className="ch">
            <div className="ct">
              <div className="ct-ico blue">
                <BarChart3 size={13} />
              </div>
              Monthly Attendance
            </div>
            <select
              className="select-input"
              style={{ width: "auto", padding: "4px 8px", fontSize: 10 }}
            >
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyAttendance} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8edf8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7590a8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#7590a8" }} />
              <Tooltip />
              <Bar
                dataKey="present"
                name="Present"
                fill="#1565c0"
                radius={[3, 3, 0, 0]}
                barSize={16}
              />
              <Bar
                dataKey="absent"
                name="Absent"
                fill="#e53935"
                radius={[3, 3, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 8,
            }}
          >
            {monthlyAttendance.map((m, i) => (
              <span
                key={i}
                className="mono"
                style={{
                  fontSize: 10,
                  color:
                    m.pct >= 90
                      ? "var(--green)"
                      : m.pct >= 80
                        ? "var(--amber)"
                        : "var(--red)",
                }}
              >
                {m.pct}%
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="ch">
            <div className="ct">
              <div className="ct-ico green">
                <TrendingUp size={13} />
              </div>
              Headcount Growth
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={headcountGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8edf8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7590a8" }} />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "#7590a8",
                  fontFamily: "IBM Plex Mono",
                }}
                domain={["dataMin - 10", "dataMax + 5"]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00695c"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#00695c" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Birthday Options */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--t1)",
            marginBottom: 12,
          }}
        >
          Birthday Display — Stakeholder Options
        </div>
        <div className="g3">
          <BirthdayOptionA />
          <BirthdayOptionB birthdays={birthdays} />
          <BirthdayOptionC birthdays={birthdays} />
        </div>
        <DecisionBanner>
          DECISION NEEDED — Birthday Display Format
          <br />
          Which option do you prefer? A (calendar), B (list), or C (combined)?
          <br />
          Please confirm in meeting so we build the right version.
        </DecisionBanner>
      </div>

      {/* Three columns */}
      <div className="g3">
        <div className="card">
          <div className="ch">
            <div className="ct">
              <div className="ct-ico amber">
                <AlertTriangle size={13} />
              </div>
              Pending Actions
            </div>
            <span className="pill pill-amber">{pendingActions.length}</span>
          </div>
          {pendingActions.map((a, i) => (
            <div key={i} className="action-row">
              <span style={{ marginRight: 6 }}>{a.emoji}</span>
              <span style={{ flex: 1 }}>{a.text}</span>
              <button className="btn btn-sm btn-ghost" onClick={a.onClick}>
                {a.action}
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="ch">
            <div className="ct">
              <div className="ct-ico red">
                <AlertTriangle size={13} />
              </div>
              Urgent Alerts
            </div>
          </div>
          {urgentAlerts.map((a, i) => (
            <div key={i} className="action-row" style={{ gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "var(--t1)",
                  }}
                >
                  {a.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--t3)" }}>{a.text}</div>
              </div>
              <span className={`pill ${a.badgeCls}`}>{a.badge}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="ch">
            <div className="ct">
              <div className="ct-ico steel">
                <Activity size={13} />
              </div>
              Recent Activity
            </div>
          </div>
          {recentActivity.map((a, i) => (
            <div key={i} className="feed-item">
              <div
                className="feed-av"
                style={{ background: a.color, fontSize: 9 }}
              >
                {a.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div className="feed-text">{a.text}</div>
                <div className="feed-time">
                  {a.time} · {a.by}
                </div>
              </div>
              <span className={`pill ${a.badgeCls}`} style={{ fontSize: 9 }}>
                {a.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Stat Card */
function StatCard({
  icon,
  iconBg,
  iconColor,
  borderColor,
  value,
  label,
  trend,
  trendColor,
  trendBg,
  sub,
}: any) {
  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        padding: "16px 18px",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 12, right: 14 }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: 12,
            background: trendBg,
            color: trendColor,
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {trend}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: iconBg,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div>
          <div
            className="mono"
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "var(--t1)",
              lineHeight: 1,
            }}
          >
            {value}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--t2)" }}>
        {label}
      </div>
      <div
        className="mono"
        style={{ fontSize: 10, color: "var(--t3)", marginTop: 2 }}
      >
        {sub}
      </div>
    </div>
  );
}

/* Donut Card */
function DonutCard({
  title,
  icon,
  data,
  total,
}: {
  title: string;
  icon: React.ReactNode;
  data: any[];
  total: number;
}) {
  return (
    <div className="card">
      <div className="ch">
        <div className="ct">
          <div className="ct-ico blue">{icon}</div>
          {title}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            position: "relative",
            width: 160,
            height: 160,
            flexShrink: 0,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                dataKey="value"
                stroke="none"
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => v} />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              className="mono"
              style={{ fontSize: 18, fontWeight: 800, color: "var(--t1)" }}
            >
              {total}
            </div>
            <div
              style={{
                fontSize: 8,
                color: "var(--t3)",
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              HEADCOUNT
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {data.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                borderBottom:
                  i < data.length - 1 ? "1px solid var(--br2)" : "none",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: d.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 12, color: "var(--t2)" }}>
                {d.name}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--t1)",
                  width: 28,
                }}
              >
                {d.value}
              </span>
              <span
                className="mono"
                style={{ fontSize: 10, color: "var(--t3)", width: 30 }}
              >
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Birthday Options */
function BirthdayOptionA() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const birthdayDates = [15, 28];
  return (
    <div className="card">
      <div className="ch">
        <div className="ct">
          <div className="ct-ico blue">
            <Cake size={13} />
          </div>
          Option A — Calendar
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <ChevronLeft
          size={14}
          style={{ cursor: "pointer", color: "var(--t3)" }}
        />
        <span style={{ fontSize: 12, fontWeight: 600 }}>March 2026</span>
        <ChevronRight
          size={14}
          style={{ cursor: "pointer", color: "var(--t3)" }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          fontSize: 9,
          textAlign: "center",
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            style={{ fontWeight: 600, color: "var(--t3)", padding: 4 }}
          >
            {d}
          </div>
        ))}
        {days.map((d) => (
          <div
            key={d}
            style={{
              padding: 4,
              borderRadius: 4,
              background: birthdayDates.includes(d)
                ? "var(--pl)"
                : "transparent",
              fontWeight: birthdayDates.includes(d) ? 600 : 400,
              color: birthdayDates.includes(d) ? "var(--p)" : "var(--t2)",
              fontSize: 10.5,
            }}
          >
            {d}
            {birthdayDates.includes(d) && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--p)",
                  margin: "2px auto 0",
                }}
              />
            )}
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
        <div className="ct">
          <div className="ct-ico amber">
            <Cake size={13} />
          </div>
          Option B — List 🎂
        </div>
      </div>
      {birthdays
        .filter((b) => b.daysAway <= 30)
        .map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid var(--br2)",
              background: b.daysAway === 0 ? "var(--pl)" : "transparent",
              borderRadius: 6,
              paddingLeft: b.daysAway === 0 ? 8 : 0,
            }}
          >
            <div
              className="feed-av"
              style={{
                background: "var(--p)",
                width: 28,
                height: 28,
                fontSize: 9,
              }}
            >
              {b.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{b.name}</div>
              <div
                className="mono"
                style={{ fontSize: 10, color: "var(--t3)" }}
              >
                {b.date}
              </div>
            </div>
            <span
              className={`pill ${b.daysAway === 0 ? "pill-green" : "pill-blue"}`}
            >
              {b.daysAway === 0 ? "TODAY 🎂" : `In ${b.daysAway} days`}
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
        <div className="ct">
          <div className="ct-ico green">
            <Cake size={13} />
          </div>
          Option C — Combined
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--t3)",
              marginBottom: 6,
            }}
          >
            CALENDAR
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              fontSize: 8.5,
              textAlign: "center",
            }}
          >
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                style={{ fontWeight: 600, color: "var(--t4)", padding: 2 }}
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <div
                key={d}
                style={{
                  padding: 2,
                  fontSize: 9,
                  color: [15, 28].includes(d) ? "var(--p)" : "var(--t3)",
                  fontWeight: [15, 28].includes(d) ? 700 : 400,
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--t3)",
              marginBottom: 6,
            }}
          >
            THIS MONTH
          </div>
          {birthdays
            .filter((b) => b.date.startsWith("Mar"))
            .map((b, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  padding: "4px 0",
                  borderBottom: "1px solid var(--br2)",
                }}
              >
                <span style={{ fontWeight: 600 }}>{b.name}</span>
                <span
                  className="mono"
                  style={{ fontSize: 9, color: "var(--t3)", marginLeft: 6 }}
                >
                  {b.date}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
