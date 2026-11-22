import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, type FormEvent } from "react"
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
  |  "users"

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
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass"
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
  onEdit,
  onDelete,
}: {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="actions">
      {onView && (
        <button aria-label="View" onClick={onView}>
          <Icon name="eye" size={16} />
        </button>
      )}
      {onEdit && (
        <button aria-label="Edit" onClick={onEdit}>
          <Icon name="edit" size={16} />
        </button>
      )}
      {onDelete && (
        <button aria-label="Delete" className="delete" onClick={onDelete}>
          <Icon name="trash" size={16} />
        </button>
      )}
    </div>
  )
}

function Logo({
  title = "IDSC",
  subtitle = "Faculty Management System",
  className = "",
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={`logo ${className}`}>
      <img
        className="logo-mark"
        src="/assets/idslogo.png"
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
  { page: "users", label: "Users", icon: "staff" },
  { page: "settings", label: "Settings", icon: "settings" },
  
]

function Shell({ page, setPage, onLogout, children }: { page: Page; setPage: (page: Page) => void; onLogout: () => void; children: ReactNode }) {
  const { user } = useAuth()
  const activeTab: Page = page === "add-faculty" || page === "profile" ? "faculty" : page
  return (
    <div className="app-shell">
      <header className="app-header">
        <Logo />
        <div className="header-actions">
          <span className="user-pill">{user.name} · {user.role}</span>
          <Button onClick={onLogout}>Log out</Button>
        </div>
      </header>
      <nav className="tabs" aria-label="Main sections">
        {navItems.filter((item) => canAccess(item.page, user.role)).map((item) => (
          <button key={item.page} onClick={() => setPage(item.page)} className={`tab ${activeTab === item.page ? "active" : ""}`}>
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <main className="content">{children}</main>
      <footer className="app-footer">Infotech Development System Colleges · Faculty Management</footer>
    </div>
  )
}

function LoadingState({ text = "Loading..." }: { text?: string }) {
  return <div className="card empty-state" role="status"><p>{text}</p></div>
}

function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return <div className="card empty-state" role="alert"><h3>Couldn't load the data</h3><p>{error}</p><Button onClick={retry}>Try again</Button></div>
}

function EmptyState({ message }: { message: string }) {
  return <div className="card empty-state"><Icon name="database" size={28} /><h3>Nothing here yet</h3><p>{message}</p></div>
}

function apiError(error: any): string {
  return error?.response?.data?.detail || error?.response?.data?.message || error?.message || "Something went wrong. Please check your connection and try again."
}

type Role = "admin" | "staff" | "faculty"
type User = { id: string; name: string; email: string; role: Role }

const AuthCtx = createContext<{ user: User; canEdit: boolean } | null>(null)
function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error("useAuth must be used inside the logged-in app")
  return ctx
}

function canAccess(page: Page, role: Role) {
  if (page === "users") return role === "admin"
  if (page === "reports" || page === "add-faculty") return role !== "faculty"
  return true
}


function Dashboard({ go }: { go: (page: Page) => void }) {
  const { user, canEdit } = useAuth()
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [counts, setCounts] = useState({ nonFaculty: 0, subjects: 0, schedules: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true); setError("")
    try {
      const [facultyResponse, departmentResponse, nonFacultyResponse, subjectResponse, scheduleResponse] = await Promise.all([
        api.get<Faculty[]>("/faculty"),
        api.get<{ count: number; data: Department[] }>("/departments"),
        api.get<unknown[]>("/non-faculty"),
        api.get<unknown[]>("/subjects"),
        api.get<unknown[]>("/schedules"),
      ])
      setFaculty(Array.isArray(facultyResponse.data) ? facultyResponse.data : [])
      setDepartments(Array.isArray(departmentResponse.data?.data) ? departmentResponse.data.data : [])
      setCounts({
        nonFaculty: Array.isArray(nonFacultyResponse.data) ? nonFacultyResponse.data.length : 0,
        subjects: Array.isArray(subjectResponse.data) ? subjectResponse.data.length : 0,
        schedules: Array.isArray(scheduleResponse.data) ? scheduleResponse.data.length : 0,
      })
    } catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const active = faculty.filter((item) => item.status === "ACTIVE").length
  const inactive = faculty.length - active
  const records = (n: number) => `${n} ${n === 1 ? "record" : "records"}`

  const quick: { page: Page; title: string; text: string; icon: string; badge: string }[] = [
    { page: "faculty", title: "Faculty", text: "Teaching staff profiles and their status.", icon: "faculty", badge: records(faculty.length) },
    { page: "non-faculty", title: "Non-Faculty", text: "Admin, support and other non-teaching staff.", icon: "staff", badge: records(counts.nonFaculty) },
    { page: "departments", title: "Departments", text: "The departments and programs in your school.", icon: "department", badge: records(departments.length) },
    { page: "subjects", title: "Subjects", text: "Subjects offered, with their units.", icon: "subject", badge: records(counts.subjects) },
    { page: "schedules", title: "Class Schedules", text: "Who teaches what, when and where.", icon: "calendar", badge: records(counts.schedules) },
    { page: "reports", title: "Reports", text: "A quick look at the numbers.", icon: "report", badge: "Open report" },
  ]

  return <div>
    <section className="hero">
      <div>
        <h1>Infotech Development System College</h1>
        <p>Building better futures through quality education.</p>
      </div>
      <div className="hero-actions">
        <Button onClick={() => go("faculty")}>Explore faculty</Button>
        {canEdit && <Button variant="glass" icon="plus" onClick={() => go("add-faculty")}>Add faculty</Button>}
      </div>
    </section>

    <div className="section-head">
      <h2>Quick Access</h2>
      <p>Jump to any part of the Faculty Management System.</p>
    </div>

    {loading ? <LoadingState text="Getting your dashboard ready..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : <>
      <div className="quick-grid">
        {quick.filter((item) => canAccess(item.page, user.role)).map((item) => (
          <button className="quick-card" key={item.page} onClick={() => go(item.page)}>
            <span className="quick-icon"><Icon name={item.icon} size={22} /></span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span className="quick-count">{item.badge}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="card activity-card">
          <div className="card-heading"><div><h2>Faculty</h2><p>{active} active · {inactive} inactive</p></div><button onClick={() => go("faculty")}>View all</button></div>
          {faculty.length === 0 ? <EmptyState message="No faculty have been added yet." /> : <div className="activity-list">{faculty.slice(0, 5).map((person) => <div className="activity" key={person.facultyId}><span><Icon name="faculty" size={17} /></span><div><strong>{person.name}</strong><p>{person.department} · {person.position}</p></div><small>{person.status}</small></div>)}</div>}
        </section>
        <section className="card department-overview">
          <div className="card-heading"><div><h2>Departments</h2><p>Where your people belong</p></div><button onClick={() => go("departments")}>View all</button></div>
          {departments.length === 0 ? <EmptyState message="No departments have been added yet." /> : departments.slice(0, 6).map((dept) => <div className="progress-row" key={dept.department_id}><span>{dept.department_id}</span><div><strong>{dept.department_name}</strong></div></div>)}
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
  const { canEdit } = useAuth()
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
    <PageTitle title="Faculty" subtitle="Everyone on your teaching team, in one place." action={canEdit ? <Button icon="plus" onClick={onAdd}>Add faculty</Button> : undefined}/>
    <section className="card table-card"><div className="staff-toolbar"><input aria-label="Search faculty" placeholder="Search faculty..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      {loading ? <LoadingState text="Loading faculty records..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : rows.length === 0 ? <EmptyState message={query ? "No faculty records match your search." : "No faculty yet. Tap Add faculty to create the first one."} /> : <div className="table-scroll"><table><thead><tr><th>Faculty ID</th><th>Name</th><th>Department</th><th>Position</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((person) => <tr key={person.facultyId}><td>{person.facultyId}</td><td><strong>{person.name}</strong></td><td>{person.department}</td><td>{person.position}</td><td>{person.email}</td><td><Badge tone={person.status === "ACTIVE" ? "green" : "gray"}>{person.status}</Badge></td><td className="row-actions"><Button className="small" variant="secondary" onClick={() => { onSelect(person.facultyId); go("profile") }}>View</Button><Button className="small" variant="secondary" onClick={() => { onSelect(person.facultyId); go("add-faculty") }}>Edit</Button>{person.status === "ACTIVE" && <Button className="small" variant="danger" onClick={() => void deactivate(person.facultyId)}>{busyId === person.facultyId ? "Saving..." : "Deactivate"}</Button>}</td></tr>)}</tbody></table></div>}
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
  if (!departments.length) return <div><PageTitle title={editing ? "Edit Faculty" : "Add Faculty"} subtitle="Add a department first, then you can assign faculty to it." /><EmptyState message="You need at least one department first." /><Button onClick={() => go("departments")}>Go to Departments</Button></div>
  return <div><button className="back-link" onClick={() => go("faculty")}>‹ Back to Faculty</button><PageTitle title={editing ? "Edit Faculty" : "Add Faculty"} subtitle="Fill in the details below and save." />
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
    try { await api.post("/departments", { department_name: name, description }); setName(""); setDescription(""); setShowForm(false); notify("Department saved."); await load() }
    catch (err) { setError(apiError(err)) }
    finally { setSaving(false) }
  }
  const filtered = departments.filter((d) => `${d.department_id} ${d.department_name} ${d.description || ""}`.toLowerCase().includes(query.toLowerCase()))
  return <div><PageTitle title="Departments" subtitle="Add and browse the departments in your school." action={<Button icon="plus" onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "Add department"}</Button>} />
    {showForm && <form className="card form-card" onSubmit={(e) => void submit(e)}><div className="form-grid"><label className="field"><span>Department name *</span><input name="department_name" required value={name} onChange={(e) => setName(e.target.value)} /></label><label className="field"><span>Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label></div><div className="form-actions"><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save department"}</Button></div></form>}
    <section className="card table-card"><div className="staff-toolbar"><input placeholder="Search departments..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      {loading ? <LoadingState text="Loading departments..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : filtered.length === 0 ? <EmptyState message={query ? "No departments match your search." : "No departments yet. Tap Add department to create the first one."} /> : <div className="table-scroll"><table><thead><tr><th>ID</th><th>Department</th><th>Description</th></tr></thead><tbody>{filtered.map((d) => <tr key={d.department_id}><td>{d.department_id}</td><td><strong>{d.department_name}</strong></td><td>{d.description || "—"}</td></tr>)}</tbody></table></div>}
    </section>
  </div>
}

type Row = Record<string, any>

type FieldDef = {
  name: string
  label: string
  type?: "text" | "email" | "number" | "time" | "select"
  required?: boolean
  options?: string[]
  optionsFrom?: "departments" | "faculty" | "subjects"
}

type ColumnDef = { key: string; label: string }

const nonFacultyFields: FieldDef[] = [
  { name: "employeeId", label: "Employee ID", required: true },
  { name: "name", label: "Full name", required: true },
  { name: "department", label: "Department", type: "select", optionsFrom: "departments", required: true },
  { name: "position", label: "Position", required: true },
  { name: "email", label: "Email address", type: "email" },
  { name: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"], required: true },
]
const nonFacultyColumns: ColumnDef[] = [
  { key: "nonFacultyId", label: "ID" }, { key: "employeeId", label: "Employee ID" }, { key: "name", label: "Name" },
  { key: "department", label: "Department" }, { key: "position", label: "Position" }, { key: "email", label: "Email" }, { key: "status", label: "Status" },
]

const subjectFields: FieldDef[] = [
  { name: "code", label: "Subject code", required: true },
  { name: "name", label: "Subject name", required: true },
  { name: "department", label: "Department", type: "select", optionsFrom: "departments" },
  { name: "units", label: "Units", type: "number", required: true },
]
const subjectColumns: ColumnDef[] = [
  { key: "subjectId", label: "ID" }, { key: "code", label: "Code" }, { key: "name", label: "Subject" },
  { key: "department", label: "Department" }, { key: "units", label: "Units" },
]

const scheduleFields: FieldDef[] = [
  { name: "subject", label: "Subject", type: "select", optionsFrom: "subjects", required: true },
  { name: "faculty", label: "Faculty", type: "select", optionsFrom: "faculty", required: true },
  { name: "section", label: "Section", required: true },
  { name: "day", label: "Day", type: "select", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
  { name: "startTime", label: "Start time", type: "time", required: true },
  { name: "endTime", label: "End time", type: "time", required: true },
  { name: "room", label: "Room", required: true },
]
const scheduleColumns: ColumnDef[] = [
  { key: "scheduleId", label: "ID" }, { key: "subject", label: "Subject" }, { key: "faculty", label: "Faculty" },
  { key: "section", label: "Section" }, { key: "day", label: "Day" }, { key: "startTime", label: "Start" },
  { key: "endTime", label: "End" }, { key: "room", label: "Room" },
]

const lookupEndpoint: Record<string, string> = { departments: "/departments", faculty: "/faculty", subjects: "/subjects" }

function CrudModule({ title, subtitle, singular, endpoint, idKey, fields, columns, notify }: {
  title: string
  subtitle: string
  singular: string
  endpoint: string
  idKey: string
  fields: FieldDef[]
  columns: ColumnDef[]
  notify: (message: string) => void
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [lookups, setLookups] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState("")

  const sources = useMemo(
    () => Array.from(new Set(fields.map((f) => f.optionsFrom).filter(Boolean))) as string[],
    [fields]
  )

  async function load() {
    setLoading(true); setError("")
    try {
      const [main, ...extra] = await Promise.all([api.get(endpoint), ...sources.map((s) => api.get(lookupEndpoint[s]))])
      setRows(Array.isArray(main.data) ? main.data : [])
      const next: Record<string, string[]> = {}
      sources.forEach((source, i) => {
        const data = extra[i].data
        if (source === "departments") next[source] = (Array.isArray(data?.data) ? data.data : []).map((x: Row) => x.department_name)
        else if (source === "faculty") next[source] = (Array.isArray(data) ? data : []).map((x: Row) => x.name)
        else next[source] = (Array.isArray(data) ? data : []).map((x: Row) => `${x.code} - ${x.name}`)
      })
      setLookups(next)
    } catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [endpoint])

  function optionsFor(field: FieldDef): string[] | undefined {
    if (field.options) return field.options
    if (field.optionsFrom) return lookups[field.optionsFrom]
    return undefined
  }

  function openAdd() {
    const initial: Record<string, string> = {}
    fields.forEach((f) => { const opts = optionsFor(f); initial[f.name] = f.type === "select" && opts && opts.length ? opts[0] : "" })
    setForm(initial); setEditingId(null); setFormError(""); setShowForm(true)
  }

  function openEdit(row: Row) {
    const initial: Record<string, string> = {}
    fields.forEach((f) => { initial[f.name] = row[f.name] === undefined || row[f.name] === null ? "" : String(row[f.name]) })
    setForm(initial); setEditingId(row[idKey]); setFormError(""); setShowForm(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setFormError("")
    const payload: Row = {}
    fields.forEach((f) => { payload[f.name] = f.type === "number" ? Number(form[f.name]) : form[f.name] })
    try {
      if (editingId !== null) await api.put(`${endpoint}/${editingId}`, payload)
      else await api.post(endpoint, payload)
      notify(`${singular} ${editingId !== null ? "updated" : "saved"}.`)
      setShowForm(false); setEditingId(null)
      await load()
    } catch (err) { setFormError(apiError(err)) }
    finally { setSaving(false) }
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}?`)) return
    try { await api.delete(`${endpoint}/${row[idKey]}`); notify(`${singular} deleted.`); await load() }
    catch (err) { notify(apiError(err)) }
  }

  const filtered = rows.filter((row) => columns.map((c) => String(row[c.key] ?? "")).join(" ").toLowerCase().includes(query.toLowerCase()))

  return <div>
    <PageTitle title={title} subtitle={subtitle} action={<Button icon="plus" onClick={() => (showForm ? setShowForm(false) : openAdd())}>{showForm ? "Cancel" : `Add ${singular.toLowerCase()}`}</Button>} />
    {showForm && <form className="card form-card" onSubmit={(e) => void submit(e)}>
      <div className="form-grid">
        {fields.map((f) => {
          const opts = optionsFor(f)
          const useSelect = f.type === "select" && opts && opts.length > 0
          return <label className="field" key={f.name}>
            <span>{f.label}{f.required && <b> *</b>}</span>
            {useSelect
              ? <select required={f.required} value={form[f.name] ?? ""} onChange={(e) => setForm((c) => ({ ...c, [f.name]: e.target.value }))}>{opts!.map((o) => <option key={o} value={o}>{o}</option>)}</select>
              : <input type={f.type === "select" ? "text" : f.type || "text"} min={f.type === "number" ? 1 : undefined} required={f.required} value={form[f.name] ?? ""} onChange={(e) => setForm((c) => ({ ...c, [f.name]: e.target.value }))} />}
          </label>
        })}
      </div>
      {formError && <p className="form-error" role="alert">{formError}</p>}
      <div className="form-actions"><Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId !== null ? "Save changes" : `Save ${singular.toLowerCase()}`}</Button></div>
    </form>}
    <section className="card table-card">
      <div className="staff-toolbar"><input aria-label={`Search ${title}`} placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      {loading ? <LoadingState text={`Loading ${title.toLowerCase()}...`} />
        : error ? <ErrorState error={error} retry={() => void load()} />
        : filtered.length === 0 ? <EmptyState message={query ? `No ${title.toLowerCase()} match your search.` : `No ${title.toLowerCase()} yet. Tap the Add button to create the first one.`} />
        : <div className="table-scroll"><table>
          <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th>Actions</th></tr></thead>
          <tbody>{filtered.map((row) => <tr key={row[idKey]}>
            {columns.map((c) => <td key={c.key}>{c.key === "status" ? <Badge tone={row.status === "ACTIVE" ? "green" : "gray"}>{row.status}</Badge> : String(row[c.key] ?? "—")}</td>)}
            <td><ActionButtons onEdit={() => openEdit(row)} onDelete={() => void remove(row)} /></td>
          </tr>)}</tbody>
        </table></div>}
    </section>
  </div>
}

type Breakdown = { label: string; total: number }
type ReportSummary = {
  totals: Record<string, number>
  facultyByDepartment: Breakdown[]
  nonFacultyByDepartment: Breakdown[]
  subjectsByDepartment: Breakdown[]
  schedulesByDay: Breakdown[]
}

function BreakdownTable({ title, name, rows }: { title: string; name: string; rows: Breakdown[] }) {
  return <section className="card table-card" style={{ marginTop: 16 }}>
    <div className="card-heading"><div><h2>{title}</h2></div></div>
    {rows.length === 0 ? <EmptyState message="Nothing to report yet." /> : <div className="table-scroll"><table>
      <thead><tr><th>{name}</th><th>Total</th></tr></thead>
      <tbody>{rows.map((r) => <tr key={r.label}><td><strong>{r.label}</strong></td><td>{r.total}</td></tr>)}</tbody>
    </table></div>}
  </section>
}

function Reports() {
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  async function load() {
    setLoading(true); setError("")
    try { const response = await api.get<ReportSummary>("/reports/summary"); setSummary(response.data) }
    catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  const stats = summary ? [
    ["Total faculty", summary.totals.faculty], ["Active faculty", summary.totals.facultyActive], ["Inactive faculty", summary.totals.facultyInactive],
    ["Non-faculty staff", summary.totals.nonFaculty], ["Departments", summary.totals.departments], ["Subjects", summary.totals.subjects],
    ["Class schedules", summary.totals.schedules],
  ] : []
  return <div><PageTitle title="Reports" subtitle="A quick look at the numbers." />
    {loading ? <LoadingState text="Crunching the numbers..." />
      : error ? <ErrorState error={error} retry={() => void load()} />
      : summary && <>
        <div className="report-grid">{stats.map(([label, value]) => <article className="card report-stat" key={label as string}><strong>{value}</strong><p>{label}</p></article>)}</div>
        <BreakdownTable title="Faculty by department" name="Department" rows={summary.facultyByDepartment} />
        <BreakdownTable title="Non-faculty by department" name="Department" rows={summary.nonFacultyByDepartment} />
        <BreakdownTable title="Subjects by department" name="Department" rows={summary.subjectsByDepartment} />
        <BreakdownTable title="Class schedules by day" name="Day" rows={summary.schedulesByDay} />
      </>}
  </div>
}

function AppSettings() {
  const { user } = useAuth()
  return <div><PageTitle title="Settings" subtitle="Your account details." />
    <section className="card form-card"><div className="form-grid">
      <div><strong>Name</strong><p>{user.name}</p></div>
      <div><strong>Email</strong><p>{user.email}</p></div>
      <div><strong>Role</strong><p>{user.role}</p></div>
    </div></section>
  </div>
}

type UserRow = { _id: string; name: string; email: string; role: Role; isActive: boolean }

function UsersPage({ notify }: { notify: (message: string) => void }) {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  async function load() {
    setLoading(true); setError("")
    try { const response = await api.get<UserRow[]>("/auth/users"); setUsers(Array.isArray(response.data) ? response.data : []) }
    catch (err) { setError(apiError(err)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  async function changeRole(id: string, role: Role) {
    try { await api.patch(`/auth/users/${id}/role`, { role }); notify("Role updated."); await load() }
    catch (err) { notify(apiError(err)) }
  }
  return <div><PageTitle title="User Accounts" subtitle="Choose what each person who signed up can do." />
    <section className="card table-card">
      {loading ? <LoadingState text="Loading users..." /> : error ? <ErrorState error={error} retry={() => void load()} /> : users.length === 0 ? <EmptyState message="No user accounts yet." /> :
        <div className="table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>
          {users.map((u) => <tr key={u._id}><td><strong>{u.name}</strong></td><td>{u.email}</td><td>
            <select value={u.role} disabled={u._id === me.id} onChange={(e) => void changeRole(u._id, e.target.value as Role)}>
              <option value="admin">admin</option><option value="staff">staff</option><option value="faculty">faculty</option>
            </select>
          </td></tr>)}
        </tbody></table></div>}
    </section>
  </div>
}

function AuthPage({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const body = Object.fromEntries(new FormData(e.currentTarget))
    setBusy(true); setError("")
    try {
      const { data } = await api.post<{ token: string; user: User }>(mode === "login" ? "/auth/login" : "/auth/register", body)
      localStorage.setItem("token", data.token)
      onAuth(data.user)
    } catch (err) { setError(apiError(err)) }
    finally { setBusy(false) }
  }

  return <div className="auth-wrap">
    <form className="card form-card auth-card" onSubmit={(e) => void submit(e)}>
      <Logo />
      <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
      <p className="auth-sub">{mode === "login" ? "Log in to continue." : "It only takes a minute."}</p>
      {mode === "signup" && <Field label="Full name" name="name" required />}
      <Field label="Email" name="email" type="email" required />
      <Field label="Password" name="password" type="password" required />
      {mode === "signup" && <SelectField label="Role" name="role" options={["faculty", "staff"]} />}
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}</Button>
      <Button variant="ghost" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError("") }}>
        {mode === "login" ? "No account yet? Sign up" : "Already have an account? Log in"}
      </Button>
    </form>
  </div>
}

function AppInner({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth()
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
    case "non-faculty": content = <CrudModule title="Non-Faculty" subtitle="Admin, support and other non-teaching staff." singular="Non-faculty record" endpoint="/non-faculty" idKey="nonFacultyId" fields={nonFacultyFields} columns={nonFacultyColumns} notify={notify} />; break
    case "subjects": content = <CrudModule title="Subjects" subtitle="The subjects you offer and their units." singular="Subject" endpoint="/subjects" idKey="subjectId" fields={subjectFields} columns={subjectColumns} notify={notify} />; break
    case "schedules": content = <CrudModule title="Class Schedules" subtitle="Who teaches what, when and where." singular="Schedule" endpoint="/schedules" idKey="scheduleId" fields={scheduleFields} columns={scheduleColumns} notify={notify} />; break
    case "reports": content = <Reports />; break
    case "settings": content = <AppSettings />; break
    case "users": content = <UsersPage notify={notify} />; break
    default: content = <Dashboard go={(next) => { if (next === "add-faculty") setSelectedFacultyId(null); setPage(next) }} />
  }
    if (!canAccess(page, user.role)) content = <EmptyState message="You do not have permission to view this page." />
  return <Shell page={page} setPage={setPage} onLogout={onLogout}>{content}{toast && <div className="toast" role="status"><span><Icon name="check" size={15} /></span>{toast}</div>}</Shell>
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(() => !!localStorage.getItem("token"))

  useEffect(() => {
    if (!localStorage.getItem("token")) return
    api.get<{ user: User }>("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setChecking(false))
  }, [])

  function logout() { localStorage.removeItem("token"); setUser(null) }

  if (checking) return <LoadingState text="Loading..." />
  if (!user) return <AuthPage onAuth={setUser} />
  return <AuthCtx.Provider value={{ user, canEdit: user.role !== "faculty" }}><AppInner onLogout={logout} /></AuthCtx.Provider>
}