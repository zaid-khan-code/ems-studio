import React from "react";
import SettingsPage from "./SettingsPage";
import { useData } from "../../contexts/DataContext";

export function DepartmentsPage() {
  const { departments, setDepartments } = useData();
  return (
    <SettingsPage
      title="Departments"
      columns={["Name", "Active"]}
      data={departments.map((d) => ({ name: d, active: true }))}
      onAdd={(row) => setDepartments((prev) => [...prev, row.Name || row.name])}
      onEdit={(idx, row) =>
        setDepartments((prev) =>
          prev.map((d, i) => (i === idx ? row.Name || row.name : d)),
        )
      }
      onDelete={(idx) =>
        setDepartments((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
export function DesignationsPage() {
  const {
    designations,
    setDesignations,
    departments,
    designationsByDept,
    setDesignationsByDept,
  } = useData();
  return (
    <div>
      <SettingsPage
        title="Designations"
        columns={["Name", "Department", "Active"]}
        data={designations.map((d) => {
          // Find which department this designation belongs to
          const dept =
            Object.entries(designationsByDept).find(([_, desigs]) =>
              desigs.includes(d),
            )?.[0] || "All";
          return { name: d, department: dept, active: true };
        })}
        modalFields={[
          { label: "Name" },
          { label: "Department", options: ["All", ...departments] },
        ]}
        onAdd={(row) => {
          const name = row.Name || row.name;
          const dept = row.Department;
          setDesignations((prev) => [...prev, name]);
          if (dept && dept !== "All") {
            setDesignationsByDept((prev) => ({
              ...prev,
              [dept]: [...(prev[dept] || []), name],
            }));
          }
        }}
        onEdit={(idx, row) =>
          setDesignations((prev) =>
            prev.map((d, i) => (i === idx ? row.Name || row.name : d)),
          )
        }
        onDelete={(idx) =>
          setDesignations((prev) => prev.filter((_, i) => i !== idx))
        }
      />
      <div
        className="card"
        style={{
          marginTop: 12,
          background: "var(--pl)",
          border: "1px solid var(--p2)",
        }}
      >
        <div style={{ fontSize: 12, color: "var(--p)" }}>
          ℹ Designations linked to a department will only appear in dropdowns
          when that department is selected.
        </div>
      </div>
    </div>
  );
}
export function WorkModesPage() {
  const { workModes, setWorkModes } = useData();
  return (
    <SettingsPage
      title="Work Modes"
      columns={["Name", "Active"]}
      data={workModes.map((d) => ({ name: d, active: true }))}
      onAdd={(row) => setWorkModes((prev) => [...prev, row.Name || row.name])}
      onEdit={(idx, row) =>
        setWorkModes((prev) =>
          prev.map((d, i) => (i === idx ? row.Name || row.name : d)),
        )
      }
      onDelete={(idx) =>
        setWorkModes((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
export function WorkLocationsPage() {
  const { workLocations, setWorkLocations } = useData();
  return (
    <SettingsPage
      title="Work Locations"
      columns={["Name", "Active"]}
      data={workLocations.map((d) => ({ name: d, active: true }))}
      onAdd={(row) =>
        setWorkLocations((prev) => [...prev, row.Name || row.name])
      }
      onEdit={(idx, row) =>
        setWorkLocations((prev) =>
          prev.map((d, i) => (i === idx ? row.Name || row.name : d)),
        )
      }
      onDelete={(idx) =>
        setWorkLocations((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
export function EmploymentTypesPage() {
  const { employmentTypes, setEmploymentTypes } = useData();
  return (
    <SettingsPage
      title="Employment Types"
      columns={["Name", "Active"]}
      data={employmentTypes.map((d) => ({ name: d, active: true }))}
      onAdd={(row) =>
        setEmploymentTypes((prev) => [...prev, row.Name || row.name])
      }
      onEdit={(idx, row) =>
        setEmploymentTypes((prev) =>
          prev.map((d, i) => (i === idx ? row.Name || row.name : d)),
        )
      }
      onDelete={(idx) =>
        setEmploymentTypes((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
export function JobStatusesPage() {
  const { jobStatuses, setJobStatuses } = useData();
  return (
    <SettingsPage
      title="Job Statuses"
      columns={["Name", "Active"]}
      data={jobStatuses.map((d) => ({ name: d, active: true }))}
      onAdd={(row) => setJobStatuses((prev) => [...prev, row.Name || row.name])}
      onEdit={(idx, row) =>
        setJobStatuses((prev) =>
          prev.map((d, i) => (i === idx ? row.Name || row.name : d)),
        )
      }
      onDelete={(idx) =>
        setJobStatuses((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
export function ReportingManagersPage() {
  const {
    reportingManagers,
    setReportingManagers,
    reportingManagersWithDept,
    setReportingManagersWithDept,
    departments,
  } = useData();
  return (
    <div>
      <SettingsPage
        title="Reporting Managers"
        columns={["Name", "Department", "Active"]}
        data={reportingManagersWithDept.map((rm) => ({
          name: rm.name,
          department: rm.department,
          active: true,
        }))}
        modalFields={[
          { label: "Name" },
          { label: "Department", options: departments },
        ]}
        onAdd={(row) => {
          const name = row.Name || row.name;
          const dept = row.Department || departments[0];
          setReportingManagers((prev) => [...prev, name]);
          setReportingManagersWithDept((prev) => [
            ...prev,
            { name, department: dept },
          ]);
        }}
        onEdit={(idx, row) => {
          const name = row.Name || row.name;
          const dept = row.Department || departments[0];
          setReportingManagers((prev) =>
            prev.map((d, i) => (i === idx ? name : d)),
          );
          setReportingManagersWithDept((prev) =>
            prev.map((rm, i) => (i === idx ? { name, department: dept } : rm)),
          );
        }}
        onDelete={(idx) => {
          setReportingManagers((prev) => prev.filter((_, i) => i !== idx));
          setReportingManagersWithDept((prev) =>
            prev.filter((_, i) => i !== idx),
          );
        }}
      />
      <div
        className="card"
        style={{
          marginTop: 12,
          background: "var(--pl)",
          border: "1px solid var(--p2)",
        }}
      >
        <div style={{ fontSize: 12, color: "var(--p)" }}>
          ℹ Reporting managers must be assigned to a department. This helps in
          organizing the hierarchy.
        </div>
      </div>
    </div>
  );
}
export function ShiftsPage() {
  const { shifts, setShifts } = useData();
  return (
    <SettingsPage
      title="Shifts"
      columns={["Name", "Start", "End", "Late After (min)", "Active"]}
      data={shifts.map((s) => ({
        name: s.name,
        start: s.start,
        end: s.end,
        late: s.lateAfter,
        active: true,
      }))}
      modalFields={[
        { label: "Name" },
        { label: "Start Time", type: "time" },
        { label: "End Time", type: "time" },
        { label: "Late After (minutes)", type: "number" },
      ]}
      onAdd={(row) =>
        setShifts((prev) => [
          ...prev,
          {
            name: row.Name || "",
            start: row["Start Time"] || "09:00",
            end: row["End Time"] || "18:00",
            lateAfter: parseInt(row["Late After (minutes)"]) || 15,
          },
        ])
      }
      onEdit={(idx, row) =>
        setShifts((prev) =>
          prev.map((s, i) =>
            i === idx
              ? {
                  name: row.Name || "",
                  start: row["Start Time"] || s.start,
                  end: row["End Time"] || s.end,
                  lateAfter:
                    parseInt(row["Late After (minutes)"]) || s.lateAfter,
                }
              : s,
          ),
        )
      }
      onDelete={(idx) => setShifts((prev) => prev.filter((_, i) => i !== idx))}
    />
  );
}
export function LeaveTypesPage() {
  const { leaveTypes, setLeaveTypes } = useData();
  return (
    <SettingsPage
      title="Leave Types"
      columns={["Name", "Code", "Active"]}
      data={leaveTypes}
      onAdd={(row) =>
        setLeaveTypes((prev) => [
          ...prev,
          {
            name: row.Name || "",
            code: (row.Name || "").substring(0, 2).toUpperCase(),
            active: true,
          },
        ])
      }
      onEdit={(idx, row) =>
        setLeaveTypes((prev) =>
          prev.map((t, i) =>
            i === idx
              ? { ...t, name: row.Name || t.name, code: row.Code || t.code }
              : t,
          ),
        )
      }
      onDelete={(idx) =>
        setLeaveTypes((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
export function LeavePoliciesPage() {
  const { leavePolicies, setLeavePolicies } = useData();
  return (
    <SettingsPage
      title="Leave Policies"
      columns={["Leave Type", "Days", "Year", "Active"]}
      data={leavePolicies.map((p) => ({
        type: p.leaveType,
        days: p.days,
        year: p.year,
        active: p.active,
      }))}
      onAdd={(row) =>
        setLeavePolicies((prev) => [
          ...prev,
          {
            leaveType: row["Leave Type"] || "",
            days: parseInt(row.Days) || 0,
            year: parseInt(row.Year) || 2026,
            active: true,
          },
        ])
      }
      onEdit={(idx, row) =>
        setLeavePolicies((prev) =>
          prev.map((p, i) =>
            i === idx
              ? {
                  ...p,
                  leaveType: row["Leave Type"] || p.leaveType,
                  days: parseInt(row.Days) || p.days,
                  year: parseInt(row.Year) || p.year,
                }
              : p,
          ),
        )
      }
      onDelete={(idx) =>
        setLeavePolicies((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
export function PayrollComponentsPage() {
  const { payrollComponents, setPayrollComponents } = useData();
  return (
    <div>
      <SettingsPage
        title="Payroll Components"
        columns={["Name", "Type", "Taxable", "Order", "Active"]}
        data={payrollComponents.map((c) => ({
          name: c.name,
          type: c.type,
          taxable: c.taxable,
          order: c.order,
          active: c.active,
        }))}
        onAdd={(row) =>
          setPayrollComponents((prev) => [
            ...prev,
            {
              name: row.Name || "",
              type: "Earning",
              taxable: false,
              order: prev.length + 1,
              active: true,
            },
          ])
        }
        onEdit={(idx, row) =>
          setPayrollComponents((prev) =>
            prev.map((c, i) =>
              i === idx ? { ...c, name: row.Name || c.name } : c,
            ),
          )
        }
        onDelete={(idx) =>
          setPayrollComponents((prev) => prev.filter((_, i) => i !== idx))
        }
      />
      <div
        className="card"
        style={{
          marginTop: 12,
          background: "var(--pl)",
          border: "1px solid var(--p2)",
        }}
      >
        <div style={{ fontSize: 12, color: "var(--p)" }}>
          ℹ Adding a component here automatically adds it to all future payroll
          generation forms.
        </div>
      </div>
    </div>
  );
}
export function PenaltiesConfigPage() {
  const { penaltiesConfig, setPenaltiesConfig } = useData();
  return (
    <SettingsPage
      title="Penalties Config"
      columns={["Name", "Category", "Default Fine", "Active"]}
      data={penaltiesConfig.map((p) => ({
        name: p.name,
        category: p.category,
        fine: `PKR ${p.defaultFine.toLocaleString()}`,
        active: p.active,
      }))}
      onAdd={(row) =>
        setPenaltiesConfig((prev) => [
          ...prev,
          {
            name: row.Name || "",
            category: "Behaviour",
            defaultFine: parseInt(row["Default Fine"]) || 0,
            active: true,
          },
        ])
      }
      onEdit={(idx, row) =>
        setPenaltiesConfig((prev) =>
          prev.map((p, i) =>
            i === idx
              ? {
                  ...p,
                  name: row.Name || p.name,
                  category: row.Category || p.category,
                  defaultFine: parseInt(row["Default Fine"]) || p.defaultFine,
                }
              : p,
          ),
        )
      }
      onDelete={(idx) =>
        setPenaltiesConfig((prev) => prev.filter((_, i) => i !== idx))
      }
    />
  );
}
