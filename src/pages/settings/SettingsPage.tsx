import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToastContext } from '../../contexts/ToastContext';

interface SettingsPageProps {
  title: string;
  columns: string[];
  data: Record<string, any>[];
  modalFields?: { label: string; type?: string; options?: string[] }[];
  onAdd?: (row: Record<string, string>) => void;
  onDelete?: (index: number) => void;
}

export default function SettingsPage({ title, columns, data, modalFields, onAdd, onDelete }: SettingsPageProps) {
  const [addModal, setAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToastContext();
  const formRef = useRef<Record<string, string>>({});

  const fields: { label: string; type?: string; options?: string[] }[] = modalFields || columns.filter(c => c !== 'Active').map(c => ({ label: c }));

  const handleAdd = () => {
    setSaving(true);
    setTimeout(() => {
      if (onAdd) onAdd(formRef.current);
      showToast(`${title.replace(/s$/, '')} added`);
      setAddModal(false);
      setSaving(false);
      formRef.current = {};
    }, 400);
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    if (onDelete) onDelete(deleteId);
    showToast('Item deleted');
    setDeleteId(null);
  };

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">{title}</div><div className="pg-sub">Manage {title.toLowerCase()} settings</div></div>
        <button className="btn btn-primary" onClick={() => { formRef.current = {}; setAddModal(true); }}><Plus size={13} /> Add</button>
      </div>
      <div className="card">
        {data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--t3)', fontSize: 13 }}>No items yet. Click Add to create one.</div>
        ) : (
          <table>
            <thead><tr>{columns.map((c, i) => <th key={i}>{c}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {columns.map((_, j) => {
                    const val = Object.values(row)[j];
                    if (typeof val === 'boolean') return <td key={j}><span className={`pill ${val ? 'pill-green' : 'pill-red'}`}>{val ? 'Active' : 'Inactive'}</span></td>;
                    return <td key={j} className={typeof val === 'number' ? 'mono' : ''}>{String(val)}</td>;
                  })}
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="ico-btn" style={{ width: 28, height: 28 }}><Pencil size={13} /></button>
                      <button className="ico-btn" style={{ width: 28, height: 28 }} onClick={() => setDeleteId(i)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal open={addModal} onClose={() => setAddModal(false)} title={`Add ${title.replace(/s$/, '')}`} footer={
        <><button className="btn btn-secondary" onClick={() => setAddModal(false)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></>
      }>
        {fields.map((f, i) => (
          <div className="form-group" key={i}>
            <label className="form-label">{f.label}</label>
            {f.options ? <select className="input select-input" onChange={e => formRef.current[f.label] = e.target.value}>{f.options.map((o: string) => <option key={o}>{o}</option>)}</select> :
              <input className="input" type={(f.type as string) || 'text'} onChange={e => formRef.current[f.label] = e.target.value} />}
          </div>
        ))}
      </Modal>
      <ConfirmDialog open={deleteId !== null} title="Delete Item" message="Are you sure? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
