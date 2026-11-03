import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import useFetch from '../useFetch.js';
import { useToast } from '../App.jsx';
import { Loading, ErrorState, EmptyState } from '../components/Status.jsx';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function FacultyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const notify = useToast();

  const deptFetcher = useCallback(() => api.listDepartments(), []);
  const { data: departments, loading: dLoading, error: dError, reload: dReload } = useFetch(deptFetcher);

  const facFetcher = useCallback(() => (isEdit ? api.getFaculty(id) : Promise.resolve(null)), [id, isEdit]);
  const { data: existing, loading: fLoading, error: fError, reload: fReload } = useFetch(facFetcher);

  const [form, setForm] = useState({ fullName: '', department: '', position: '', email: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        fullName: existing.fullName,
        department: existing.department?.id || '',
        position: existing.position,
        email: existing.email,
      });
    }
  }, [existing]);

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.department) e.department = 'Please select a department';
    if (!form.position.trim()) e.position = 'Position is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address';
    return e;
  }

  const change = (field) => (ev) => setForm({ ...form, [field]: ev.target.value });

  async function submit(ev) {
    ev.preventDefault();
    if (submitting) return;
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return; // keep entered data, show messages

    setSubmitting(true);
    try {
      const saved = isEdit ? await api.updateFaculty(id, form) : await api.createFaculty(form);
      notify(isEdit ? 'Faculty updated successfully.' : 'Faculty created successfully.');
      navigate(`/faculty/${saved.id}`);
    } catch (e) {
      setErrors({ ...(e.fieldErrors || {}), form: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (dLoading || fLoading) return <Loading text="Loading form…" />;
  if (dError) return <ErrorState error={dError} onRetry={dReload} />;
  if (fError) return <ErrorState error={fError} onRetry={fReload} />;
  if (!departments.length)
    return (
      <EmptyState message="No departments exist yet. Create a department before adding faculty.">
        <Link className="btn" to="/departments/new">Add Department</Link>
      </EmptyState>
    );

  return (
    <>
      <div className="page-head"><h1>{isEdit ? 'Edit Faculty' : 'Add Faculty'}</h1></div>
      <form className="form" onSubmit={submit} noValidate>
        {errors.form && <div className="state error" role="alert">{errors.form}</div>}

        <label>Full name *
          <input value={form.fullName} onChange={change('fullName')} />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </label>

        <label>Department *
          <select value={form.department} onChange={change('department')}>
            <option value="">Select a department…</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          {errors.department && <span className="field-error">{errors.department}</span>}
        </label>

        <label>Position *
          <input value={form.position} onChange={change('position')} />
          {errors.position && <span className="field-error">{errors.position}</span>}
        </label>

        <label>Email address *
          <input type="email" value={form.email} onChange={change('email')} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <div className="actions">
          <Link className="btn secondary" to={isEdit ? `/faculty/${id}` : '/faculty'}>Cancel</Link>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Save'}
          </button>
        </div>
      </form>
    </>
  );
}
