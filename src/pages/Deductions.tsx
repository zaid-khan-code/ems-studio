import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { formatPKR } from "../data/dummyData";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DecisionBanner from "../components/DecisionBanner";
import { useToastContext } from "../contexts/ToastContext";

interface Deduction {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  amount: number;
  month: string;
  year: number;
  reason: string;
  violations: string[];
  appliedBy: string;
  date: string;
}

const DEDUCTION_TYPES = [
  "Penalty — Rule Violation",
  "Penalty — Dress Code Violation",
  "Penalty — Eating at Desk",
  "Penalty — Smoking in Premises",
  "Penalty — Late Arrival (3+ days)",
  "Loan Installment",
  "Advance Recovery",
  "Other",
];

const VIOLATION_OPTIONS = [
  "Drinking in office environment",
  "Not wearing office dress code (Male)",
  "Not wearing office dress code (Female)",
  "Eating at desk",
  "Smoking on premises",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function load<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Deductions() {
  const { employees } = useData();
  const { showToast } = useToastContext();
  const [deductions, setDeductions] = useState<Deduction[]>(() =>
    load("ems_deductions", []),
  );
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState<Deduction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form state
  const [selectedEmp, setSelectedEmp] = useState("");
  const [selectedType, setSelectedType] = useState(DEDUCTION_TYPES[0]);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("March");
  const [year, setYear] = useState(2026);
  const [reason, setReason] = useState("");
  const [violations, setViolations] = useState<boolean[]>(
    VIOLATION_OPTIONS.map(() => false),
  );
  const [otherViolation, setOtherViolation] = useState("");

  // Persist deductions to localStorage
  useEffect(() => {
    save("ems_deductions", deductions);
  }, [deductions]);

  const isPenaltyType = selectedType.startsWith("Penalty");

  const resetForm = () => {
    setSelectedEmp("");
    setSelectedType(DEDUCTION_TYPES[0]);
    setAmount("");
    setMonth("March");
    setYear(2026);
    setReason("");
    setViolations(VIOLATION_OPTIONS.map(() => false));
    setOtherViolation("");
  };

  const handleAdd = () => {
    if (!selectedEmp || !amount) {
      showToast("Please fill required fields", "error");
      return;
    }
    const emp = employees.find((e) => e.id === selectedEmp);
    const selectedViolations = VIOLATION_OPTIONS.filter(
      (_, i) => violations[i],
    );
    if (otherViolation.trim()) selectedViolations.push(otherViolation);

    const newDeduction: Deduction = {
      id: "DED" + String(Date.now()).slice(-6),
      employeeId: selectedEmp,
      employeeName: emp?.name || "",
      type: selectedType,
      amount: parseFloat(amount),
      month,
      year,
      reason,
      violations: selectedViolations,
      appliedBy: "HR1",
      date: new Date().toISOString().split("T")[0],
    };
    setDeductions((prev) => [newDeduction, ...prev]);
    showToast("Deduction applied");
    setModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editModal) return;
    const emp = employees.find((e) => e.id === selectedEmp);
    const selectedViolations = VIOLATION_OPTIONS.filter(
      (_, i) => violations[i],
    );
    if (otherViolation.trim()) selectedViolations.push(otherViolation);

    setDeductions((prev) =>
      prev.map((d) =>
        d.id === editModal.id
          ? {
              ...d,
              employeeId: selectedEmp,
              employeeName: emp?.name || "",
              type: selectedType,
              amount: parseFloat(amount),
              month,
              year,
              reason,
              violations: selectedViolations,
            }
          : d,
      ),
    );
    showToast("Deduction updated");
    setEditModal(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeductions((prev) => prev.filter((d) => d.id !== deleteTarget));
    showToast("Deduction deleted");
    setDeleteTarget(null);
  };

  const openEdit = (d: Deduction) => {
    setSelectedEmp(d.employeeId);
    setSelectedType(d.type);
    setAmount(String(d.amount));
    setMonth(d.month);
    setYear(d.year);
    setReason(d.reason);
    const newViolations = VIOLATION_OPTIONS.map((v) =>
      d.violations.includes(v),
    );
    setViolations(newViolations);
    const other = d.violations.find((v) => !VIOLATION_OPTIONS.includes(v));
    setOtherViolation(other || "");
    setEditModal(d);
  };

  // Summary calculations
  const currentMonth = deductions.filter(
    (d) => d.month === "March" && d.year === 2026,
  );
  const totalThisMonth = currentMonth.reduce((sum, d) => sum + d.amount, 0);
  const penaltyTotal = currentMonth
    .filter((d) => d.type.startsWith("Penalty"))
    .reduce((sum, d) => sum + d.amount, 0);
  const loanTotal = currentMonth
    .filter((d) => d.type === "Loan Installment")
    .reduce((sum, d) => sum + d.amount, 0);
  const advanceTotal = currentMonth
    .filter((d) => d.type === "Advance Recovery")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div className="pg-head">
        <div>
          <div className="pg-greet">Deductions</div>
          <div className="pg-sub">
            Manage employee deductions, penalties, and recoveries
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setModal(true);
          }}
        >
          <Plus size={13} /> Add Deduction
        </button>
      </div>

      <DecisionBanner>
        ⚠ DECISION NEEDED — Dress Code & Violation Penalties
        <br />
        Penalty fine amounts for dress code and rule violations have not been
        decided.
        <br />
        Options: Fixed fine per violation / Variable amount HR enters each time.
        <br />
        Please confirm in meeting.
      </DecisionBanner>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginTop: 12,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Total Deductions This Month",
            value: totalThisMonth,
            color: "var(--red)",
          },
          {
            label: "Penalty Deductions",
            value: penaltyTotal,
            color: "var(--amber)",
          },
          { label: "Loan Deductions", value: loanTotal, color: "var(--p)" },
          {
            label: "Advance Deductions",
            value: advanceTotal,
            color: "var(--teal)",
          },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 4 }}>
              {s.label}
            </div>
            <div
              className="mono"
              style={{ fontSize: 20, fontWeight: 800, color: s.color }}
            >
              {formatPKR(s.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {deductions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--t3)" }}>
            <div style={{ fontSize: 13 }}>
              No deductions recorded yet. Click "Add Deduction" to create one.
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Deduction Type</th>
                <th>Amount</th>
                <th>Month</th>
                <th>Reason</th>
                <th>Applied By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deductions.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.employeeName}</div>
                    <div
                      className="mono"
                      style={{ fontSize: 10, color: "var(--t3)" }}
                    >
                      {d.employeeId}
                    </div>
                  </td>
                  <td>{d.type}</td>
                  <td
                    className="mono"
                    style={{ color: "var(--red)", fontWeight: 600 }}
                  >
                    {formatPKR(d.amount)}
                  </td>
                  <td>
                    {d.month} {d.year}
                  </td>
                  <td
                    style={{
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.reason || d.violations.join(", ") || "-"}
                  </td>
                  <td>{d.appliedBy}</td>
                  <td className="mono">{d.date}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="ico-btn"
                        style={{ width: 28, height: 28 }}
                        onClick={() => openEdit(d)}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="ico-btn"
                        style={{ width: 28, height: 28 }}
                        onClick={() => setDeleteTarget(d.id)}
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

      {/* Add Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Add Deduction"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAdd}>
              Apply Deduction
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Employee *</label>
          <select
            className="input select-input"
            value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)}
          >
            <option value="">Select employee...</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.id})
              </option>
            ))}
          </select>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div className="form-group">
            <label className="form-label">Month</label>
            <select
              className="input select-input"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              className="input mono"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Deduction Type</label>
          <select
            className="input select-input"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {DEDUCTION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        {isPenaltyType && (
          <div
            style={{
              background: "var(--inp)",
              padding: 12,
              borderRadius: "var(--rsm)",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--t3)",
                marginBottom: 8,
              }}
            >
              VIOLATION DETAILS
            </div>
            {VIOLATION_OPTIONS.map((v, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 0",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={violations[i]}
                  onChange={(e) => {
                    const n = [...violations];
                    n[i] = e.target.checked;
                    setViolations(n);
                  }}
                />
                {v}
              </label>
            ))}
            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">Other (specify)</label>
              <input
                className="input"
                value={otherViolation}
                onChange={(e) => setOtherViolation(e.target.value)}
                placeholder="Enter other violation..."
              />
            </div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Amount (PKR) *</label>
          <input
            className="input mono"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Reason / Notes</label>
          <textarea
            className="input"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editModal}
        onClose={() => {
          setEditModal(null);
          resetForm();
        }}
        title="Edit Deduction"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditModal(null);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEdit}>
              Save Changes
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Employee *</label>
          <select
            className="input select-input"
            value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)}
          >
            <option value="">Select employee...</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.id})
              </option>
            ))}
          </select>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div className="form-group">
            <label className="form-label">Month</label>
            <select
              className="input select-input"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              className="input mono"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Deduction Type</label>
          <select
            className="input select-input"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {DEDUCTION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        {isPenaltyType && (
          <div
            style={{
              background: "var(--inp)",
              padding: 12,
              borderRadius: "var(--rsm)",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--t3)",
                marginBottom: 8,
              }}
            >
              VIOLATION DETAILS
            </div>
            {VIOLATION_OPTIONS.map((v, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 0",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={violations[i]}
                  onChange={(e) => {
                    const n = [...violations];
                    n[i] = e.target.checked;
                    setViolations(n);
                  }}
                />
                {v}
              </label>
            ))}
            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">Other (specify)</label>
              <input
                className="input"
                value={otherViolation}
                onChange={(e) => setOtherViolation(e.target.value)}
                placeholder="Enter other violation..."
              />
            </div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Amount (PKR) *</label>
          <input
            className="input mono"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Reason / Notes</label>
          <textarea
            className="input"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Deduction"
        message="Are you sure you want to delete this deduction? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
