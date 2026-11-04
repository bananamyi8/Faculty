import { useEffect, useMemo, useState, type ReactNode, type FormEvent } from "react"
import api from "./services/api";

type Page =
  | "dashboard"
  | "faculty"
  | "add-faculty"
  | "profile"
  | "non-faculty"
  | "departments"
  | "subjects"
  | "schedules"
  | "reports"
  | "settings"

type Faculty = {
  facultyId: number
  name: string
  department: string
  position: string
  email: string
  status: "ACTIVE" | "INACTIVE"
  updatedAt?: string
  disabledAt?: string | null
}

type Department = {
  department_id: number
  department_name: string
  description?: string
}

const iconPaths: Record<string, ReactNode> = {
  dashboard: (
    <>
      <path d="M3 13h8V3H3v10Zm0 8h8v-5H3v5Zm10 0h8V11h-8v10Zm0-18v5h8V3h-8Z" />
    </>
  ),
  faculty: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  staff: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a6 6 0 0 1 12 0v2M16 11h6m-3-3v6" />
    </>
  ),
  department: (
    <>
      <path d="M3 21h18M6 21V9m4 12V9m4 12V9m4 12V9M4 9h16L12 3 4 9Z" />
    </>
  ),
  subject: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
      <path d="M8 7h8m-8 4h6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  report: (
    <>
      <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3v-4h.1A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3h4v.1A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.4.38.75.7 1H21v4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5m5 5H3m11-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  edit: (
    <>
      <path d="m4 16-1 5 5-1L19 9l-4-4L4 16Zm9-9 4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16m-10 4v6m4-6v6M9 3h6l1 4H8l1-4Zm-3 4 1 14h10l1-14" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </>
  ),
  chevron: (
    <>
      <path d="m9 18 6-6-6-6" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a3 3 0 0 1 3-3h5v18H7a3 3 0 0 0-3 3V5Zm16 0a3 3 0 0 0-3-3h-5v18h5a3 3 0 0 1 3 3V5Z" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
}


function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: string
  size?: number
  className?: string
}) {
  const filled = name === "dashboard"
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "danger"
  icon?: string
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={17} />}
      {children}
    </button>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
  required,
  defaultValue,
  name,
  pattern,
}: {
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  defaultValue?: string
  name?: string
  pattern?: string
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        pattern={pattern}
      />
    </label>
  )
}

function SelectField({
  label,
  options,
  required,
  defaultValue,
  name,
}: {
  label: string
  options: string[]
  required?: boolean
  defaultValue?: string
  name?: string
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <select name={name} required={required} defaultValue={defaultValue}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: ReactNode
}) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  )
}

function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode
  tone?: "green" | "amber" | "gray" | "blue" | "red"
}) {
  return (
    <span className={`badge badge-${tone}`}>
      <i />
      {children}
    </span>
  )
}

function ActionButtons({
  onView,
  onDelete,
}: {
  onView?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="actions">
      <button aria-label="View" onClick={onView}>
        <Icon name="eye" size={16} />
      </button>
      <button aria-label="Edit">
        <Icon name="edit" size={16} />
      </button>
      <button aria-label="Delete" className="delete" onClick={onDelete}>
        <Icon name="trash" size={16} />
      </button>
    </div>
  )
}

function Logo({
  light = false,
  title = "IDS College",
  subtitle = "INFOTECH DEVELOPMENT SYSTEM",
  className = "",
}: {
  light?: boolean
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={`logo ${light ? "logo-light" : ""} ${className}`}>
      <img
        className="logo-mark"
        src="assets/idslogo.png"
        alt="Infotech Development System College seal"
      />
      <div>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  )
}


const navItems: { page: Page; label: string; icon: string }[] = [
  { page: "dashboard", label: "Dashboard", icon: "dashboard" },
  { page: "faculty", label: "Faculty", icon: "faculty" },
  { page: "non-faculty", label: "Non-Faculty", icon: "staff" },
  { page: "departments", label: "Departments", icon: "department" },
  { page: "subjects", label: "Subjects", icon: "subject" },
  { page: "schedules", label: "Class Schedules", icon: "calendar" },
  { page: "reports", label: "Reports", icon: "report" },
  { page: "settings", label: "Settings", icon: "settings" },
]

const surfaceSidebarPages = new Set<Page>([
  "dashboard",
  "faculty",
  "non-faculty",
  "departments",
  "subjects",
  "schedules",
  "reports",
  "settings",
])


function Shell({
  page,
  setPage,
  children,
}: {
  page: Page
  setPage: (page: Page) => void
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Logo light className="sidebar-logo" title="Infotech Development System Colleges" subtitle="FACULTY MANAGEMENT" />
        <nav>
          {navItems.map((item) => (
            <button key={item.page} onClick={() => { setPage(item.page); setOpen(false) }} className={page === item.page || (page === "add-faculty" || page === "profile") && item.page === "faculty" ? "active" : ""}>
              <Icon name={item.icon} className={item.page === "dashboard" ? "sidebar-icon-fill" : surfaceSidebarPages.has(item.page) ? "sidebar-icon-stroke" : ""} />
              <span className={surfaceSidebarPages.has(item.page) ? "sidebar-surface-text" : ""}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><span className="sidebar-surface-text">Connected API · MongoDB</span></div>
      </aside>
      {open && <button className="scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <div className="workspace">
        <header className="topbar">
          <button className="menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" /></button>
          <div className="global-search"><Icon name="database" size={17} /><span>Faculty Management System</span></div>
          <div className="top-actions"><span className="badge badge-green">API workspace</span></div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

function LoadingState({ text = "Loading records..." }: { text?: string }) {
  return <div className="card empty-state" role="status"><p>{text}</p></div>
}

function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return <div className="card empty-state" role="alert"><h3>Unable to load data</h3><p>{error}</p><Button onClick={retry}>Try again</Button></div>
}

function EmptyState({ message }: { message: string }) {
  return <div className="card empty-state"><Icon name="database" size={28} /><h3>No records found</h3><p>{message}</p></div>
}

function apiError(error: any): string {
  return error?.response?.data?.detail || error?.response?.data?.message || error?.message || "The API request failed. Check that the backend and MongoDB are running."
}

function Dashboard({ go }: { go: (page: Page) => void }) {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true); setError("")
    try {
      const [facultyResponse, departmentResponse] = await Promise.all([
        api.get<Faculty[]>("/faculty"),
        api.get<{ count: number; data: Department[] }>("/departments"),
      ])
      setFaculty(Array.isArray(facultyResponse.data) ? facultyResponse.data : [])
      setDepartments(Array.isArray(departmentResponse.data?.data) ? departmentResponse.data.data : [])
    } catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const active = faculty.filter((item) => item.status === "ACTIVE").length
  const inactive = faculty.filter((item) => item.status === "INACTIVE").length
  return <div>
    <section className="hero"><div><span className="eyebrow">LIVE DATABASE OVERVIEW</span><h1>Faculty Management Dashboard</h1><p>Overview based on records currently stored in your database.</p></div><Button icon="plus" onClick={() => go("add-faculty")}>Add faculty</Button></section>
    {loading ? <LoadingState text="Loading dashboard data from the API..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : <>
      <div className="stat-grid">
        {[{ label: "Total Faculty", value: faculty.length }, { label: "Active Faculty", value: active }, { label: "Inactive Faculty", value: inactive }, { label: "Departments", value: departments.length }].map((stat) => <article className="stat-card" key={stat.label}><div className="stat-icon"><Icon name="database" /></div><div><strong>{stat.value}</strong><p>{stat.label}</p><small>Live API result</small></div></article>)}
      </div>
      <div className="dashboard-grid">
        <section className="card activity-card"><div className="card-heading"><div><h2>Faculty records</h2><p>Latest records returned by MongoDB</p></div><button onClick={() => go("faculty")}>View all</button></div>
          {faculty.length === 0 ? <EmptyState message="There are no faculty records in the database yet." /> : <div className="activity-list">{faculty.slice(0, 5).map((person) => <div className="activity" key={person.facultyId}><span><Icon name="faculty" size={17} /></span><div><strong>{person.name}</strong><p>{person.department} · {person.position}</p></div><small>{person.status}</small></div>)}</div>}
        </section>
        <section className="card department-overview"><div className="card-heading"><div><h2>Departments</h2><p>Department records from the API</p></div><button onClick={() => go("departments")}>View departments</button></div>
          {departments.length === 0 ? <EmptyState message="No departments have been added yet." /> : departments.map((dept) => <div className="progress-row" key={dept.department_id}><span>{dept.department_id}</span><div><strong>{dept.department_name}</strong></div></div>)}
        </section>
      </div>
    </>}
  </div>
}

function FacultyPage({ go, notify, onSelect, onAdd }: { go: (page: Page) => void; notify: (message: string) => void; onSelect: (id: number | null) => void; onAdd: () => void }) {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [busyId, setBusyId] = useState<number | null>(null)
  async function load() {
    setLoading(true); setError("")
    try { const response = await api.get<Faculty[]>("/faculty"); setFaculty(Array.isArray(response.data) ? response.data : []) }
    catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  async function deactivate(id: number) {
    if (!window.confirm("Deactivate this faculty record?")) return
    setBusyId(id)
    try { await api.patch(`/faculty/${id}/disable`); notify("Faculty record deactivated."); await load() }
    catch (err) { notify(apiError(err)) }
    finally { setBusyId(null) }
  }
  const rows = useMemo(() => faculty.filter((f) => `${f.facultyId} ${f.name} ${f.email} ${f.department} ${f.position}`.toLowerCase().includes(query.toLowerCase())), [faculty, query])
  return <div>
    <PageTitle title="Faculty Management" subtitle="Faculty records loaded directly from your MongoDB-backed API." action={<Button icon="plus" onClick={onAdd}>Add faculty</Button>} />
    <section className="card table-card"><div className="staff-toolbar"><input aria-label="Search faculty" placeholder="Search faculty records..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      {loading ? <LoadingState text="Loading faculty records..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : rows.length === 0 ? <EmptyState message={query ? "No faculty records match your search." : "No faculty records exist in MongoDB. Use Add faculty to create the first record."} /> : <div className="table-scroll"><table><thead><tr><th>Faculty ID</th><th>Name</th><th>Department</th><th>Position</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((person) => <tr key={person.facultyId}><td>{person.facultyId}</td><td><strong>{person.name}</strong></td><td>{person.department}</td><td>{person.position}</td><td>{person.email}</td><td><Badge tone={person.status === "ACTIVE" ? "green" : "gray"}>{person.status}</Badge></td><td className="row-actions"><Button className="small" variant="secondary" onClick={() => { onSelect(person.facultyId); go("profile") }}>View</Button><Button className="small" variant="secondary" onClick={() => { onSelect(person.facultyId); go("add-faculty") }}>Edit</Button>{person.status === "ACTIVE" && <Button className="small" variant="danger" onClick={() => void deactivate(person.facultyId)}>{busyId === person.facultyId ? "Saving..." : "Deactivate"}</Button>}</td></tr>)}</tbody></table></div>}
    </section>
  </div>
}

function FacultyForm({ go, notify, facultyId }: { go: (page: Page) => void; notify: (message: string) => void; facultyId: number | null }) {
  const editing = facultyId !== null
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", department: "", position: "", email: "" })
  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true); setError("")
      try {
        const [deptResponse, facultyResponse] = await Promise.all([
          api.get<{ data: Department[] }>("/departments"),
          editing ? api.get<Faculty>(`/faculty/${facultyId}`) : Promise.resolve(null),
        ])
        if (!active) return
        const list = Array.isArray(deptResponse.data?.data) ? deptResponse.data.data : []
        setDepartments(list)
        if (editing && facultyResponse) {
          const f = facultyResponse.data
          setForm({ name: f.name || "", department: f.department || "", position: f.position || "", email: f.email || "" })
        } else if (list.length) setForm((current) => ({ ...current, department: list[0].department_name }))
      } catch (err) { if (active) setError(apiError(err)) }
      finally { if (active) setLoading(false) }
    }
    void load()
    return () => { active = false }
  }, [facultyId, editing])
  function change(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })) }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("")
    try {
      if (editing) await api.put(`/faculty/${facultyId}`, form)
      else await api.post("/faculty", form)
      notify(editing ? "Faculty record updated." : "Faculty record created.")
      go("faculty")
    } catch (err) { setError(apiError(err)) }
    finally { setSaving(false) }
  }
  if (loading) return <LoadingState text="Loading faculty form and departments..." />
  if (error && departments.length === 0) return <ErrorState error={error} retry={() => window.location.reload()} />
  if (!departments.length) return <div><PageTitle title={editing ? "Edit Faculty" : "Add Faculty"} subtitle="A department must exist before a faculty member can be assigned." /><EmptyState message="No departments are stored in MongoDB. Add a department first." /><Button onClick={() => go("departments")}>Go to Departments</Button></div>
  return <div><button className="back-link" onClick={() => go("faculty")}>‹ Back to Faculty</button><PageTitle title={editing ? "Edit Faculty" : "Add Faculty"} subtitle="Save this record to the MongoDB database." />
    <form className="card form-card" onSubmit={(e) => void submit(e)}><div className="form-grid">
      <label className="field"><span>Full name *</span><input name="name" required value={form.name} onChange={(e) => change("name", e.target.value)} /></label>
      <label className="field"><span>Department *</span><select required value={form.department} onChange={(e) => change("department", e.target.value)}>{departments.map((d) => <option key={d.department_id} value={d.department_name}>{d.department_name}</option>)}</select></label>
      <label className="field"><span>Position *</span><input name="position" required value={form.position} onChange={(e) => change("position", e.target.value)} /></label>
      <label className="field"><span>Email address *</span><input name="email" type="email" required value={form.email} onChange={(e) => change("email", e.target.value)} /></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><Button variant="secondary" onClick={() => go("faculty")}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create faculty"}</Button></div>
    </form>
  </div>
}

function FacultyProfile({ facultyId, go }: { facultyId: number | null; go: (page: Page) => void }) {
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    let active = true
    if (facultyId === null) { setError("Select a faculty record first."); setLoading(false); return }
    api.get<Faculty>(`/faculty/${facultyId}`).then((response: { data: Faculty }) => { if (active) setFaculty(response.data) }).catch((error: unknown) => { if (active) setError(apiError(error)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [facultyId])
  if (loading) return <LoadingState text="Loading faculty profile..." />
  if (error) return <ErrorState error={error} retry={() => window.location.reload()} />
  if (!faculty) return <EmptyState message="The requested faculty record was not returned by the API." />
  return <div><button className="back-link" onClick={() => go("faculty")}>‹ Back to Faculty</button><section className="profile-hero"><div className="profile-main"><div className="upload-circle"><Icon name="faculty" size={30} /></div><div><Badge tone={faculty.status === "ACTIVE" ? "green" : "gray"}>{faculty.status}</Badge><h1>{faculty.name}</h1><p>{faculty.position} · {faculty.department}</p><span><Icon name="mail" size={15} /> {faculty.email}</span></div></div><Button variant="secondary" onClick={() => go("add-faculty")}>Edit profile</Button></section><section className="card tab-content"><div className="info-grid"><div><small>FACULTY ID</small><strong>{faculty.facultyId}</strong></div><div><small>FULL NAME</small><strong>{faculty.name}</strong></div><div><small>DEPARTMENT</small><strong>{faculty.department}</strong></div><div><small>POSITION</small><strong>{faculty.position}</strong></div><div><small>EMAIL</small><strong>{faculty.email}</strong></div><div><small>STATUS</small><strong>{faculty.status}</strong></div><div><small>LAST UPDATED</small><strong>{faculty.updatedAt ? new Date(faculty.updatedAt).toLocaleString() : "Not provided by API"}</strong></div></div></section></div>
}

function Departments({ notify }: { notify: (message: string) => void }) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState("")
  async function load() {
    setLoading(true); setError("")
    try { const response = await api.get<{ data: Department[] }>("/departments"); setDepartments(Array.isArray(response.data?.data) ? response.data.data : []) }
    catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("")
    try { await api.post("/departments", { department_name: name, description }); setName(""); setDescription(""); setShowForm(false); notify("Department saved to MongoDB."); await load() }
    catch (err) { setError(apiError(err)) }
    finally { setSaving(false) }
  }
  const filtered = departments.filter((d) => `${d.department_id} ${d.department_name} ${d.description || ""}`.toLowerCase().includes(query.toLowerCase()))
  return <div><PageTitle title="Departments" subtitle="Department records loaded and saved through your API." action={<Button icon="plus" onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "Add department"}</Button>} />
    {showForm && <form className="card form-card" onSubmit={(e) => void submit(e)}><div className="form-grid"><label className="field"><span>Department name *</span><input name="department_name" required value={name} onChange={(e) => setName(e.target.value)} /></label><label className="field"><span>Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label></div><div className="form-actions"><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save department"}</Button></div></form>}
    <section className="card table-card"><div className="staff-toolbar"><input placeholder="Search departments..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      {loading ? <LoadingState text="Loading departments..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : filtered.length === 0 ? <EmptyState message={query ? "No departments match your search." : "No departments are stored in MongoDB yet. Add your first department."} /> : <div className="table-scroll"><table><thead><tr><th>ID</th><th>Department</th><th>Description</th></tr></thead><tbody>{filtered.map((d) => <tr key={d.department_id}><td>{d.department_id}</td><td><strong>{d.department_name}</strong></td><td>{d.description || "—"}</td></tr>)}</tbody></table></div>}
    </section>
  </div>
}

function UnsupportedModule({ title, description }: { title: string; description: string }) {
  return <div><PageTitle title={title} subtitle={description} /><EmptyState message={`No ${title.toLowerCase()} are displayed because this backend does not currently provide an API endpoint for this module. No sample or hard-coded records are being shown.`} /></div>
}

function Reports() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  async function load() {
    setLoading(true); setError("")
    try { const [f, d] = await Promise.all([api.get<Faculty[]>("/faculty"), api.get<{ data: Department[] }>("/departments")]); setFaculty(Array.isArray(f.data) ? f.data : []); setDepartments(Array.isArray(d.data?.data) ? d.data.data : []) }
    catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  return <div><PageTitle title="Reports & Analytics" subtitle="Only metrics calculated from actual API records are shown." />{loading ? <LoadingState text="Calculating report from database records..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : <div className="report-grid"><article className="card report-stat"><strong>{faculty.length}</strong><p>Total faculty records</p></article><article className="card report-stat"><strong>{faculty.filter((f) => f.status === "ACTIVE").length}</strong><p>Active faculty</p></article><article className="card report-stat"><strong>{departments.length}</strong><p>Departments</p></article><article className="card report-stat"><strong>{faculty.filter((f) => f.status === "INACTIVE").length}</strong><p>Inactive faculty</p></article></div>}</div>
}

function AppSettings() {
  return <div><PageTitle title="Settings" subtitle="Account settings are not connected to an authentication or user-profile API yet." /><EmptyState message="No user profile, password, or preference data is loaded or saved. Those features require authenticated account endpoints." /></div>
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard")
  const [toast, setToast] = useState("")
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null)
  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(""), 3500)
  }
  let content: ReactNode
  switch (page) {
    case "dashboard": content = <Dashboard go={(next) => { if (next === "add-faculty") setSelectedFacultyId(null); setPage(next) }} />; break
    case "faculty": content = <FacultyPage go={setPage} notify={notify} onSelect={setSelectedFacultyId} onAdd={() => { setSelectedFacultyId(null); setPage("add-faculty") }} />; break
    case "add-faculty": content = <FacultyForm go={setPage} notify={notify} facultyId={selectedFacultyId} />; break
    case "profile": content = <FacultyProfile facultyId={selectedFacultyId} go={setPage} />; break
    case "departments": content = <Departments notify={notify} />; break
    case "non-faculty": content = <UnsupportedModule title="Non-Faculty" description="Non-teaching personnel records are not yet supported by the current API." />; break
    case "subjects": content = <UnsupportedModule title="Subjects" description="Subject records are not yet supported by the current API." />; break
    case "schedules": content = <UnsupportedModule title="Class Schedules" description="Class schedule records are not yet supported by the current API." />; break
    case "reports": content = <Reports />; break
    case "settings": content = <AppSettings />; break
    default: content = <Dashboard go={(next) => { if (next === "add-faculty") setSelectedFacultyId(null); setPage(next) }} />
  }
  return <Shell page={page} setPage={setPage}>{content}{toast && <div className="toast" role="status"><span><Icon name="check" size={15} /></span>{toast}</div>}</Shell>
}
