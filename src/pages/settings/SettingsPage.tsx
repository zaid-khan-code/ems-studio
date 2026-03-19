import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToastContext } from '../../contexts/ToastContext';

interface SettingsPageProps {
  title: string;
  columns: string[];
  data: Record<string, any>[];
  modalFields?: { label: string; type?: string; options?: string[] }[];
}

export default function SettingsPage({ title, columns, data: initialData, modalFields }: SettingsPageProps) {
  const [addModal, setAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { showToast } = useToastContext();

  const fields: { label: string; type?: string; options?: string[] }[] = modalFields || columns.filter(c => c !== 'Active').map(c => ({ label: c }));

  return (
    <div>
      <div className="pg-head">
        <div><div className="pg-greet">{title}</div><div className="pg-sub">Manage {title.toLowerCase()} settings</div></div>
        <button className="btn btn-primary" onClick={() => setAddModal(true)}><Plus size={13} /> Add</button>
      </div>
      <div className="card">
        <table>
          <thead><tr>{columns.map((c, i) => <th key={i}>{c}</th>)}<th>Actions</th></tr></thead>
          <tbody>
            {initialData.map((row, i) => (
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
      </div>
      <Modal open={addModal} onClose={() => setAddModal(false)} title={`Add ${title.replace(/s$/, '')}`} footer={
        <><button className="btn btn-secondary" onClick={() => setAddModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { showToast(`${title.replace(/s$/, '')} added`); setAddModal(false); }}>Save</button></>
      }>
        {fields.map((f, i) => (
          <div className="form-group" key={i}>
            <label className="form-label">{f.label}</label>
            {f.options ? <select className="input select-input">{f.options.map((o: string) => <option key={o}>{o}</option>)}</select> :
              f.type === 'toggle' ? <div><label style={{ fontSize: 12, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Active</label></div> :
              <input className="input" type={(f.type as string) || 'text'} />}
          </div>
        ))}
      </Modal>
      <ConfirmDialog open={deleteId !== null} title="Delete Item" message="Are you sure? This action cannot be undone." onConfirm={() => { showToast('Item deleted'); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
