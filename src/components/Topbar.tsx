import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Search, Bell, X } from "lucide-react";

const routeNames: Record<string, string> = {
  "/dashboard": "Command Center",
  "/employees": "Employees",
  "/employees/add": "Add Employee",
  "/attendance": "Attendance",
  "/leave": "Leave Management",
  "/payroll": "Payroll",
  "/promotions": "Promotions",
  "/accounts": "HR Accounts",
  "/audit-log": "Audit Log",
  "/deductions": "Deductions",
  "/my-dashboard": "My Dashboard",
  "/my-attendance": "My Attendance",
  "/my-payslips": "My Payslips",
  "/my-leave": "Leave",
  "/my-profile": "My Profile",
};

// Helper function to highlight matching text
function HighlightText({ text, search }: { text: string; search: string }) {
  if (!search.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{ background: "#fff176", padding: "0 1px", borderRadius: 2 }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function Topbar() {
  const { user, activeRole, switchRole } = useAuth();
  const { employees } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageName =
    routeNames[location.pathname] ||
    (location.pathname.startsWith("/settings/")
      ? location.pathname
          .split("/")
          .pop()
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Page") ||
    (location.pathname.startsWith("/employees/") ? "Employee Detail" : "Page");

  const dateStr = time.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Filter employees based on search query
  const filteredEmployees = searchQuery.trim()
    ? employees
        .filter((e) => {
          const query = searchQuery.toLowerCase();
          return (
            e.name.toLowerCase().includes(query) ||
            e.id.toLowerCase().includes(query) ||
            e.department.toLowerCase().includes(query) ||
            e.designation.toLowerCase().includes(query)
          );
        })
        .slice(0, 6)
    : [];

  const handleSelectEmployee = (empId: string) => {
    navigate(`/employees/${empId}`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const isEmployee = activeRole === "employee";

  return (
    <div className="topbar">
      <div className="bc">
        <span className="bc-home">HR Pro ERP</span>
        <span className="bc-sep">·</span>
        <span className="bc-cur">{pageName}</span>
      </div>

      {/* Search bar - hidden for employee role */}
      {!isEmployee && (
        <div
          ref={searchRef}
          style={{ position: "relative", marginLeft: "auto", marginRight: 8 }}
        >
          <div
            className="topbar-search"
            style={{
              cursor: "text",
              background: isFocused ? "var(--card)" : undefined,
              borderColor: isFocused ? "var(--p)" : undefined,
            }}
            onClick={() => setIsFocused(true)}
          >
            <Search size={13} style={{ color: "var(--t3)", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search employees by name, ID, department..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.trim().length > 0);
              }}
              onFocus={() => {
                setIsFocused(true);
                if (searchQuery.trim()) setShowDropdown(true);
              }}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 12,
                color: "var(--t1)",
                flex: 1,
                minWidth: 180,
              }}
            />
            {searchQuery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery("");
                  setShowDropdown(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                }}
              >
                <X size={12} style={{ color: "var(--t3)" }} />
              </button>
            )}
            <kbd>⌘K</kbd>
          </div>

          {/* Search dropdown */}
          {showDropdown && filteredEmployees.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 4,
                background: "var(--card)",
                border: "1px solid var(--br)",
                borderRadius: "var(--rsm)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
                maxHeight: 320,
                overflow: "auto",
              }}
            >
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => handleSelectEmployee(emp.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--br2)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--inp)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--p)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {emp.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>
                      <HighlightText text={emp.name} search={searchQuery} />
                    </div>
                    <div style={{ fontSize: 11, color: "var(--t3)" }}>
                      <HighlightText text={emp.id} search={searchQuery} /> ·{" "}
                      <HighlightText
                        text={emp.department}
                        search={searchQuery}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--t3)" }}>
                    <HighlightText
                      text={emp.designation}
                      search={searchQuery}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {showDropdown &&
            searchQuery.trim() &&
            filteredEmployees.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  background: "var(--card)",
                  border: "1px solid var(--br)",
                  borderRadius: "var(--rsm)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  padding: 16,
                  textAlign: "center",
                  color: "var(--t3)",
                  fontSize: 12,
                }}
              >
                No employees found matching "{searchQuery}"
              </div>
            )}
        </div>
      )}

      {isEmployee && <div style={{ flex: 1 }} />}

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          className="pill pill-blue"
          style={{ fontSize: 9, cursor: "pointer" }}
        >
          ● FY 2025–26
        </span>
        <span
          className="pill pill-blue"
          style={{ fontSize: 9, cursor: "pointer" }}
        >
          ● Q4
        </span>
      </div>

      <div className="topbar-right">
        <div className="role-switcher">
          {(["hr", "super_admin", "employee"] as const).map((role) => (
            <button
              key={role}
              className={activeRole === role ? "active" : ""}
              onClick={() => switchRole(role)}
            >
              {role === "hr"
                ? "HR"
                : role === "super_admin"
                  ? "Super Admin"
                  : "Employee"}
            </button>
          ))}
        </div>
        <span className="tdate">{dateStr}</span>
        <div className="ico-btn">
          <Bell size={14} />
          <div className="n-pip" />
        </div>
        <div className="t-av">
          {user?.username?.substring(0, 2).toUpperCase() || "SA"}
        </div>
      </div>
    </div>
  );
}
