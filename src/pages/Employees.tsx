import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { getStatusColor } from "../data/dummyData";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToastContext } from "../contexts/ToastContext";

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
            style={{ background: "#fff176", padding: "0 2px", borderRadius: 2 }}
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

export default function Employees() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToastContext();
  const { employees, deleteEmployee, departments, jobStatuses, workModes } =
    useData();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);

  // Handle URL query parameter for highlighting specific employees
  useEffect(() => {
    const highlightParam = searchParams.get("highlight");
    if (highlightParam) {
      setHighlightIds(highlightParam.split(","));
    }
  }, [searchParams]);

  const filtered = employees.filter((e) => {
    const searchLower = search.toLowerCase();
    if (
      search &&
      !e.name.toLowerCase().includes(searchLower) &&
      !e.id.toLowerCase().includes(searchLower) &&
      !e.department.toLowerCase().includes(searchLower) &&
      !e.designation.toLowerCase().includes(searchLower) &&
      !e.jobStatus.toLowerCase().includes(searchLower)
    )
      return false;
    if (deptFilter && e.department !== deptFilter) return false;
    if (statusFilter && e.jobStatus !== statusFilter) return false;
    if (modeFilter && e.workMode !== modeFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="pg-head">
        <div>
          <div className="pg-greet">Employees</div>
          <div className="pg-sub">
            Manage all employees in your organization
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/employees/add")}
        >
          <Plus size={13} /> Add Employee
        </button>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--t3)",
              }}
            />
            <input
              className="input"
              style={{ paddingLeft: 32 }}
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input select-input"
            style={{ width: 160 }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            className="input select-input"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {jobStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className="input select-input"
            style={{ width: 140 }}
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
          >
            <option value="">All Work Modes</option>
            {workModes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: 40, color: "var(--t3)" }}
            >
              <Search
                size={32}
                style={{ margin: "0 auto 8px", opacity: 0.4 }}
              />
              <div style={{ fontSize: 13 }}>
                No employees found matching your search
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Shift</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    style={
                      highlightIds.includes(e.id)
                        ? {
                            background: "var(--amberl)",
                            borderLeft: "3px solid var(--amber)",
                          }
                        : {}
                    }
                  >
                    <td className="mono">
                      <HighlightText text={e.id} search={search} />
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <HighlightText text={e.name} search={search} />
                    </td>
                    <td>
                      <HighlightText text={e.department} search={search} />
                    </td>
                    <td>
                      <HighlightText text={e.designation} search={search} />
                    </td>
                    <td>{e.employmentType}</td>
                    <td>
                      <span className={`pill ${getStatusColor(e.jobStatus)}`}>
                        <HighlightText text={e.jobStatus} search={search} />
                      </span>
                    </td>
                    <td style={{ fontSize: 11.5 }}>{e.shift}</td>
                    <td className="mono">{e.dateOfJoining}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="ico-btn"
                          style={{ width: 28, height: 28 }}
                          onClick={() => navigate(`/employees/${e.id}`)}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="ico-btn"
                          style={{ width: 28, height: 28 }}
                          onClick={() => navigate(`/employees/edit/${e.id}`)}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="ico-btn"
                          style={{ width: 28, height: 28 }}
                          onClick={() => setDeleteTarget(e.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget}? This action cannot be undone.`}
        onConfirm={() => {
          deleteEmployee(deleteTarget!);
          showToast(`Employee ${deleteTarget} deleted`);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
