import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import useFetch from '../useFetch.js';
import { Loading, ErrorState } from '../components/Status.jsx';

export default function FacultyDetails() {
  const { id } = useParams();
  const fetcher = useCallback(() => api.getFaculty(id), [id]);
  const { data: f, loading, error, reload } = useFetch(fetcher);

  if (loading) return <Loading text="Loading faculty details…" />;
  if (error) return (
    <>
      <ErrorState error={error} onRetry={error.status === 404 ? null : reload} />
      <Link className="btn secondary" to="/faculty">Return to Faculty List</Link>
    </>
  );

  return (
    <>
      <div className="page-head">
        <h1>{f.fullName}</h1>
        <div className="actions">
          <Link className="btn secondary" to="/faculty">Return to Faculty List</Link>
          <Link className="btn" to={`/faculty/${f.id}/edit`}>Edit Faculty</Link>
        </div>
      </div>
      <dl className="details">
        <dt>Faculty ID</dt><dd>{f.id}</dd>
        <dt>Full name</dt><dd>{f.fullName}</dd>
        <dt>Department</dt><dd>{f.department?.name || '—'}</dd>
        <dt>Position</dt><dd>{f.position}</dd>
        <dt>Email</dt><dd>{f.email}</dd>
        <dt>Status</dt><dd><span className={`badge ${f.status.toLowerCase()}`}>{f.status}</span></dd>
      </dl>
    </>
  );
}
