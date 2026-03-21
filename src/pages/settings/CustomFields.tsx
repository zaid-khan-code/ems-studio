import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import { useToastContext } from '../../contexts/ToastContext';

export default function CustomFields() {
  const { customFields, setCustomFields } = useData();
  const [tab, setTab] = useState('employee');
  const [modal, setModal] = useState(false);
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('Text');
  const [fieldRequired, setFieldRequired] = useState(false);
  const { showToast } = useToastContext();
  const tabs = ['employee', 'job', 'medical', 'extra'];
  const fields = customFields[tab as keyof typeof customFields] || [];

  const handleAdd = () => {
    setCustomFields(prev => ({
      ...prev,
      [tab]: [...(prev[tab as keyof typeof prev] || []), { label: fieldLabel, type: fieldType, required: fieldRequired, section: tab.charAt(0).toUpperCase() + tab.slice(1) + ' Info', active: true }],
    }));
    showToast('Field added'); setModal(false);
    setFieldLabel(''); setFieldType('Text'); setFieldRequired(false);
  };

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">Custom Fields</div><div className="pg-sub">Configure additional fields for forms</div></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={13} /> Add Field</button>
      </div>
      <div className="tabs">{tabs.map(t => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)} Info</button>)}</div>
      <div className="card">
        {fields.length === 0 ? <div className="empty-state"><p>No custom fields added for this section</p></div> :
          <table><thead><tr><th>Label</th><th>Type</th><th>Required</th><th>Active</th></tr></thead>
          <tbody>{fields.map((f: any, i: number) => <tr key={i}><td>{f.label}</td><td>{f.type}</td><td>{f.required ? 'Yes' : 'No'}</td><td><span className="pill pill-green">Active</span></td></tr>)}</tbody></table>
        }
      </div>
      <div className="card" style={{ marginTop: 12, background: 'var(--pl)', border: '1px solid var(--p2)' }}><div style={{ fontSize: 12, color: 'var(--p)' }}>ℹ Custom fields appear in the relevant form sections.</div></div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Custom Field" footer={
        <><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}>Save</button></>
      }>
        <div className="form-group"><label className="form-label">Field Label</label><input className="input" value={fieldLabel} onChange={e => setFieldLabel(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Field Type</label><select className="input select-input" value={fieldType} onChange={e => setFieldType(e.target.value)}><option>Text</option><option>Number</option><option>Date</option><option>Dropdown</option><option>Checkbox</option><option>Textarea</option></select></div>
        <div className="form-group"><label style={{ fontSize: 12, cursor: 'pointer' }}><input type="checkbox" checked={fieldRequired} onChange={e => setFieldRequired(e.target.checked)} /> Required</label></div>
      </Modal>
    </div>
  );
}
