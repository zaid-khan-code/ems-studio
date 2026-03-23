import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { getStatusColor, formatPKR } from "../data/dummyData";
import { Pencil, Trash2, Plus, Download, Printer } from "lucide-react";
import Modal from "../components/Modal";
import DecisionBanner from "../components/DecisionBanner";
import { useToastContext } from "../contexts/ToastContext";

const deptColors: Record<string, string> = {
  Engineering: "#1565c0",
  Marketing: "#e67e22",
  HR: "#1b7a4e",
  Sales: "#b71c1c",
  Finance: "#00695c",
};

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const {
    employees,
    attendanceData,
    leaveRequests,
    payrollData,
    promotions,
    penalties,
    setPromotions,
    setPenalties,
    deleteEmployee,
  } = useData();
  const emp = employees.find((e) => e.id === id) || employees[0];
  const [tab, setTab] = useState("personal");
  const [promoModal, setPromoModal] = useState(false);
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [payslipModal, setPayslipModal] = useState<any | null>(null);
  const [promoDesig, setPromoDesig] = useState("");
  const [promoSalary, setPromoSalary] = useState("");
  const [promoDate, setPromoDate] = useState("");
  const [promoNotes, setPromoNotes] = useState("");
  const [penaltyChecks, setPenaltyChecks] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [penaltyOtherDesc, setPenaltyOtherDesc] = useState("");
  const [penaltyOtherFine, setPenaltyOtherFine] = useState("");

  const tabs = [
    "Personal",
    "Job Info",
    "Salary",
    "Medical",
    "Attendance",
    "Leave",
    "Payslips",
    "Promotions",
    "Penalties",
  ];
  const empPayroll = payrollData.filter((p: any) => p.empId === emp.id);
  const empPromos = promotions.filter((p: any) => p.empId === emp.id);
  const empPenalties = penalties.filter((p: any) => p.empId === emp.id);
  const empLeaves = leaveRequests.filter((l: any) => l.empId === emp.id);
  const empAttendance = attendanceData.filter((a: any) => a.empId === emp.id);

  const totalSalary =
    emp.salary.basic +
    emp.salary.houseRent +
    emp.salary.medical +
    emp.salary.conveyance +
    emp.salary.commission;

  const savePromo = () => {
    const newPromo = {
      id: "PR" + String(promotions.length + 1).padStart(3, "0"),
      empId: emp.id,
      empName: emp.name,
      oldDesignation: emp.designation,
      newDesignation: promoDesig,
      oldSalary: emp.salary.basic,
      newSalary: parseInt(promoSalary) || 0,
      date: promoDate || new Date().toISOString().split("T")[0],
      approvedBy: "Super Admin",
    };
    setPromotions((prev) => [...prev, newPromo]);
    showToast("Promotion recorded");
    setPromoModal(false);
    setPromoDesig("");
    setPromoSalary("");
    setPromoDate("");
    setPromoNotes("");
  };

  const savePenalty = () => {
    const penaltyNames = [
      "Late 3+ days",
      "Eating at desk",
      "Smoking in office",
      "Drinking at desk",
    ];
    const fines = [2000, 500, 1000, 500];
    penaltyChecks.forEach((checked, i) => {
      if (checked) {
        setPenalties((prev) => [
          ...prev,
          {
            id: "PN" + String(prev.length + 1).padStart(3, "0"),
            empId: emp.id,
            empName: emp.name,
            type: penaltyNames[i],
            amount: fines[i],
            date: new Date().toISOString().split("T")[0],
            appliedBy: "HR1",
            status: "Active",
          },
        ]);
      }
    });
    if (penaltyOtherDesc && penaltyOtherFine) {
      setPenalties((prev) => [
        ...prev,
        {
          id: "PN" + String(prev.length + 1).padStart(3, "0"),
          empId: emp.id,
          empName: emp.name,
          type: penaltyOtherDesc,
          amount: parseInt(penaltyOtherFine) || 0,
          date: new Date().toISOString().split("T")[0],
          appliedBy: "HR1",
          status: "Active",
        },
      ]);
    }
    showToast("Penalty applied");
    setPenaltyModal(false);
    setPenaltyChecks([false, false, false, false]);
    setPenaltyOtherDesc("");
    setPenaltyOtherFine("");
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${emp.name}? This action cannot be undone.`,
      )
    ) {
      deleteEmployee(emp.id);
      showToast(`Employee ${emp.id} deleted`);
      navigate("/employees");
    }
  };

  return (
    <div>
      <div
        className="card"
        style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          className="avatar avatar-lg"
          style={{ background: deptColors[emp.department] || "var(--p)" }}
        >
          {emp.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{emp.name}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--t3)" }}>
              {emp.id}
            </span>
            <span className={`pill ${getStatusColor(emp.jobStatus)}`}>
              {emp.jobStatus}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--t2)", marginTop: 4 }}>
            {emp.department} · {emp.designation}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost"
            onClick={() => navigate(`/employees/edit/${emp.id}`)}
          >
            <Pencil size={13} /> Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t.toLowerCase().replace(" ", "-") ? "active" : ""}`}
            onClick={() => setTab(t.toLowerCase().replace(" ", "-"))}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "personal" && (
        <div className="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            {[
              ["Full Name", emp.name],
              ["Father Name", emp.fatherName],
              ["Date of Birth", emp.dob],
              ["CNIC", emp.cnic],
              ["Gender", emp.gender],
              ["Contact 1", emp.contact1],
              ["Contact 2", emp.contact2 || "N/A"],
              ["Emergency 1", emp.emergency1],
              ["Emergency 2", emp.emergency2 || "N/A"],
              ["Permanent Address", emp.permanentAddress],
              ["Bank Name", emp.bankName || "Not provided"],
              ["Bank Account", emp.bankAccount || "Not provided"],
              ["Payment Mode", emp.paymentMode],
            ].map(([label, value], i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "var(--t3)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 13 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "job-info" && (
        <div className="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            {[
              ["Department", emp.department],
              ["Designation", emp.designation],
              ["Employment Type", emp.employmentType],
              ["Job Status", emp.jobStatus],
              ["Work Mode", emp.workMode],
              ["Work Location", emp.workLocation],
              ["Shift", emp.shift],
              ["Reporting Manager", emp.reportingManager],
              ["Date of Joining", emp.dateOfJoining],
              ["Commission Eligible", emp.commissionEligible ? "Yes" : "No"],
            ].map(([label, value], i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "var(--t3)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 13 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "salary" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              {
                label: "Basic Salary",
                value: emp.salary.basic,
                color: "var(--p)",
              },
              {
                label: "House Rent",
                value: emp.salary.houseRent,
                color: "var(--teal)",
              },
              {
                label: "Medical",
                value: emp.salary.medical,
                color: "var(--green)",
              },
              {
                label: "Conveyance",
                value: emp.salary.conveyance,
                color: "var(--amber)",
              },
              {
                label: "Commission",
                value: emp.salary.commission,
                color: "var(--purple)",
              },
              {
                label: "Total Package",
                value: totalSalary,
                color: "var(--p)",
                isTotal: true,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="card"
                style={{
                  textAlign: "center",
                  background: s.isTotal ? "var(--pl)" : undefined,
                }}
              >
                <div
                  style={{ fontSize: 11, color: "var(--t3)", marginBottom: 4 }}
                >
                  {s.label}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: s.isTotal ? 22 : 18,
                    fontWeight: 800,
                    color: s.color,
                  }}
                >
                  {formatPKR(s.value)}
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--t3)",
                marginBottom: 12,
              }}
            >
              SALARY BREAKDOWN
            </div>
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Monthly Amount</th>
                  <th>Annual Amount</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Basic Salary", emp.salary.basic],
                  ["House Rent Allowance", emp.salary.houseRent],
                  ["Medical Allowance", emp.salary.medical],
                  ["Conveyance Allowance", emp.salary.conveyance],
                  ["Commission", emp.salary.commission],
                ].map(([label, value], i) => (
                  <tr key={i}>
                    <td>{label}</td>
                    <td className="mono">{formatPKR(value as number)}</td>
                    <td className="mono">
                      {formatPKR((value as number) * 12)}
                    </td>
                    <td className="mono">
                      {totalSalary > 0
                        ? (((value as number) / totalSalary) * 100).toFixed(1)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
                <tr style={{ background: "var(--pl)", fontWeight: 700 }}>
                  <td>Total</td>
                  <td className="mono" style={{ color: "var(--p)" }}>
                    {formatPKR(totalSalary)}
                  </td>
                  <td className="mono" style={{ color: "var(--p)" }}>
                    {formatPKR(totalSalary * 12)}
                  </td>
                  <td className="mono">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="card"
            style={{ marginTop: 12, background: "var(--inp)" }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--t3)",
                marginBottom: 8,
              }}
            >
              PAYMENT DETAILS
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: "var(--t3)" }}>
                  Payment Mode:{" "}
                </span>
                <span style={{ fontWeight: 600 }}>{emp.paymentMode}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--t3)" }}>
                  Bank Name:{" "}
                </span>
                <span style={{ fontWeight: 600 }}>
                  {emp.bankName || "Not provided"}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--t3)" }}>
                  Account No:{" "}
                </span>
                <span className="mono" style={{ fontWeight: 600 }}>
                  {emp.bankAccount || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "medical" && (
        <div className="card">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {[
              ["Blood Group", emp.bloodGroup],
              ["Allergies", emp.allergies],
              ["Chronic Conditions", emp.chronicConditions],
              ["Medications", emp.medications],
            ].map(([l, v], i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "var(--t3)",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {l}
                </div>
                <div>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "attendance" && (
        <div className="card">
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {[
              {
                label: "Present",
                val: empAttendance.filter((a: any) => a.status === "Present")
                  .length,
                cls: "pill-green",
              },
              {
                label: "Absent",
                val: empAttendance.filter((a: any) => a.status === "Absent")
                  .length,
                cls: "pill-red",
              },
              {
                label: "Late",
                val: empAttendance.filter((a: any) => a.status === "Late")
                  .length,
                cls: "pill-amber",
              },
            ].map((s, i) => (
              <span key={i} className={`pill ${s.cls}`}>
                {s.label}: {s.val}
              </span>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Late By</th>
              </tr>
            </thead>
            <tbody>
              {empAttendance.map((a: any, i: number) => (
                <tr key={i}>
                  <td className="mono">{a.date}</td>
                  <td>{a.day}</td>
                  <td className="mono">{a.checkIn}</td>
                  <td className="mono">{a.checkOut}</td>
                  <td>
                    <span className={`pill ${getStatusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="mono">{a.lateBy || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "leave" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            {[
              { type: "Annual", used: 5, total: 12, color: "var(--p)" },
              { type: "Casual", used: 2, total: 12, color: "var(--green)" },
              { type: "Medical", used: 0, total: 8, color: "var(--teal)" },
            ].map((b, i) => (
              <div
                key={i}
                className="card"
                style={{ flex: 1, textAlign: "center" }}
              >
                <div
                  style={{ fontSize: 11, color: "var(--t3)", marginBottom: 4 }}
                >
                  {b.type}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 18, fontWeight: 800, color: b.color }}
                >
                  {b.total - b.used}
                  <span style={{ fontSize: 12, color: "var(--t3)" }}>
                    {" "}
                    / {b.total}
                  </span>
                </div>
                <div className="progress-bar" style={{ marginTop: 6 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((b.total - b.used) / b.total) * 100}%`,
                      background: b.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {empLeaves.map((l: any, i: number) => (
                  <tr key={i}>
                    <td>{l.leaveType}</td>
                    <td className="mono">{l.from}</td>
                    <td className="mono">{l.to}</td>
                    <td className="mono">{l.days}</td>
                    <td>{l.reason}</td>
                    <td>
                      <span className={`pill ${getStatusColor(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "payslips" && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Gross</th>
                <th>Net</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {empPayroll.map((p: any, i: number) => {
                const gross =
                  p.basic +
                  p.houseRent +
                  p.medical +
                  p.conveyance +
                  p.commission;
                const ded =
                  p.absentDeduction +
                  p.tax +
                  p.loan +
                  p.advance +
                  p.latePenalty +
                  p.otherDeduction;
                return (
                  <tr key={i}>
                    <td>March 2026</td>
                    <td className="mono">{formatPKR(gross)}</td>
                    <td
                      className="mono"
                      style={{ fontWeight: 600, color: "var(--green)" }}
                    >
                      {formatPKR(gross - ded)}
                    </td>
                    <td>
                      <span className={`pill ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setPayslipModal(p)}
                      >
                        View Payslip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Payslip Modal */}
      <Modal
        open={!!payslipModal}
        onClose={() => setPayslipModal(null)}
        title="Employee Payslip"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => showToast("Download feature coming soon", "info")}
            >
              <Download size={13} /> Download PDF
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => showToast("Print feature coming soon", "info")}
            >
              <Printer size={13} /> Print
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setPayslipModal(null)}
            >
              Close
            </button>
          </>
        }
      >
        {payslipModal &&
          (() => {
            const gross =
              payslipModal.basic +
              payslipModal.houseRent +
              payslipModal.medical +
              payslipModal.conveyance +
              payslipModal.commission;
            const totalDed =
              payslipModal.absentDeduction +
              payslipModal.tax +
              payslipModal.loan +
              payslipModal.advance +
              payslipModal.latePenalty +
              payslipModal.otherDeduction;
            const net = gross - totalDed;
            return (
              <div>
                {/* Header */}
                <div
                  style={{
                    background: "var(--inp)",
                    padding: 16,
                    borderRadius: "var(--rsm)",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>
                        ESSPL · Electronic Safety & Security (Pvt.) Ltd
                      </div>
                      <div style={{ fontSize: 11, color: "var(--t3)" }}>
                        Payslip for March 2026
                      </div>
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--t3)",
                        textAlign: "right",
                      }}
                    >
                      <div>
                        Generated: {new Date().toISOString().split("T")[0]}
                      </div>
                      <div>Slip ID: PAY-{emp.id}-202603</div>
                    </div>
                  </div>
                </div>

                {/* Employee Info */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                    fontSize: 12,
                  }}
                >
                  <div>
                    <span style={{ color: "var(--t3)" }}>Employee: </span>
                    <strong>{emp.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--t3)" }}>ID: </span>
                    <span className="mono">{emp.id}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--t3)" }}>Department: </span>
                    {emp.department}
                  </div>
                  <div>
                    <span style={{ color: "var(--t3)" }}>Designation: </span>
                    {emp.designation}
                  </div>
                </div>

                {/* Earnings & Deductions */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--green)",
                        marginBottom: 8,
                      }}
                    >
                      EARNINGS
                    </div>
                    <table style={{ fontSize: 12 }}>
                      <tbody>
                        <tr>
                          <td>Basic Salary</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.basic)}
                          </td>
                        </tr>
                        <tr>
                          <td>House Rent</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.houseRent)}
                          </td>
                        </tr>
                        <tr>
                          <td>Medical</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.medical)}
                          </td>
                        </tr>
                        <tr>
                          <td>Conveyance</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.conveyance)}
                          </td>
                        </tr>
                        <tr>
                          <td>Commission</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.commission)}
                          </td>
                        </tr>
                        <tr
                          style={{
                            fontWeight: 700,
                            borderTop: "1px solid var(--br)",
                          }}
                        >
                          <td>Total Earnings</td>
                          <td
                            className="mono"
                            style={{
                              textAlign: "right",
                              color: "var(--green)",
                            }}
                          >
                            {formatPKR(gross)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--red)",
                        marginBottom: 8,
                      }}
                    >
                      DEDUCTIONS
                    </div>
                    <table style={{ fontSize: 12 }}>
                      <tbody>
                        <tr>
                          <td>Absent Deduction</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.absentDeduction)}
                          </td>
                        </tr>
                        <tr>
                          <td>Tax</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.tax)}
                          </td>
                        </tr>
                        <tr>
                          <td>Loan</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.loan)}
                          </td>
                        </tr>
                        <tr>
                          <td>Advance</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.advance)}
                          </td>
                        </tr>
                        <tr>
                          <td>Late Penalty</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.latePenalty)}
                          </td>
                        </tr>
                        <tr>
                          <td>Other</td>
                          <td className="mono" style={{ textAlign: "right" }}>
                            {formatPKR(payslipModal.otherDeduction)}
                          </td>
                        </tr>
                        <tr
                          style={{
                            fontWeight: 700,
                            borderTop: "1px solid var(--br)",
                          }}
                        >
                          <td>Total Deductions</td>
                          <td
                            className="mono"
                            style={{ textAlign: "right", color: "var(--red)" }}
                          >
                            {formatPKR(totalDed)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Net Pay */}
                <div
                  style={{
                    background: "var(--pl)",
                    padding: 16,
                    borderRadius: "var(--rsm)",
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    NET PAYABLE
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 24, fontWeight: 800, color: "var(--p)" }}
                  >
                    {formatPKR(net)}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: "var(--t3)",
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  This is a system-generated document. For queries, contact HR.
                </div>
              </div>
            );
          })()}
      </Modal>

      {tab === "promotions" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 12,
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => setPromoModal(true)}
            >
              <Plus size={13} /> Record Promotion
            </button>
          </div>
          <div className="card">
            {empPromos.length === 0 ? (
              <div className="empty-state">
                <p>No promotions recorded</p>
              </div>
            ) : (
              empPromos.map((p: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom: "1px solid var(--br2)",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 40,
                      background: "var(--p)",
                      borderRadius: 2,
                      marginTop: 4,
                    }}
                  />
                  <div>
                    <div
                      className="mono"
                      style={{ fontSize: 10, color: "var(--t3)" }}
                    >
                      {p.date}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {p.oldDesignation} → {p.newDesignation}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 11, color: "var(--t2)" }}
                    >
                      {formatPKR(p.oldSalary)} → {formatPKR(p.newSalary)}
                    </div>
                    <div style={{ fontSize: 10.5, color: "var(--t3)" }}>
                      Approved by {p.approvedBy}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <DecisionBanner>
              DECISION NEEDED — Promotion Trigger: Manual / Automatic / Both?
              Confirm in meeting.
            </DecisionBanner>
          </div>
          <Modal
            open={promoModal}
            onClose={() => setPromoModal(false)}
            title="Record Promotion"
            footer={
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPromoModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={savePromo}>
                  Save
                </button>
              </>
            }
          >
            <div className="form-group">
              <label className="form-label">Promotion Date</label>
              <input
                className="input"
                type="date"
                value={promoDate}
                onChange={(e) => setPromoDate(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Old Designation</label>
                <input className="input" value={emp.designation} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">New Designation</label>
                <input
                  className="input"
                  value={promoDesig}
                  onChange={(e) => setPromoDesig(e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Old Salary</label>
                <input
                  className="input mono"
                  value={formatPKR(emp.salary.basic)}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Salary</label>
                <input
                  className="input mono"
                  value={promoSalary}
                  onChange={(e) => setPromoSalary(e.target.value)}
                  placeholder="PKR"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="input"
                rows={2}
                value={promoNotes}
                onChange={(e) => setPromoNotes(e.target.value)}
              />
            </div>
          </Modal>
        </div>
      )}

      {tab === "penalties" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 12,
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => setPenaltyModal(true)}
            >
              <Plus size={13} /> Add Penalty
            </button>
          </div>
          <div className="card">
            {empPenalties.length === 0 ? (
              <div className="empty-state">
                <p>No penalties recorded</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Fine</th>
                    <th>Applied By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {empPenalties.map((p: any, i: number) => (
                    <tr key={i}>
                      <td className="mono">{p.date}</td>
                      <td>{p.type}</td>
                      <td className="mono">{formatPKR(p.amount)}</td>
                      <td>{p.appliedBy}</td>
                      <td>
                        <span className={`pill ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <DecisionBanner>
              DECISION NEEDED — Half-day Penalty Amount formula. Confirm in
              meeting.
            </DecisionBanner>
          </div>
          <Modal
            open={penaltyModal}
            onClose={() => setPenaltyModal(false)}
            title="Add Penalty"
            footer={
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPenaltyModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={savePenalty}>
                  Apply Penalties
                </button>
              </>
            }
          >
            {[
              "Late 3+ days this month — Fine: TBD",
              "Eating at desk — Fine: PKR 500",
              "Smoking in office — Fine: PKR 1,000",
              "Drinking at desk — Fine: PKR 500",
            ].map((p, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--br2)",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={penaltyChecks[i]}
                  onChange={(e) => {
                    const c = [...penaltyChecks];
                    c[i] = e.target.checked;
                    setPenaltyChecks(c);
                  }}
                />
                <span>{p}</span>
              </label>
            ))}
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Other</label>
              <div className="form-row">
                <input
                  className="input"
                  placeholder="Description"
                  value={penaltyOtherDesc}
                  onChange={(e) => setPenaltyOtherDesc(e.target.value)}
                />
                <input
                  className="input mono"
                  placeholder="PKR"
                  value={penaltyOtherFine}
                  onChange={(e) => setPenaltyOtherFine(e.target.value)}
                />
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
