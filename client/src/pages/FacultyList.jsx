import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import useFetch from '../useFetch.js';
import { useToast } from '../App.jsx';
import { Loading, ErrorState, EmptyState } from '../components/Status.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function FacultyList() {
  const notify = useToast();
  const { data, loading, error, reload } = useFetch(api.listFaculty);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [target, setTarget] = useState(null); // faculty pending deactivation
  const [busy, setBusy] = useState(false);

  async function confirmDeactivate() {
    setBusy(true);
    try {
      await api.disableFaculty(target.id);
      notify('Faculty deactivated successfully.');
      setTarget(null);
      reload();
    } catch (e) {
      notify(e.message, 'error');
      setTarget(null);
    } finally {
      setBusy(false);
    }
  }

  const header = (
    <div className="page-head">
      <h1>Faculty</h1>
      <Link className="btn" to="/faculty/new">Add Faculty</Link>
    </div>
  );

  if (loading) return <>{header}<Loading text="Loading faculty records…" /></>;
  if (error) return <>{header}<ErrorState error={error} onRetry={reload} /></>;
  if (!data.length)
    return (
      <>
        {header}
        <EmptyState message="No faculty members found.">
          <Link className="btn" to="/faculty/new">Add Faculty</Link>
        </EmptyState>
      </>
    );

  const q = search.trim().toLowerCase();
  const rows = data.filter((f) => {
    const matchText = !q || [f.fullName, f.email, f.position, f.department?.name]
      .some((v) => (v || '').toLowerCase().includes(q));
    const matchStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchText && matchStatus;
  });

  return (
    <>
      {header}
      <div className="filters">
        <input type="search" placeholder="Search name, email, position, department…"
               value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No faculty members match your search." />
      ) : (
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Department</th><th>Position</th><th>Email</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id}>
                <td data-label="ID">{f.id.slice(-6)}</td>
                <td data-label="Name">{f.fullName}</td>
                <td data-label="Department">{f.department?.name || '—'}</td>
                <td data-label="Position">{f.position}</td>
                <td data-label="Email">{f.email}</td>
                <td data-label="Status"><span className={`badge ${f.status.toLowerCase()}`}>{f.status}</span></td>
                <td data-label="Actions" className="row-actions">
                  <Link className="btn small" to={`/faculty/${f.id}`}>View Details</Link>
                  <Link className="btn small secondary" to={`/faculty/${f.id}/edit`}>Edit</Link>
                  {f.status === 'ACTIVE' && (
                    <button className="btn small danger" onClick={() => setTarget(f)}>Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {target && (
        <ConfirmDialog
          title="Deactivate Faculty?"
          message={`Are you sure you want to deactivate ${target.fullName}?`}
          confirmText="Confirm"
          busy={busy}
          onCancel={() => setTarget(null)}
          onConfirm={confirmDeactivate}
        />
      )}
    </>
  );
}
