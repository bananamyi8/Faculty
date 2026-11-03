import { useMemo, useState, type FormEvent, type ReactNode } from "react"

type Page = "login" | "dashboard" | "faculty" | "add-faculty" | "profile" | "non-faculty" | "add-non-faculty" | "edit-non-faculty" | "non-faculty-profile" | "departments" | "subjects" | "schedules" | "reports" | "settings"

const portraits = [
  "https://images.unsplash.com/photo-1573496527892-904f897eb744?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1628876521188-58ac53e31bf6?auto=format&fit=crop&w=120&q=80",
]

type StaffStatus = "Active" | "On Leave" | "Inactive"
type EmploymentType = "Permanent" | "Contractual" | "Temporary"

type NonFacultyStaff = {
  employeeId: string
  fullName: string
  photo: string
  dateOfBirth: string
  gender: string
  email: string
  contactNumber: string
  address: string
  department: string
  position: string
  dateHired: string
  employmentType: EmploymentType
  status: StaffStatus
  history: string[]
}

const initialNonFacultyStaff: NonFacultyStaff[] = [
  {
    employeeId: "NF-001",
    fullName: "Ana Santos",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    dateOfBirth: "1990-04-12",
    gender: "Female",
    email: "ana.santos@idsc.edu.ph",
    contactNumber: "+63 917 246 8101",
    address: "Ligao City, Albay",
    department: "Registrar's Office",
    position: "Registrar Staff",
    dateHired: "2018-06-04",
    employmentType: "Permanent",
    status: "Active",
    history: [
      "Joined the Registrar's Office as Registrar Staff",
      "Promoted to permanent employment in 2020",
    ],
  },
  {
    employeeId: "NF-002",
    fullName: "John Dela Cruz",
    photo: portraits[1],
    dateOfBirth: "1988-11-23",
    gender: "Male",
    email: "john.delacruz@idsc.edu.ph",
    contactNumber: "+63 918 351 9202",
    address: "Guinobatan, Albay",
    department: "IT Department",
    position: "IT Personnel",
    dateHired: "2020-02-17",
    employmentType: "Permanent",
    status: "Active",
    history: [
      "Joined the IT Department as IT Personnel",
      "Assigned as systems support lead in 2023",
    ],
  },
  {
    employeeId: "NF-003",
    fullName: "Maria Reyes",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    dateOfBirth: "1993-07-08",
    gender: "Female",
    email: "maria.reyes@idsc.edu.ph",
    contactNumber: "+63 905 462 7303",
    address: "Polangui, Albay",
    department: "Accounting Office",
    position: "Accounting Staff",
    dateHired: "2021-08-02",
    employmentType: "Contractual",
    status: "On Leave",
    history: [
      "Joined the Accounting Office as contractual staff",
      "Approved for personal leave",
    ],
  },
  {
    employeeId: "NF-004",
    fullName: "Ramon Garcia",
    photo: portraits[2],
    dateOfBirth: "1985-01-19",
    gender: "Male",
    email: "ramon.garcia@idsc.edu.ph",
    contactNumber: "+63 916 573 6404",
    address: "Oas, Albay",
    department: "Maintenance",
    position: "Maintenance Staff",
    dateHired: "2017-03-13",
    employmentType: "Permanent",
    status: "Inactive",
    history: [
      "Joined the Maintenance Office",
      "Employment marked inactive in 2026",
    ],
  },
  {
    employeeId: "NF-005",
    fullName: "Lea Martinez",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    dateOfBirth: "1991-09-30",
    gender: "Female",
    email: "lea.martinez@idsc.edu.ph",
    contactNumber: "+63 927 684 5505",
    address: "Ligao City, Albay",
    department: "Library",
    position: "Librarian",
    dateHired: "2019-11-05",
    employmentType: "Permanent",
    status: "Active",
    history: [
      "Joined the College Library as Librarian",
      "Appointed library collection coordinator in 2022",
    ],
  },
]

const faculty = [
  {
    id: "FAC-2024-001",
    name: "Dr. Maria Santos",
    email: "m.santos@northfield.edu",
    dept: "Computer Science",
    position: "Professor",
    status: "Active",
    photo: portraits[0],
  },
  {
    id: "FAC-2024-014",
    name: "Prof. Daniel Cruz",
    email: "d.cruz@northfield.edu",
    dept: "Engineering",
    position: "Associate Professor",
    status: "Active",
    photo: portraits[1],
  },
  {
    id: "FAC-2023-089",
    name: "Dr. Adrian Reyes",
    email: "a.reyes@northfield.edu",
    dept: "Business",
    position: "Department Chair",
    status: "On Leave",
    photo: portraits[2],
  },
  {
    id: "FAC-2022-047",
    name: "Prof. Marcus Lee",
    email: "m.lee@northfield.edu",
    dept: "Arts & Sciences",
    position: "Assistant Professor",
    status: "Active",
    photo: portraits[3],
  },
  {
    id: "FAC-2024-112",
    name: "Dr. Liza Mendoza",
    email: "l.mendoza@northfield.edu",
    dept: "Computer Science",
    position: "Lecturer",
    status: "Inactive",
    photo: portraits[0],
  },
]

const departments = [
  {
    code: "CCS",
    name: "Computer Science",
    head: "Dr. Maria Santos",
    count: 32,
    color: "emerald",
  },
  {
    code: "COE",
    name: "Engineering",
    head: "Prof. Daniel Cruz",
    count: 28,
    color: "blue",
  },
  {
    code: "CBA",
    name: "Business Administration",
    head: "Dr. Adrian Reyes",
    count: 24,
    color: "amber",
  },
  {
    code: "CAS",
    name: "Arts & Sciences",
    head: "Prof. Marcus Lee",
    count: 38,
    color: "violet",
  },
]

const subjects = [
  {
    code: "CS 301",
    name: "Data Structures & Algorithms",
    dept: "Computer Science",
    faculty: "Dr. Maria Santos",
    units: 3,
  },
  {
    code: "ENGR 205",
    name: "Engineering Mechanics",
    dept: "Engineering",
    faculty: "Prof. Daniel Cruz",
    units: 4,
  },
  {
    code: "BUS 310",
    name: "Strategic Management",
    dept: "Business",
    faculty: "Dr. Adrian Reyes",
    units: 3,
  },
  {
    code: "HUM 102",
    name: "Art Appreciation",
    dept: "Arts & Sciences",
    faculty: "Prof. Marcus Lee",
    units: 3,
  },
  {
    code: "CS 315",
    name: "Database Management",
    dept: "Computer Science",
    faculty: "Dr. Liza Mendoza",
    units: 3,
  },
]

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
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "danger"
  icon?: string
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
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
        src="/assets/1d386.png"
        alt="Infotech Development System College seal"
      />
      <div>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  )
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [show, setShow] = useState(false)
  return (
    <main className="login-page">
      <section className="login-brand">
        <Logo light />
        <div className="login-copy">
          <span className="eyebrow">FACULTY MANAGEMENT SYSTEM</span>
          <h1>
            Shaping minds.
            <br />
            Building futures.
          </h1>
          <p>
            A unified workspace for Northfield College faculty, departments,
            subjects, and schedules.
          </p>
        </div>
        <p className="copyright">
          © 2026 Northfield College. All rights reserved.
        </p>
      </section>
      <section className="login-panel">
        <form
          className="login-card"
          onSubmit={(event) => {
            event.preventDefault()
            onLogin()
          }}
        >
          <div className="mobile-logo">
            <Logo />
          </div>
          <span className="welcome-mark">
            <Icon name="book" size={24} />
          </span>
          <h2>Welcome back</h2>
          <p>Sign in to access your faculty workspace.</p>
          <Field
            label="Email address"
            type="email"
            placeholder="admin@northfield.edu"
            required
          />
          <label className="field">
            <span>
              Password <b>*</b>
            </span>
            <div className="password">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                aria-label="Show password"
                onClick={() => setShow(!show)}
              >
                <Icon name="eye" size={18} />
              </button>
            </div>
          </label>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <button type="button">Forgot password?</button>
          </div>
          <Button type="submit" className="full">
            Sign in <Icon name="chevron" size={17} />
          </Button>
          <p className="help">
            Need help? <button type="button">Contact IT Support</button>
          </p>
        </form>
      </section>
    </main>
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
        <Logo
          light
          className="sidebar-logo"
          title="Infotech Development System Colleges"
          subtitle={"\u00a0\u00a0"}
        />
        <nav>
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setPage(item.page)
                setOpen(false)
              }}
              className={
                page === item.page ||
                (["add-faculty", "profile"].includes(page) &&
                  item.page === "faculty") ||
                ([
                  "add-non-faculty",
                  "edit-non-faculty",
                  "non-faculty-profile",
                ].includes(page) &&
                  item.page === "non-faculty")
                  ? "active"
                  : ""
              }
            >
              <Icon
                name={item.icon}
                className={
                  item.page === "dashboard"
                    ? "sidebar-icon-fill"
                    : surfaceSidebarPages.has(item.page)
                      ? "sidebar-icon-stroke"
                      : ""
                }
              />
              <span
                className={
                  surfaceSidebarPages.has(item.page)
                    ? "sidebar-surface-text"
                    : ""
                }
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => setPage("login")}>
            <Icon name="logout" className="sidebar-icon-stroke" />
            <span className="sidebar-surface-text">Logout</span>
          </button>
        </div>
      </aside>
      {open && (
        <button
          className="scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <button
            className="menu-btn"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <label className="global-search">
            <Icon name="search" size={17} />
            <input placeholder="Search faculty, subjects, departments..." />
          </label>
          <div className="top-actions">
            <button className="notification" aria-label="Notifications">
              <Icon name="bell" />
              <i>3</i>
            </button>
            <button
              className="profile-button"
              onClick={() => setPage("settings")}
            >
              <img src={portraits[0]} alt="" />
              <span>
                <strong>Marilou Lasangan</strong>
                <small>Administrator</small>
              </span>
              <Icon name="chevron" size={14} />
            </button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

function Dashboard({ go }: { go: (page: Page) => void }) {
  const stats = [
    {
      value: "126",
      label: "Total Faculty",
      change: "+8 this year",
      icon: "faculty",
    },
    {
      value: "12",
      label: "Departments",
      change: "All active",
      icon: "department",
    },
    {
      value: "248",
      label: "Total Subjects",
      change: "+16 this term",
      icon: "subject",
    },
    {
      value: "07",
      label: "Pending Requests",
      change: "Needs attention",
      icon: "calendar",
      amber: true,
    },
  ]
  return (
    <div>
      <section className="hero">
        <div>
          <span className="eyebrow">MONDAY, OCTOBER 13</span>
          <h1>Hello, Dr. Marilou.</h1>
          <p>Here’s what’s happening across your faculty today.</p>
        </div>
        <Button
          variant="secondary"
          icon="plus"
          onClick={() => go("add-faculty")}
        >
          Add faculty
        </Button>
      </section>
      <div className="stat-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.amber ? "amber" : ""}`}>
              <Icon name={stat.icon} />
            </div>
            <div>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              <small>{stat.change}</small>
            </div>
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card activity-card">
          <div className="card-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Latest updates across the college</p>
            </div>
            <button>View all</button>
          </div>
          <div className="activity-list">
            {[
              [
                "faculty",
                "New faculty member added",
                "Prof. Andrea Lim joined Computer Science",
                "12 min ago",
              ],
              [
                "edit",
                "Faculty profile updated",
                "Daniel Cruz updated contact information",
                "1 hr ago",
              ],
              [
                "subject",
                "Subject assignment completed",
                "CS 315 assigned to Dr. Liza Mendoza",
                "3 hrs ago",
              ],
              [
                "calendar",
                "Schedule change approved",
                "Room updated for Engineering Mechanics",
                "Yesterday",
              ],
            ].map(([icon, title, text, time]) => (
              <div className="activity" key={title}>
                <span>
                  <Icon name={icon} size={17} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
                <small>{time}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="card schedule-card">
          <div className="card-heading">
            <div>
              <h2>Upcoming classes</h2>
              <p>Monday, October 13</p>
            </div>
            <button onClick={() => go("schedules")}>View schedule</button>
          </div>
          <div className="class-list">
            <div className="class-row green">
              <time>
                09:00<small>AM</small>
              </time>
              <div>
                <strong>Data Structures</strong>
                <p>BSCS 3A · Lab 204</p>
              </div>
              <Badge>On time</Badge>
            </div>
            <div className="class-row blue">
              <time>
                11:00<small>AM</small>
              </time>
              <div>
                <strong>Database Management</strong>
                <p>BSCS 3B · Room 305</p>
              </div>
            </div>
            <div className="class-row violet">
              <time>
                02:30<small>PM</small>
              </time>
              <div>
                <strong>Faculty Assembly</strong>
                <p>All faculty · Conference Hall</p>
              </div>
            </div>
          </div>
        </section>
        <section className="card faculty-chart">
          <div className="card-heading">
            <div>
              <h2>Faculty statistics</h2>
              <p>Employment status overview</p>
            </div>
            <select>
              <option>This semester</option>
            </select>
          </div>
          <div className="chart-area">
            <div className="donut">
              <div>
                <strong>126</strong>
                <small>Total faculty</small>
              </div>
            </div>
            <div className="legend">
              <span>
                <i className="green-dot" />
                Full-time <b>82</b>
              </span>
              <span>
                <i className="blue-dot" />
                Part-time <b>31</b>
              </span>
              <span>
                <i className="amber-dot" />
                On leave <b>13</b>
              </span>
            </div>
          </div>
        </section>
        <section className="card department-overview">
          <div className="card-heading">
            <div>
              <h2>Department overview</h2>
              <p>Faculty distribution</p>
            </div>
            <button onClick={() => go("departments")}>View departments</button>
          </div>
          {departments.map((dept, i) => (
            <div className="progress-row" key={dept.code}>
              <span>{dept.code}</span>
              <div>
                <i style={{ width: `${[84, 72, 64, 94][i]}%` }} />
              </div>
              <b>{dept.count}</b>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

function DataToolbar({
  placeholder = "Search...",
  addLabel,
  onAdd,
}: {
  placeholder?: string
  addLabel?: string
  onAdd?: () => void
}) {
  return (
    <div className="data-toolbar">
      <label>
        <Icon name="search" size={17} />
        <input placeholder={placeholder} />
      </label>
      <select>
        <option>All departments</option>
        <option>Computer Science</option>
        <option>Engineering</option>
        <option>Business</option>
      </select>
      <select>
        <option>All statuses</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
      {addLabel && (
        <Button icon="plus" onClick={onAdd}>
          {addLabel}
        </Button>
      )}
    </div>
  )
}

function ConfirmDialog({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div className="modal-wrap">
      <div className="modal">
        <span className="danger-icon">
          <Icon name="trash" />
        </span>
        <h2>Delete faculty record?</h2>
        <p>
          This action cannot be undone. The faculty member’s schedule and
          subject assignments will also be removed.
        </p>
        <div>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete record
          </Button>
        </div>
      </div>
    </div>
  )
}

function FacultyPage({
  go,
  notify,
}: {
  go: (p: Page) => void
  notify: (message: string) => void
}) {
  const [confirm, setConfirm] = useState(false)
  return (
    <div>
      <PageTitle
        title="Faculty Management"
        subtitle="Manage faculty profiles, assignments, and employment records."
        action={
          <Button icon="plus" onClick={() => go("add-faculty")}>
            Add faculty
          </Button>
        }
      />
      <section className="card table-card">
        <DataToolbar placeholder="Search by name, ID, or email..." />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Faculty member</th>
                <th>Faculty ID</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="person">
                      <img src={person.photo} alt="" />
                      <div>
                        <strong>{person.name}</strong>
                        <small>{person.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="mono">{person.id}</span>
                  </td>
                  <td>{person.dept}</td>
                  <td>{person.position}</td>
                  <td>
                    <Badge
                      tone={
                        person.status === "Active"
                          ? "green"
                          : person.status === "On Leave"
                            ? "amber"
                            : "gray"
                      }
                    >
                      {person.status}
                    </Badge>
                  </td>
                  <td>
                    <ActionButtons
                      onView={() => go("profile")}
                      onDelete={() => setConfirm(true)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <p>
            Showing <strong>1–5</strong> of <strong>126</strong> faculty members
          </p>
          <div>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>…</button>
            <button>26</button>
            <button>›</button>
          </div>
        </div>
      </section>
      {confirm && (
        <ConfirmDialog
          onClose={() => setConfirm(false)}
          onConfirm={() => {
            setConfirm(false)
            notify("Faculty record deleted successfully.")
          }}
        />
      )}
    </div>
  )
}

function StaffActionButtons({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="actions staff-actions">
      <button aria-label="View staff profile" title="View" onClick={onView}>
        <Icon name="eye" size={16} />
      </button>
      <button aria-label="Edit staff record" title="Edit" onClick={onEdit}>
        <Icon name="edit" size={16} />
      </button>
      <button
        aria-label="Delete staff record"
        title="Delete"
        className="delete"
        onClick={onDelete}
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  )
}

function StaffDeleteDialog({
  staff,
  onClose,
  onConfirm,
}: {
  staff: NonFacultyStaff
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="modal-wrap"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-staff-title"
      >
        <span className="danger-icon">
          <Icon name="trash" />
        </span>
        <h2 id="delete-staff-title">Delete {staff.fullName}?</h2>
        <p>
          This will permanently remove employee record {staff.employeeId}. This
          action cannot be undone.
        </p>
        <div>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete staff
          </Button>
        </div>
      </div>
    </div>
  )
}

function NonFacultyPage({
  records,
  go,
  selectStaff,
  deleteStaff,
}: {
  records: NonFacultyStaff[]
  go: (page: Page) => void
  selectStaff: (id: string) => void
  deleteStaff: (id: string) => void
}) {
  const [query, setQuery] = useState("")
  const [department, setDepartment] = useState("All Departments")
  const [position, setPosition] = useState("All Positions")
  const [status, setStatus] = useState("All Status")
  const [employmentType, setEmploymentType] = useState("All Employment Type")
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<NonFacultyStaff | null>(
    null,
  )
  const pageSize = 3
  const departments = [
    ...new Set(records.map((record) => record.department)),
  ].sort()
  const positions = [
    ...new Set(records.map((record) => record.position)),
  ].sort()
  const filtered = records.filter((record) => {
    const matchesQuery = `${record.fullName} ${record.employeeId}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
    return (
      matchesQuery &&
      (department === "All Departments" || record.department === department) &&
      (position === "All Positions" || record.position === position) &&
      (status === "All Status" || record.status === status) &&
      (employmentType === "All Employment Type" ||
        record.employmentType === employmentType)
    )
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, pageCount)
  const visibleRecords = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  )
  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }
  const openStaff = (id: string, destination: Page) => {
    selectStaff(id)
    go(destination)
  }

  return (
    <div>
      <PageTitle
        title="Non-Faculty Management"
        subtitle="Manage non-teaching personnel and staff information."
        action={
          <Button icon="plus" onClick={() => go("add-non-faculty")}>
            Add Non-Faculty Staff
          </Button>
        }
      />
      <section className="card table-card staff-table-card">
        <div className="staff-toolbar">
          <label className="staff-search">
            <Icon name="search" size={17} />
            <input
              aria-label="Search non-faculty staff"
              value={query}
              onChange={(event) => updateFilter(setQuery, event.target.value)}
              placeholder="Search by name or employee ID..."
            />
          </label>
          <select
            aria-label="Filter by department"
            value={department}
            onChange={(event) =>
              updateFilter(setDepartment, event.target.value)
            }
          >
            <option>All Departments</option>
            {departments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            aria-label="Filter by position"
            value={position}
            onChange={(event) => updateFilter(setPosition, event.target.value)}
          >
            <option>All Positions</option>
            {positions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => updateFilter(setStatus, event.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </select>
          <select
            aria-label="Filter by employment type"
            value={employmentType}
            onChange={(event) =>
              updateFilter(setEmploymentType, event.target.value)
            }
          >
            <option>All Employment Type</option>
            <option>Permanent</option>
            <option>Contractual</option>
            <option>Temporary</option>
          </select>
        </div>
        <div className="table-scroll">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Profile Photo</th>
                <th>Department / Office</th>
                <th>Position / Job Title</th>
                <th>Employment Type</th>
                <th>Contact Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record) => (
                <tr key={record.employeeId}>
                  <td>
                    <span className="mono">{record.employeeId}</span>
                  </td>
                  <td>
                    <strong>{record.fullName}</strong>
                    <small className="staff-email">{record.email}</small>
                  </td>
                  <td>
                    <img
                      className="staff-photo"
                      src={record.photo}
                      alt={`${record.fullName} profile`}
                    />
                  </td>
                  <td>{record.department}</td>
                  <td>{record.position}</td>
                  <td>
                    <span className="employment-pill">
                      {record.employmentType}
                    </span>
                  </td>
                  <td>{record.contactNumber}</td>
                  <td>
                    <Badge
                      tone={
                        record.status === "Active"
                          ? "green"
                          : record.status === "On Leave"
                            ? "amber"
                            : "red"
                      }
                    >
                      {record.status}
                    </Badge>
                  </td>
                  <td>
                    <StaffActionButtons
                      onView={() =>
                        openStaff(record.employeeId, "non-faculty-profile")
                      }
                      onEdit={() =>
                        openStaff(record.employeeId, "edit-non-faculty")
                      }
                      onDelete={() => setPendingDelete(record)}
                    />
                  </td>
                </tr>
              ))}
              {!visibleRecords.length && (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-table">
                      <Icon name="staff" size={26} />
                      <strong>No staff records found</strong>
                      <p>Try changing your search or filter selections.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <p>
            {filtered.length ? (
              <>
                Showing{" "}
                <strong>
                  {(safePage - 1) * pageSize + 1}–
                  {Math.min(safePage * pageSize, filtered.length)}
                </strong>{" "}
                of <strong>{filtered.length}</strong> staff records
              </>
            ) : (
              "Showing 0 staff records"
            )}
          </p>
          <div>
            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (number) => (
                <button
                  className={safePage === number ? "active" : ""}
                  onClick={() => setCurrentPage(number)}
                  key={number}
                >
                  {number}
                </button>
              ),
            )}
            <button
              disabled={safePage === pageCount}
              onClick={() => setCurrentPage(safePage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {pendingDelete && (
        <StaffDeleteDialog
          staff={pendingDelete}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteStaff(pendingDelete.employeeId)
            setPendingDelete(null)
          }}
        />
      )}
    </div>
  )
}

function TextAreaField({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="field field-wide">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={3}
      />
    </label>
  )
}

function StaffForm({
  staff,
  records,
  go,
  onSave,
}: {
  staff?: NonFacultyStaff
  records: NonFacultyStaff[]
  go: (page: Page) => void
  onSave: (staff: NonFacultyStaff, originalId?: string) => void
}) {
  const [photo, setPhoto] = useState(staff?.photo ?? portraits[0])
  const [error, setError] = useState("")
  const isEditing = Boolean(staff)
  const handlePhoto = (file?: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be 5 MB or smaller.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(String(reader.result))
      setError("")
    }
    reader.readAsDataURL(file)
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (name: string) => String(data.get(name) ?? "").trim()
    const employeeId = value("employeeId").toUpperCase()
    if (
      records.some(
        (record) =>
          record.employeeId.toLowerCase() === employeeId.toLowerCase() &&
          record.employeeId !== staff?.employeeId,
      )
    ) {
      setError("That employee ID is already in use.")
      return
    }
    onSave(
      {
        employeeId,
        fullName: value("fullName"),
        photo,
        dateOfBirth: value("dateOfBirth"),
        gender: value("gender"),
        email: value("email"),
        contactNumber: value("contactNumber"),
        address: value("address"),
        department: value("department"),
        position: value("position"),
        dateHired: value("dateHired"),
        employmentType: value("employmentType") as EmploymentType,
        status: value("status") as StaffStatus,
        history: staff?.history ?? [
          `Hired as ${value("position")} in ${value("department")}`,
        ],
      },
      staff?.employeeId,
    )
  }

  return (
    <div>
      <button className="back-link" onClick={() => go("non-faculty")}>
        ‹ Back to Non-Faculty
      </button>
      <PageTitle
        title={isEditing ? "Edit Non-Faculty Staff" : "Add Non-Faculty Staff"}
        subtitle={
          isEditing
            ? "Update employee information and employment details."
            : "Create a new non-teaching personnel record."
        }
      />
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <div className="staff-form-layout">
          <section className="card form-card staff-form-section">
            <div className="section-heading">
              <span>01</span>
              <div>
                <h2>Personal Information</h2>
                <p>Identity, contact details, and profile photo.</p>
              </div>
            </div>
            <div className="staff-photo-field">
              <img src={photo} alt="Staff profile preview" />
              <label className="btn btn-secondary">
                Choose profile photo
                <input
                  name="profilePhoto"
                  type="file"
                  accept="image/png,image/jpeg"
                  required={!isEditing}
                  onChange={(event) => handlePhoto(event.target.files?.[0])}
                />
              </label>
              <small>JPG or PNG, maximum 5 MB.</small>
            </div>
            <div className="form-grid">
              <Field
                label="Employee ID"
                name="employeeId"
                placeholder="e.g. NF-006"
                defaultValue={staff?.employeeId}
                required
              />
              <Field
                label="Full Name"
                name="fullName"
                placeholder="Complete legal name"
                defaultValue={staff?.fullName}
                required
              />
              <Field
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                defaultValue={staff?.dateOfBirth}
                required
              />
              <SelectField
                label="Gender"
                name="gender"
                options={["Female", "Male", "Non-binary", "Prefer not to say"]}
                defaultValue={staff?.gender}
                required
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@idsc.edu.ph"
                defaultValue={staff?.email}
                required
              />
              <Field
                label="Contact Number"
                name="contactNumber"
                placeholder="+63 900 000 0000"
                pattern="[0-9+() -]{7,}"
                defaultValue={staff?.contactNumber}
                required
              />
              <TextAreaField
                label="Complete Address"
                name="address"
                defaultValue={staff?.address}
                required
              />
            </div>
          </section>
          <section className="card form-card staff-form-section">
            <div className="section-heading">
              <span>02</span>
              <div>
                <h2>Employment Information</h2>
                <p>Office assignment and employment status.</p>
              </div>
            </div>
            <div className="form-grid">
              <Field
                label="Department / Office"
                name="department"
                placeholder="e.g. Registrar's Office"
                defaultValue={staff?.department}
                required
              />
              <Field
                label="Position / Job Title"
                name="position"
                placeholder="e.g. Registrar Staff"
                defaultValue={staff?.position}
                required
              />
              <Field
                label="Date Hired"
                name="dateHired"
                type="date"
                defaultValue={staff?.dateHired}
                required
              />
              <SelectField
                label="Employment Type"
                name="employmentType"
                options={["Permanent", "Contractual", "Temporary"]}
                defaultValue={staff?.employmentType}
                required
              />
              <SelectField
                label="Employment Status"
                name="status"
                options={["Active", "Inactive", "On Leave"]}
                defaultValue={staff?.status}
                required
              />
            </div>
          </section>
        </div>
        <div className="form-actions">
          <Button variant="secondary" onClick={() => go("non-faculty")}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Save changes" : "Save staff record"}
          </Button>
        </div>
      </form>
    </div>
  )
}

function StaffProfile({
  staff,
  go,
}: {
  staff?: NonFacultyStaff
  go: (page: Page) => void
}) {
  if (!staff)
    return (
      <div className="card empty-state">
        <Icon name="staff" size={28} />
        <h3>Staff record not found</h3>
        <p>Return to the non-faculty list and select another record.</p>
        <Button onClick={() => go("non-faculty")}>Back to list</Button>
      </div>
    )
  return (
    <div>
      <button className="back-link" onClick={() => go("non-faculty")}>
        ‹ Back to Non-Faculty
      </button>
      <section className="profile-hero staff-profile-hero">
        <div className="profile-main">
          <img src={staff.photo} alt={staff.fullName} />
          <div>
            <Badge
              tone={
                staff.status === "Active"
                  ? "green"
                  : staff.status === "On Leave"
                    ? "amber"
                    : "red"
              }
            >
              {staff.status}
            </Badge>
            <h1>{staff.fullName}</h1>
            <p>
              {staff.position} · {staff.department}
            </p>
            <span>
              <Icon name="mail" size={15} /> {staff.email}
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          icon="edit"
          onClick={() => go("edit-non-faculty")}
        >
          Edit profile
        </Button>
      </section>
      <div className="profile-meta">
        <div>
          <small>EMPLOYEE ID</small>
          <strong>{staff.employeeId}</strong>
        </div>
        <div>
          <small>CONTACT NUMBER</small>
          <strong>{staff.contactNumber}</strong>
        </div>
        <div>
          <small>ASSIGNED OFFICE</small>
          <strong>{staff.department}</strong>
        </div>
        <div>
          <small>DATE HIRED</small>
          <strong>
            {new Date(`${staff.dateHired}T00:00:00`).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </strong>
        </div>
      </div>
      <div className="staff-profile-grid">
        <section className="card staff-detail-card">
          <div className="card-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Personal and contact details.</p>
            </div>
          </div>
          <div className="info-grid">
            <div>
              <small>Full Name</small>
              <strong>{staff.fullName}</strong>
            </div>
            <div>
              <small>Date of Birth</small>
              <strong>
                {new Date(`${staff.dateOfBirth}T00:00:00`).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </strong>
            </div>
            <div>
              <small>Gender</small>
              <strong>{staff.gender}</strong>
            </div>
            <div>
              <small>Email Address</small>
              <strong>{staff.email}</strong>
            </div>
            <div>
              <small>Contact Number</small>
              <strong>{staff.contactNumber}</strong>
            </div>
            <div>
              <small>Complete Address</small>
              <strong>{staff.address}</strong>
            </div>
          </div>
        </section>
        <section className="card staff-detail-card">
          <div className="card-heading">
            <div>
              <h2>Employment Information</h2>
              <p>Current appointment and office assignment.</p>
            </div>
          </div>
          <div className="info-grid">
            <div>
              <small>Department / Office</small>
              <strong>{staff.department}</strong>
            </div>
            <div>
              <small>Position / Job Title</small>
              <strong>{staff.position}</strong>
            </div>
            <div>
              <small>Employment Type</small>
              <strong>{staff.employmentType}</strong>
            </div>
            <div>
              <small>Employment Status</small>
              <strong>{staff.status}</strong>
            </div>
          </div>
        </section>
        <section className="card staff-history">
          <div className="card-heading">
            <div>
              <h2>Employment History</h2>
              <p>Recorded appointment activity.</p>
            </div>
          </div>
          {staff.history.map((entry, index) => (
            <div className="history-row" key={entry}>
              <span>{index + 1}</span>
              <div>
                <strong>{entry}</strong>
                <small>
                  {index === 0 ? staff.dateHired : "Current record"}
                </small>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

function AddFaculty({
  go,
  notify,
}: {
  go: (p: Page) => void
  notify: (m: string) => void
}) {
  return (
    <div>
      <button className="back-link" onClick={() => go("faculty")}>
        ‹ Back to Faculty
      </button>
      <PageTitle
        title="Add New Faculty"
        subtitle="Create a faculty profile and employment record."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          notify("New faculty member saved successfully.")
          go("faculty")
        }}
      >
        <div className="form-layout">
          <section className="card form-card">
            <div className="section-heading">
              <span>01</span>
              <div>
                <h2>Personal information</h2>
                <p>Basic identity and contact details.</p>
              </div>
            </div>
            <div className="form-grid">
              <Field
                label="Full name"
                placeholder="e.g. Dr. Andrea Lim"
                required
              />
              <Field label="Faculty ID" placeholder="FAC-2026-000" required />
              <Field
                label="Email address"
                type="email"
                placeholder="name@northfield.edu"
                required
              />
              <Field
                label="Phone number"
                placeholder="+63 917 000 0000"
                required
              />
            </div>
          </section>
          <aside className="card photo-upload">
            <div className="upload-circle">
              <Icon name="upload" />
            </div>
            <h3>Profile photo</h3>
            <p>JPG or PNG. Maximum 5 MB.</p>
            <Button variant="secondary">Choose photo</Button>
          </aside>
          <section className="card form-card employment">
            <div className="section-heading">
              <span>02</span>
              <div>
                <h2>Employment details</h2>
                <p>Department and appointment information.</p>
              </div>
            </div>
            <div className="form-grid">
              <SelectField
                label="Department"
                required
                options={[
                  "Select department",
                  "Computer Science",
                  "Engineering",
                  "Business Administration",
                  "Arts & Sciences",
                ]}
              />
              <SelectField
                label="Academic position"
                required
                options={[
                  "Select position",
                  "Professor",
                  "Associate Professor",
                  "Assistant Professor",
                  "Lecturer",
                ]}
              />
              <SelectField
                label="Employment status"
                required
                options={["Full-time", "Part-time", "Visiting Faculty"]}
              />
              <Field label="Date hired" type="date" required />
            </div>
          </section>
        </div>
        <div className="form-actions">
          <Button variant="secondary" onClick={() => go("faculty")}>
            Cancel
          </Button>
          <Button type="submit">Save faculty</Button>
        </div>
      </form>
    </div>
  )
}

function ProfilePage({
  go,
  notify,
}: {
  go: (p: Page) => void
  notify: (m: string) => void
}) {
  const [tab, setTab] = useState("Personal Information")
  const tabs = [
    "Personal Information",
    "Assigned Subjects",
    "Class Schedule",
    "Documents",
  ]
  return (
    <div>
      <button className="back-link" onClick={() => go("faculty")}>
        ‹ Back to Faculty
      </button>
      <section className="profile-hero">
        <div className="profile-main">
          <img src={portraits[0]} alt="Dr. Maria Santos" />
          <div>
            <Badge>Active faculty</Badge>
            <h1>Dr. Maria Santos</h1>
            <p>Professor · Computer Science</p>
            <span>
              <Icon name="mail" size={15} /> m.santos@northfield.edu
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          icon="edit"
          onClick={() => notify("Profile is now ready to edit.")}
        >
          Edit profile
        </Button>
      </section>
      <div className="profile-meta">
        <div>
          <small>FACULTY ID</small>
          <strong>FAC-2024-001</strong>
        </div>
        <div>
          <small>CONTACT NUMBER</small>
          <strong>+63 917 482 1093</strong>
        </div>
        <div>
          <small>DEPARTMENT</small>
          <strong>Computer Science</strong>
        </div>
        <div>
          <small>DATE HIRED</small>
          <strong>August 15, 2018</strong>
        </div>
      </div>
      <div className="tabs">
        {tabs.map((item) => (
          <button
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="card tab-content">
        {tab === "Personal Information" && (
          <>
            <div className="card-heading">
              <div>
                <h2>Personal information</h2>
                <p>Faculty member’s personal and academic details.</p>
              </div>
            </div>
            <div className="info-grid">
              <div>
                <small>Full name</small>
                <strong>Maria Elena Santos, Ph.D.</strong>
              </div>
              <div>
                <small>Preferred name</small>
                <strong>Maria Santos</strong>
              </div>
              <div>
                <small>Email address</small>
                <strong>m.santos@northfield.edu</strong>
              </div>
              <div>
                <small>Phone number</small>
                <strong>+63 917 482 1093</strong>
              </div>
              <div>
                <small>Highest degree</small>
                <strong>Ph.D. in Computer Science</strong>
              </div>
              <div>
                <small>Specialization</small>
                <strong>Machine Learning & Data Science</strong>
              </div>
              <div>
                <small>Office</small>
                <strong>CCS Building, Room 412</strong>
              </div>
              <div>
                <small>Office hours</small>
                <strong>Mon–Thu, 2:00–4:00 PM</strong>
              </div>
            </div>
          </>
        )}
        {tab === "Assigned Subjects" && (
          <div className="subject-cards">
            {subjects.slice(0, 3).map((s) => (
              <article key={s.code}>
                <span>{s.code}</span>
                <strong>{s.name}</strong>
                <p>BSCS · {s.units} units</p>
              </article>
            ))}
          </div>
        )}
        {tab === "Class Schedule" && (
          <div className="class-list">
            <div className="class-row green">
              <time>
                09:00<small>AM</small>
              </time>
              <div>
                <strong>Data Structures</strong>
                <p>Monday / Wednesday · Lab 204</p>
              </div>
            </div>
            <div className="class-row blue">
              <time>
                11:00<small>AM</small>
              </time>
              <div>
                <strong>Database Management</strong>
                <p>Tuesday / Thursday · Room 305</p>
              </div>
            </div>
          </div>
        )}
        {tab === "Documents" && (
          <div className="empty-state">
            <Icon name="subject" size={28} />
            <h3>4 verified documents</h3>
            <p>Employment contract, CV, diploma, and teaching credentials.</p>
            <Button variant="secondary" icon="upload">
              Upload document
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

function Departments({ notify }: { notify: (m: string) => void }) {
  return (
    <div>
      <PageTitle
        title="Departments"
        subtitle="Manage academic departments and department leadership."
        action={
          <Button icon="plus" onClick={() => notify("Department form opened.")}>
            Add department
          </Button>
        }
      />
      <DataToolbar placeholder="Search departments..." />
      <div className="department-grid">
        {departments.map((dept) => (
          <article className="card department-card" key={dept.code}>
            <div className="department-top">
              <span className={`dept-badge ${dept.color}`}>{dept.code}</span>
              <ActionButtons
                onDelete={() =>
                  notify(
                    `${dept.name} is protected from deletion in this demo.`,
                  )
                }
              />
            </div>
            <h2>{dept.name}</h2>
            <p>
              <span>Department head</span>
              <strong>{dept.head}</strong>
            </p>
            <div className="department-foot">
              <span>
                <Icon name="faculty" size={17} /> {dept.count} faculty members
              </span>
              <button>
                View department <Icon name="chevron" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Subjects({ notify }: { notify: (m: string) => void }) {
  return (
    <div>
      <PageTitle
        title="Subject Management"
        subtitle="Organize curriculum and faculty subject assignments."
        action={
          <Button
            icon="plus"
            onClick={() => notify("New subject form opened.")}
          >
            Add subject
          </Button>
        }
      />
      <section className="card table-card">
        <DataToolbar placeholder="Search by subject code or name..." />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Subject code</th>
                <th>Subject name</th>
                <th>Department</th>
                <th>Assigned faculty</th>
                <th>Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.code}>
                  <td>
                    <span className="code-pill">{subject.code}</span>
                  </td>
                  <td>
                    <strong>{subject.name}</strong>
                  </td>
                  <td>{subject.dept}</td>
                  <td>{subject.faculty}</td>
                  <td>{subject.units} units</td>
                  <td>
                    <ActionButtons
                      onDelete={() => notify("Subject archived successfully.")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <p>
            Showing <strong>1–5</strong> of <strong>248</strong> subjects
          </p>
          <div>
            <button>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>
      </section>
    </div>
  )
}

const scheduleItems = [
  {
    day: 0,
    start: 1,
    span: 2,
    title: "Data Structures",
    meta: "BSCS 3A · Lab 204",
    color: "green",
  },
  {
    day: 1,
    start: 3,
    span: 2,
    title: "Database Mgmt.",
    meta: "BSCS 3B · Room 305",
    color: "blue",
  },
  {
    day: 2,
    start: 1,
    span: 2,
    title: "Data Structures",
    meta: "BSCS 3A · Lab 204",
    color: "green",
  },
  {
    day: 3,
    start: 4,
    span: 2,
    title: "Faculty Assembly",
    meta: "Conference Hall",
    color: "violet",
  },
  {
    day: 4,
    start: 2,
    span: 2,
    title: "Thesis Consultation",
    meta: "Faculty Office",
    color: "amber",
  },
]

function Schedules() {
  const [view, setView] = useState("Week")
  const [offset, setOffset] = useState(0)
  const dates = [13, 14, 15, 16, 17].map((n) => n + offset * 7)
  return (
    <div>
      <PageTitle
        title="Faculty Schedule"
        subtitle="View and coordinate faculty classes and academic commitments."
      />
      <section className="card calendar-card">
        <div className="calendar-toolbar">
          <div className="segmented">
            <button
              className={view === "Week" ? "active" : ""}
              onClick={() => setView("Week")}
            >
              Week
            </button>
            <button
              className={view === "Month" ? "active" : ""}
              onClick={() => setView("Month")}
            >
              Month
            </button>
          </div>
          <h2>
            October {13 + offset * 7}–{17 + offset * 7}, 2026
          </h2>
          <div className="calendar-actions">
            <Button variant="secondary" onClick={() => setOffset(offset - 1)}>
              ‹
            </Button>
            <Button variant="secondary" onClick={() => setOffset(0)}>
              Today
            </Button>
            <Button variant="secondary" onClick={() => setOffset(offset + 1)}>
              ›
            </Button>
          </div>
        </div>
        {view === "Week" ? (
          <div className="calendar-scroll">
            <div className="week-calendar">
              <div className="corner" />
              {["MON", "TUE", "WED", "THU", "FRI"].map((day, i) => (
                <div
                  className={`day-head ${
                    i === 0 && offset === 0 ? "today" : ""
                  }`}
                  key={day}
                >
                  <small>{day}</small>
                  <strong>{dates[i]}</strong>
                </div>
              ))}
              {[
                "8 AM",
                "9 AM",
                "10 AM",
                "11 AM",
                "12 PM",
                "1 PM",
                "2 PM",
                "3 PM",
                "4 PM",
              ].map((time) => (
                <div className="time-label" key={time}>
                  {time}
                </div>
              ))}
              {Array.from({ length: 45 }).map((_, i) => (
                <div className="cal-cell" key={i} />
              ))}
              {scheduleItems.map((event) => (
                <div
                  key={event.title + event.day}
                  className={`cal-event ${event.color}`}
                  style={{
                    gridColumn: event.day + 2,
                    gridRow: `${event.start + 2} / span ${event.span}`,
                  }}
                >
                  <strong>{event.title}</strong>
                  <small>{event.meta}</small>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="month-grid">
            {Array.from({ length: 35 }).map((_, i) => (
              <div className={i === 12 ? "current" : ""} key={i}>
                <span>{i + 1}</span>
                {[2, 7, 12, 15, 19, 23, 28].includes(i) && (
                  <i>Class schedule</i>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Reports() {
  return (
    <div>
      <PageTitle
        title="Reports & Analytics"
        subtitle="Review faculty workload, performance, and departmental trends."
        action={
          <Button variant="secondary" icon="upload">
            Export report
          </Button>
        }
      />
      <div className="report-grid">
        <article className="card report-highlight">
          <span className="eyebrow">FACULTY UTILIZATION</span>
          <strong>87.4%</strong>
          <p>Average teaching capacity this semester</p>
          <div>
            <i />
          </div>
          <small>+4.2% from last semester</small>
        </article>
        <article className="card report-stat">
          <Icon name="calendar" />
          <strong>1,842</strong>
          <p>Total teaching hours</p>
        </article>
        <article className="card report-stat">
          <Icon name="subject" />
          <strong>248</strong>
          <p>Active subjects</p>
        </article>
      </div>
      <section className="card report-table">
        <div className="card-heading">
          <div>
            <h2>Department performance</h2>
            <p>Academic year 2025–2026</p>
          </div>
          <select>
            <option>First semester</option>
          </select>
        </div>
        {departments.map((dept, i) => (
          <div className="report-row" key={dept.code}>
            <span className={`dept-badge ${dept.color}`}>{dept.code}</span>
            <div>
              <strong>{dept.name}</strong>
              <small>
                {dept.count} faculty · {[62, 54, 47, 71][i]} subjects
              </small>
            </div>
            <div className="score">
              <i style={{ width: `${[92, 86, 81, 89][i]}%` }} />
            </div>
            <b>{[92, 86, 81, 89][i]}%</b>
          </div>
        ))}
      </section>
    </div>
  )
}

function Settings({
  notify,
  logout,
}: {
  notify: (m: string) => void
  logout: () => void
}) {
  const [section, setSection] = useState("Profile information")
  return (
    <div>
      <PageTitle
        title="Account Settings"
        subtitle="Manage your profile, security, and account preferences."
      />
      <div className="settings-layout">
        <aside className="card settings-nav">
          {["Profile information", "Change password", "Preferences"].map(
            (item) => (
              <button
                className={section === item ? "active" : ""}
                onClick={() => setSection(item)}
                key={item}
              >
                <Icon
                  name={
                    item === "Profile information"
                      ? "faculty"
                      : item === "Change password"
                        ? "lock"
                        : "settings"
                  }
                />
                {item}
              </button>
            ),
          )}
          <button className="logout-link" onClick={logout}>
            <Icon name="logout" />
            Log out
          </button>
        </aside>
        <section className="card settings-content">
          {section === "Profile information" && (
            <>
              <div className="settings-head">
                <img src={portraits[0]} alt="" />
                <div>
                  <h2>Dr. Marilou lasangan</h2>
                  <p>Administrator · Faculty Services</p>
                  <Button variant="secondary">Change photo</Button>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Full name" defaultValue="Dr. Maria Santos" />
                <Field
                  label="Email address"
                  defaultValue="m.santos@northfield.edu"
                />
                <Field label="Phone number" defaultValue="+63 917 482 1093" />
                <Field label="Job title" defaultValue="Faculty Administrator" />
              </div>
              <div className="form-actions">
                <Button onClick={() => notify("Profile changes saved.")}>
                  Save changes
                </Button>
              </div>
            </>
          )}
          {section === "Change password" && (
            <>
              <div className="card-heading">
                <div>
                  <h2>Change password</h2>
                  <p>Use a strong password you don’t use elsewhere.</p>
                </div>
              </div>
              <div className="single-form">
                <Field label="Current password" type="password" />
                <Field label="New password" type="password" />
                <Field label="Confirm new password" type="password" />
                <Button
                  onClick={() => notify("Password updated successfully.")}
                >
                  Update password
                </Button>
              </div>
            </>
          )}
          {section === "Preferences" && (
            <>
              <div className="card-heading">
                <div>
                  <h2>Account preferences</h2>
                  <p>Choose how the system communicates with you.</p>
                </div>
              </div>
              {[
                "Email notifications",
                "Schedule change alerts",
                "Weekly summary report",
                "Pending request reminders",
              ].map((item, i) => (
                <label className="toggle-row" key={item}>
                  <div>
                    <strong>{item}</strong>
                    <p>
                      {i === 0
                        ? "Receive important account and college updates."
                        : "Keep me informed about relevant faculty activity."}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked={i !== 2} />
                </label>
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard")
  const [toast, setToast] = useState("")
  const [nonFacultyRecords, setNonFacultyRecords] = useState(
    initialNonFacultyStaff,
  )
  const [selectedStaffId, setSelectedStaffId] = useState<string>()
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3000)
  }
  const selectedStaff = nonFacultyRecords.find(
    (staff) => staff.employeeId === selectedStaffId,
  )
  const saveStaff = (staff: NonFacultyStaff, originalId?: string) => {
    const isUpdate = Boolean(originalId)
    setNonFacultyRecords((records) =>
      isUpdate
        ? records.map((item) => (item.employeeId === originalId ? staff : item))
        : [...records, staff],
    )
    setSelectedStaffId(staff.employeeId)
    setPage("non-faculty")
    notify(
      isUpdate
        ? "Staff record updated successfully."
        : "Non-faculty staff added successfully.",
    )
  }
  const deleteStaff = (id: string) => {
    setNonFacultyRecords((records) =>
      records.filter((staff) => staff.employeeId !== id),
    )
    if (selectedStaffId === id) setSelectedStaffId(undefined)
    notify("Non-faculty staff record deleted.")
  }
  const content = useMemo(() => {
    switch (page) {
      case "dashboard":
        return <Dashboard go={setPage} />
      case "faculty":
        return <FacultyPage go={setPage} notify={notify} />
      case "add-faculty":
        return <AddFaculty go={setPage} notify={notify} />
      case "profile":
        return <ProfilePage go={setPage} notify={notify} />
      case "non-faculty":
        return (
          <NonFacultyPage
            records={nonFacultyRecords}
            go={setPage}
            selectStaff={setSelectedStaffId}
            deleteStaff={deleteStaff}
          />
        )
      case "add-non-faculty":
        return (
          <StaffForm
            records={nonFacultyRecords}
            go={setPage}
            onSave={saveStaff}
          />
        )
      case "edit-non-faculty":
        return (
          <StaffForm
            staff={selectedStaff}
            records={nonFacultyRecords}
            go={setPage}
            onSave={saveStaff}
          />
        )
      case "non-faculty-profile":
        return <StaffProfile staff={selectedStaff} go={setPage} />
      case "departments":
        return <Departments notify={notify} />
      case "subjects":
        return <Subjects notify={notify} />
      case "schedules":
        return <Schedules />
      case "reports":
        return <Reports />
      case "settings":
        return <Settings notify={notify} logout={() => setPage("login")} />
      default:
        return null
    }
  }, [page, nonFacultyRecords, selectedStaffId])
  if (page === "login")
    return (
      <Login
        onLogin={() => {
          setPage("dashboard")
          notify("Welcome back, Dr. Santos.")
        }}
      />
    )
  return (
    <Shell page={page} setPage={setPage}>
      {content}
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" size={15} />
          </span>
          {toast}
        </div>
      )}
    </Shell>
  )
}
