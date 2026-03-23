import React, { useState, useEffect } from "react";
import { formatPKR } from "../../data/dummyData";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import DecisionBanner from "../../components/DecisionBanner";
import { useToastContext } from "../../contexts/ToastContext";

interface TaxBracket {
  id: string;
  fromAmount: number;
  toAmount: number | null;
  ratePercent: number;
  fixedAmount: number;
  active: boolean;
}

const DEFAULT_BRACKETS: TaxBracket[] = [
  {
    id: "TAX001",
    fromAmount: 0,
    toAmount: 50000,
    ratePercent: 0,
    fixedAmount: 0,
    active: true,
  },
  {
    id: "TAX002",
    fromAmount: 50001,
    toAmount: 100000,
    ratePercent: 2,
    fixedAmount: 0,
    active: true,
  },
  {
    id: "TAX003",
    fromAmount: 100001,
    toAmount: 200000,
    ratePercent: 5,
    fixedAmount: 0,
    active: true,
  },
  {
    id: "TAX004",
    fromAmount: 200001,
    toAmount: null,
    ratePercent: 10,
    fixedAmount: 0,
    active: true,
  },
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

export default function TaxConfig() {
  const { showToast } = useToastContext();
  const [brackets, setBrackets] = useState<TaxBracket[]>(() =>
    load("ems_tax_config", DEFAULT_BRACKETS),
  );
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState<TaxBracket | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form state
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [noLimit, setNoLimit] = useState(false);
  const [ratePercent, setRatePercent] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");
  const [active, setActive] = useState(true);

  // Persist to localStorage
  useEffect(() => {
    save("ems_tax_config", brackets);
  }, [brackets]);

  const resetForm = () => {
    setFromAmount("");
    setToAmount("");
    setNoLimit(false);
    setRatePercent("");
    setFixedAmount("");
    setActive(true);
  };

  const handleAdd = () => {
    if (!fromAmount || (!toAmount && !noLimit) || !ratePercent) {
      showToast("Please fill required fields", "error");
      return;
    }
    const newBracket: TaxBracket = {
      id: "TAX" + String(Date.now()).slice(-6),
      fromAmount: parseFloat(fromAmount),
      toAmount: noLimit ? null : parseFloat(toAmount),
      ratePercent: parseFloat(ratePercent),
      fixedAmount: parseFloat(fixedAmount) || 0,
      active,
    };
    setBrackets((prev) =>
      [...prev, newBracket].sort((a, b) => a.fromAmount - b.fromAmount),
    );
    showToast("Tax bracket added");
    setModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editModal) return;
    setBrackets((prev) =>
      prev
        .map((b) =>
          b.id === editModal.id
            ? {
                ...b,
                fromAmount: parseFloat(fromAmount),
                toAmount: noLimit ? null : parseFloat(toAmount),
                ratePercent: parseFloat(ratePercent),
                fixedAmount: parseFloat(fixedAmount) || 0,
                active,
              }
            : b,
        )
        .sort((a, b) => a.fromAmount - b.fromAmount),
    );
    showToast("Tax bracket updated");
    setEditModal(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setBrackets((prev) => prev.filter((b) => b.id !== deleteTarget));
    showToast("Tax bracket deleted");
    setDeleteTarget(null);
  };

  const openEdit = (b: TaxBracket) => {
    setFromAmount(String(b.fromAmount));
    setToAmount(b.toAmount !== null ? String(b.toAmount) : "");
    setNoLimit(b.toAmount === null);
    setRatePercent(String(b.ratePercent));
    setFixedAmount(String(b.fixedAmount));
    setActive(b.active);
    setEditModal(b);
  };

  return (
    <div>
      <div className="pg-head">
        <div>
          <div className="pg-greet">Tax Configuration</div>
          <div className="pg-sub">
            Define tax brackets applied during payroll generation
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setModal(true);
          }}
        >
          <Plus size={13} /> Add Bracket
        </button>
      </div>

      <DecisionBanner>
        ⚠ DECISION NEEDED — Tax Calculation Method
        <br />
        Option A: Automatic — system applies tax bracket based on gross salary
        (shown here)
        <br />
        Option B: Manual — HR enters tax amount manually each month during
        payroll generation
        <br />
        Please confirm in meeting.
      </DecisionBanner>

      <div className="card" style={{ marginTop: 12 }}>
        {brackets.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--t3)" }}>
            <div style={{ fontSize: 13 }}>
              No tax brackets configured. Click "Add Bracket" to create one.
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Salary Range (From)</th>
                <th>Salary Range (To)</th>
                <th>Tax Rate %</th>
                <th>Fixed Amount</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brackets.map((b) => (
                <tr key={b.id}>
                  <td className="mono">{formatPKR(b.fromAmount)}</td>
                  <td className="mono">
                    {b.toAmount !== null ? formatPKR(b.toAmount) : "No limit"}
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {b.ratePercent}%
                  </td>
                  <td className="mono">{formatPKR(b.fixedAmount)}</td>
                  <td>
                    <span
                      className={`pill ${b.active ? "pill-green" : "pill-red"}`}
                    >
                      {b.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="ico-btn"
                        style={{ width: 28, height: 28 }}
                        onClick={() => openEdit(b)}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="ico-btn"
                        style={{ width: 28, height: 28 }}
                        onClick={() => setDeleteTarget(b.id)}
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

      <div
        className="card"
        style={{
          marginTop: 12,
          background: "var(--pl)",
          border: "1px solid var(--p2)",
        }}
      >
        <div style={{ fontSize: 12, color: "var(--p)" }}>
          ℹ Tax is calculated automatically during payroll generation based on
          the employee's gross salary and the bracket it falls into.
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Add Tax Bracket"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAdd}>
              Save
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">From Amount (PKR) *</label>
          <input
            className="input mono"
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">To Amount (PKR) *</label>
          <input
            className="input mono"
            type="number"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            placeholder="100000"
            disabled={noLimit}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 6,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={noLimit}
              onChange={(e) => setNoLimit(e.target.checked)}
            />
            No limit (unlimited)
          </label>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div className="form-group">
            <label className="form-label">Tax Rate (%) *</label>
            <input
              className="input mono"
              type="number"
              value={ratePercent}
              onChange={(e) => setRatePercent(e.target.value)}
              placeholder="5"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fixed Amount (PKR)</label>
            <input
              className="input mono"
              type="number"
              value={fixedAmount}
              onChange={(e) => setFixedAmount(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editModal}
        onClose={() => {
          setEditModal(null);
          resetForm();
        }}
        title="Edit Tax Bracket"
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
          <label className="form-label">From Amount (PKR) *</label>
          <input
            className="input mono"
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">To Amount (PKR) *</label>
          <input
            className="input mono"
            type="number"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            placeholder="100000"
            disabled={noLimit}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 6,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={noLimit}
              onChange={(e) => setNoLimit(e.target.checked)}
            />
            No limit (unlimited)
          </label>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div className="form-group">
            <label className="form-label">Tax Rate (%) *</label>
            <input
              className="input mono"
              type="number"
              value={ratePercent}
              onChange={(e) => setRatePercent(e.target.value)}
              placeholder="5"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fixed Amount (PKR)</label>
            <input
              className="input mono"
              type="number"
              value={fixedAmount}
              onChange={(e) => setFixedAmount(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Tax Bracket"
        message="Are you sure you want to delete this tax bracket? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
