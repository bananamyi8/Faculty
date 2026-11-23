// IDSC Faculty Management System - server (Node 18+, MongoDB Atlas)
process.env.TZ = process.env.TZ || 'Asia/Manila';
require('./loadenv');
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { MongoClient } = require('mongodb');
const PORT = process.env.PORT || 3000, URI = process.env.MONGODB_URI, DBN = process.env.DB_NAME || 'idsc';
const SECURE = process.env.COOKIE_SECURE === '1', PROXY = process.env.TRUST_PROXY === '1', LATE = process.env.LATE_AFTER || '08:15';
const PUB = path.join(__dirname, 'public');
if (!URI) { console.error('MONGODB_URI is missing. Copy .env.example to .env and fill it in.'); process.exit(1); }

// ---------- roles & collections ----------
const ROLES = ['admin', 'depthead', 'faculty'];
const COLS = ['faculty', 'nonfaculty', 'departments', 'subjects', 'schedules', 'leaves', 'attendance', 'grades'];
const VIEW = { admin: COLS, depthead: COLS, faculty: ['faculty', 'departments', 'subjects', 'schedules', 'leaves', 'attendance', 'grades'] };
const WRITE = { faculty: ['admin'], nonfaculty: ['admin'], departments: ['admin'], subjects: ['admin', 'depthead'], schedules: ['admin', 'depthead'] };
const SORT = { users: { name: 1 }, leaves: { at: -1 }, attendance: { date: -1, faculty: 1 }, grades: { subject: 1, student: 1 } };
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUS = ['Active', 'On Leave', 'Inactive'], TYPES = ['Permanent', 'Contractual', 'Part-time'];
const LEAVE = ['Sick Leave', 'Vacation Leave', 'Emergency Leave', 'Maternity/Paternity Leave', 'Study Leave', 'Other'];
const ATT = ['Present', 'Late', 'Absent', 'Excused'], TERMS = ['Prelim', 'Midterm', 'Final'];
const C = {
  faculty: { req: ['name', 'id', 'dept', 'status'], opt: ['email', 'pos', 'photo'], key: 'id', label: 'Faculty ID', enums: { status: STATUS } },
  nonfaculty: { req: ['name', 'id', 'dept', 'type', 'status'], opt: ['email', 'contact', 'pos', 'photo'], key: 'id', label: 'Employee ID', enums: { status: STATUS, type: TYPES } },
  departments: { req: ['name'], opt: ['head'], key: 'name', label: 'Department name' },
  subjects: { req: ['code', 'title', 'units', 'dept'], opt: [], key: 'code', label: 'Subject code' },
  schedules: { req: ['subject', 'section', 'faculty', 'room', 'day', 'start', 'end'], opt: [], enums: { day: DAYS } }
};

// ---------- helpers ----------
let db;
const T = n => db.collection(n), one = (n, q) => T(n).findOne(q);
const all = (n, q = {}) => T(n).find(q).sort(SORT[n] || {}).toArray();
const uid = () => crypto.randomBytes(8).toString('hex');
const fail = (http, msg) => Object.assign(new Error(msg), { http });
const rx = s => new RegExp('^' + String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
const mins = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + m; };
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const nowT = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const DATE = /^\d{4}-\d\d-\d\d$/, TIME = /^\d\d:\d\d$/, okDate = s => DATE.test(s) && !isNaN(Date.parse(s));
const cfg = async () => { const c = await one('cfg', { _id: 'cfg' }); return { college: (c && c.college) || 'Infotech Development System Colleges' }; };
const addLog = async (m, s) => {
  await T('log').insertOne({ _id: uid(), t: Date.now(), m, s });
  const old = await T('log').find({}, { projection: { _id: 1 } }).sort({ t: -1 }).skip(50).toArray();
  if (old.length) await T('log').deleteMany({ _id: { $in: old.map(x => x._id) } });
};

// ---------- passwords & sessions (sessions live in MongoDB, so restarts keep people signed in) ----------
const hash = (pw, salt = crypto.randomBytes(16).toString('hex')) => salt + ':' + crypto.scryptSync(pw, salt, 64).toString('hex');
const check = (pw, stored) => { const [salt, h] = String(stored || ':').split(':'); const a = Buffer.from(hash(pw, salt).split(':')[1], 'hex'), b = Buffer.from(h, 'hex'); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const tries = new Map();
const cookie = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(c => c[0]));
const ipOf = req => (PROXY && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress;
async function authUser(req) {
  const t = cookie(req).sid; if (!t) return null;
  const s = await one('sessions', { _id: t }); if (!s || s.exp < new Date()) return null;
  const u = await one('users', { _id: s.uid }); if (!u) return null;
  if (u.facultyId) u.fac = await one('faculty', { _id: u.facultyId });
  return u;
}
async function startSession(res, u) {
  const t = crypto.randomBytes(24).toString('hex');
  await T('sessions').insertOne({ _id: t, uid: u._id, exp: new Date(Date.now() + 8 * 3600e3) });
  res.setHeader('Set-Cookie', `sid=${t}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${SECURE ? '; Secure' : ''}`);
}
const pub = u => ({ id: u._id, name: u.name, username: u.username, role: u.role, dept: u.dept || (u.fac && u.fac.dept) || '', fid: u.fac ? u.fac._id : null, fname: u.fac ? u.fac.name : '' });
async function userView(x) {
  const f = x.facultyId && await one('faculty', { _id: x.facultyId }), { pw, ...r } = x;
  return { ...r, fcode: f ? f.id : '', fname: f ? f.name : '' };
}

// ---------- what each role may see / change ----------
const need = (u, ...roles) => { if (!roles.includes(u.role)) throw fail(403, 'You do not have permission to do that.'); };
async function scope(u, col) {
  if (u.role === 'admin') return {};
  if (u.role === 'depthead') {
    if (col === 'departments') return { name: u.dept };
    if (col === 'schedules') return { faculty: { $in: (await all('faculty', { dept: u.dept })).map(f => f.name) } };
    return { dept: u.dept };
  }
  const f = u.fac; if (!f) return { _id: null };
  if (col === 'faculty') return { _id: f._id };
  if (col === 'departments') return { name: f.dept };
  if (col === 'subjects') return { dept: f.dept };
  if (col === 'schedules') return { faculty: f.name };
  return { fid: f._id };
}
const inScope = async (u, col, id) => one(col, { $and: [{ _id: String(id) }, await scope(u, col)] });
async function writable(u, col, d) {
  if (u.role === 'admin') return;
  if (col === 'subjects' && d.dept === u.dept) return;
  if (col === 'schedules') { const f = await one('faculty', { name: d.faculty }); if (f && f.dept === u.dept) return; }
  throw fail(403, 'You can only manage records of your own department.');
}
const canGrade = (u, facultyName) => u.role === 'admin' || (u.fac && u.fac.name === facultyName);

// ---------- validation for the five core collections ----------
function clean(col, body) {
  const c = C[col], d = {};
  for (const k of [...c.req, ...c.opt]) {
    let v = body[k];
    if (v === undefined || v === null) continue;
    if (k === 'photo') { if (typeof v === 'string' && v.startsWith('data:image/') && v.length < 300000) d.photo = v; continue; }
    d[k] = String(v).trim();
  }
  for (const k of c.req) if (!d[k]) throw fail(400, `${k} is required.`);
  for (const [k, list] of Object.entries(c.enums || {})) if (!list.includes(d[k])) throw fail(400, `Invalid ${k}.`);
  return d;
}
async function validate(col, d, id) {
  const c = C[col], has = async (arr, k, v) => !!(await one(arr, { [k]: v })), notMe = { $ne: id || '__new__' };
  if (c.key && await one(col, { _id: notMe, [c.key]: rx(d[c.key]) })) throw fail(409, `That ${c.label.toLowerCase()} already exists.`);
  if ((col === 'faculty' || col === 'subjects') && !(await has('departments', 'name', d.dept))) throw fail(400, 'Choose an existing department.');
  if (col === 'subjects' && !(Number(d.units) > 0)) throw fail(400, 'Units must be a positive number.');
  if (col === 'schedules') {
    if (!(await has('subjects', 'code', d.subject))) throw fail(400, 'Choose an existing subject.');
    if (!(await has('faculty', 'name', d.faculty))) throw fail(400, 'Choose an existing faculty member.');
    if (!TIME.test(d.start) || !TIME.test(d.end) || mins(d.start) >= mins(d.end)) throw fail(400, 'End time must be after the start time.');
    const near = await T('schedules').find({ _id: notMe, day: d.day, $or: [{ faculty: d.faculty }, { room: rx(d.room) }] }).toArray();
    const x = near.find(s => mins(s.start) < mins(d.end) && mins(d.start) < mins(s.end));
    if (x) throw fail(409, `Conflict: ${x.faculty === d.faculty ? d.faculty + ' is' : 'room ' + x.room + ' is'} already booked for ${x.subject} (${x.start}–${x.end}).`);
  }
}
async function cascade(col, old, d) {
  const ren = (arr, k, a, b) => a !== b && T(arr).updateMany({ [k]: a }, { $set: { [k]: b } });
  if (col === 'departments') for (const arr of ['faculty', 'subjects', 'leaves', 'attendance', 'grades', 'users']) await ren(arr, 'dept', old.name, d.name);
  if (col === 'faculty') {
    await ren('schedules', 'faculty', old.name, d.name);
    for (const arr of ['leaves', 'attendance', 'grades']) { await ren(arr, 'faculty', old.name, d.name); if (old.dept !== d.dept) await T(arr).updateMany({ fid: old._id }, { $set: { dept: d.dept } }); }
  }
  if (col === 'subjects') { await ren('schedules', 'subject', old.code, d.code); await ren('grades', 'subject', old.code, d.code); }
}
async function inUse(col, r) {
  if (col === 'departments' && (await one('faculty', { dept: r.name }) || await one('subjects', { dept: r.name }) || await one('users', { dept: r.name }))) return 'This department still has faculty, subjects, or a department head account. Reassign or remove them first.';
  if (col === 'subjects' && await one('schedules', { subject: r.code })) return 'This subject is used in a class schedule. Remove the schedule first.';
  if (col === 'faculty' && await one('schedules', { faculty: r.name })) return 'This faculty member has class schedules. Remove or reassign them first.';
  if (col === 'faculty' && await one('users', { facultyId: r._id })) return 'A login account is linked to this faculty member. Delete the account first.';
  if (col === 'schedules' && await one('grades', { sid: r._id })) return 'Grades are recorded for this class. Delete the grades first.';
}
const label = r => r.name || r.code || `${r.subject} ${r.section}`;

// ---------- HTTP helpers ----------
const HDR = { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'same-origin', ...(SECURE ? { 'Strict-Transport-Security': 'max-age=31536000' } : {}) };
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', ...HDR }); res.end(JSON.stringify(obj)); };
const readBody = req => new Promise((ok, no) => {
  let n = 0; const ch = [];
  req.on('data', c => { n += c.length; if (n > 15e6) { no(fail(413, 'Request too large.')); req.destroy(); } else ch.push(c); });
  req.on('end', () => { try { ok(ch.length ? JSON.parse(Buffer.concat(ch).toString()) : {}); } catch (e) { no(fail(400, 'Invalid JSON.')); } });
});
async function snapshot(u) {
  const out = { me: pub(u), cfg: await cfg(), log: [], users: [] };
  for (const k of COLS) out[k] = VIEW[u.role].includes(k) ? await all(k, await scope(u, k)) : [];
  if (u.role === 'admin') { out.log = await T('log').find().sort({ t: -1 }).limit(50).toArray(); out.users = await Promise.all((await all('users')).map(userView)); }
  return out;
}
async function userClean(b, id) {
  const name = String(b.name || '').trim(), username = String(b.username || '').trim().toLowerCase(), role = b.role, d = { name, username, role };
  if (!name || !username) throw fail(400, 'Name and username are required.');
  if (!ROLES.includes(role)) throw fail(400, 'Choose a role.');
  if (await one('users', { username, _id: { $ne: id || '__new__' } })) throw fail(409, 'That username is already taken.');
  if (role === 'depthead') { if (!b.dept || !(await one('departments', { name: b.dept }))) throw fail(400, 'Choose the department this head manages.'); d.dept = b.dept; }
  if (b.fcode) {
    const f = await one('faculty', { id: b.fcode }); if (!f) throw fail(400, 'Choose an existing faculty record.');
    if (await one('users', { facultyId: f._id, _id: { $ne: id || '__new__' } })) throw fail(409, 'That faculty record already has a login.');
    d.facultyId = f._id;
  } else if (role === 'faculty') throw fail(400, 'Link a faculty account to a faculty record.');
  return d;
}

// ---------- API ----------
async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean).slice(1), m = req.method, [a, id, sub] = parts, u = await authUser(req);

  if (a === 'status' && m === 'GET') return send(res, 200, { needsSetup: !(await T('users').countDocuments({})), user: u && pub(u), cfg: await cfg() });

  if (a === 'setup' && m === 'POST') {
    if (await T('users').countDocuments({})) throw fail(403, 'Setup is already done.');
    const b = await readBody(req);
    if (!b.username || !b.name || !b.password || String(b.password).length < 6) throw fail(400, 'Enter your name, a username, and a password of at least 6 characters.');
    const nu = { _id: uid(), name: String(b.name).trim(), username: String(b.username).trim().toLowerCase(), role: 'admin', pw: hash(String(b.password)) };
    await T('users').insertOne(nu);
    if (b.college && b.college.trim()) await T('cfg').updateOne({ _id: 'cfg' }, { $set: { college: b.college.trim() } }, { upsert: true });
    await addLog('System set up', `${nu.name} created the administrator account`); await startSession(res, nu);
    return send(res, 200, { ok: true });
  }

  if (a === 'login' && m === 'POST') {
    const ip = ipOf(req), t = tries.get(ip) || { n: 0, at: Date.now() };
    if (Date.now() - t.at > 6e4) { t.n = 0; t.at = Date.now(); }
    if (t.n >= 8) throw fail(429, 'Too many attempts. Wait a minute and try again.');
    const b = await readBody(req), lu = await one('users', { username: String(b.username || '').trim().toLowerCase() });
    if (!lu || !check(String(b.password || ''), lu.pw)) { t.n++; tries.set(ip, t); throw fail(401, 'Wrong username or password.'); }
    await startSession(res, lu); return send(res, 200, { ok: true });
  }

  if (a === 'logout' && m === 'POST') { const s = cookie(req).sid; if (s) await T('sessions').deleteOne({ _id: s }); res.setHeader('Set-Cookie', 'sid=; Path=/; Max-Age=0'); return send(res, 200, { ok: true }); }

  if (!u) throw fail(401, 'Please sign in.');

  if (a === 'data' && m === 'GET') return send(res, 200, await snapshot(u));

  if (a === 'settings' && m === 'PUT') {
    const b = await readBody(req), set = {};
    if (b.college && b.college.trim() && u.role === 'admin') await T('cfg').updateOne({ _id: 'cfg' }, { $set: { college: b.college.trim() } }, { upsert: true });
    if (b.name && b.name.trim()) set.name = b.name.trim();
    if (b.password) { if (String(b.password).length < 6) throw fail(400, 'Password must be at least 6 characters.'); set.pw = hash(String(b.password)); }
    if (Object.keys(set).length) await T('users').updateOne({ _id: u._id }, { $set: set });
    return send(res, 200, { ok: true });
  }

  // ----- user accounts (admin only) -----
  if (a === 'users') {
    need(u, 'admin');
    if (m === 'GET' && !id) return send(res, 200, await Promise.all((await all('users')).map(userView)));
    if (m === 'POST' && !id) {
      const b = await readBody(req), d = await userClean(b);
      if (!b.password || String(b.password).length < 6) throw fail(400, 'Password must be at least 6 characters.');
      const r = { _id: uid(), ...d, pw: hash(String(b.password)) };
      await T('users').insertOne(r); await addLog('Account created', `${r.name} (${r.role})`); return send(res, 201, await userView(r));
    }
    const old = await one('users', { _id: id }); if (!old) throw fail(404, 'Account not found.');
    if (m === 'PUT') {
      const b = await readBody(req), d = await userClean(b, id);
      if (id === u._id && d.role !== u.role) throw fail(400, "You can't change your own role.");
      if (b.password && String(b.password).length < 6) throw fail(400, 'Password must be at least 6 characters.');
      const r = { _id: id, ...d, pw: b.password ? hash(String(b.password)) : old.pw };
      await T('users').replaceOne({ _id: id }, r); if (id !== u._id) await T('sessions').deleteMany({ uid: id });
      await addLog('Account updated', `${r.name} (${r.role})`); return send(res, 200, await userView(r));
    }
    if (m === 'DELETE') {
      if (id === u._id) throw fail(400, "You can't delete your own account.");
      await T('users').deleteOne({ _id: id }); await T('sessions').deleteMany({ uid: id }); await addLog('Account deleted', old.name); return send(res, 200, { ok: true });
    }
  }

  // ----- backup / restore / reset (admin only) -----
  if (a === 'backup' && m === 'GET') { need(u, 'admin'); const o = { cfg: await cfg(), log: await all('log') }; for (const k of COLS) o[k] = await all(k); return send(res, 200, o); }
  if (a === 'restore' && m === 'POST') {
    need(u, 'admin'); const b = await readBody(req);
    if (!Object.keys(C).every(k => Array.isArray(b[k]))) throw fail(400, 'That is not a valid backup file.');
    for (const k of COLS) if (Array.isArray(b[k])) { await T(k).deleteMany({}); if (b[k].length) await T(k).insertMany(b[k].map(x => ({ ...x, _id: x._id || uid() }))); }
    await T('log').deleteMany({}); if (Array.isArray(b.log) && b.log.length) await T('log').insertMany(b.log.map(x => ({ ...x, _id: x._id || uid() })));
    if (b.cfg && b.cfg.college) await T('cfg').updateOne({ _id: 'cfg' }, { $set: { college: b.cfg.college } }, { upsert: true });
    await addLog('Data restored', 'A backup was restored'); return send(res, 200, { ok: true });
  }
  if (a === 'reset' && m === 'POST') { need(u, 'admin'); for (const k of COLS) await T(k).deleteMany({}); await T('log').deleteMany({}); await addLog('Data erased', 'All records were deleted'); return send(res, 200, { ok: true }); }

  // ----- leave requests -----
  if (a === 'leaves') {
    if (m === 'GET' && !id) return send(res, 200, await all('leaves', await scope(u, 'leaves')));
    if (m === 'POST' && !id) {
      if (!u.fac) throw fail(403, 'Only accounts linked to a faculty record can file leave requests.');
      const b = await readBody(req), d = { type: String(b.type || ''), from: String(b.from || ''), to: String(b.to || b.from || ''), reason: String(b.reason || '').trim() };
      if (!LEAVE.includes(d.type)) throw fail(400, 'Choose a leave type.');
      if (!okDate(d.from) || !okDate(d.to) || d.from > d.to) throw fail(400, 'Enter valid dates. The end date cannot be before the start date.');
      if (!d.reason) throw fail(400, 'Please give a reason.');
      const clash = await one('leaves', { fid: u.fac._id, status: { $in: ['Pending', 'Approved'] }, from: { $lte: d.to }, to: { $gte: d.from } });
      if (clash) throw fail(409, `You already have a ${clash.status.toLowerCase()} leave request for ${clash.from} to ${clash.to}.`);
      const r = { _id: uid(), fid: u.fac._id, faculty: u.fac.name, dept: u.fac.dept, ...d, status: 'Pending', at: Date.now(), by: '', note: '' };
      await T('leaves').insertOne(r); await addLog('Leave requested', `${r.faculty} — ${r.type}, ${r.from}`); return send(res, 201, r);
    }
    const r = await inScope(u, 'leaves', id); if (!r) throw fail(404, 'Record not found.');
    if (m === 'PUT' && sub === 'decision') {
      need(u, 'admin', 'depthead');
      if (u.fac && r.fid === u.fac._id) throw fail(403, "You can't decide on your own request.");
      if (r.status !== 'Pending') throw fail(409, 'This request was already decided.');
      const b = await readBody(req); if (!['Approved', 'Rejected'].includes(b.status)) throw fail(400, 'Choose Approved or Rejected.');
      const note = String(b.note || '').trim().slice(0, 200);
      await T('leaves').updateOne({ _id: id }, { $set: { status: b.status, by: u.name, note, decidedAt: Date.now() } });
      if (b.status === 'Approved') for (let d = new Date(r.from + 'T00:00:00'), end = new Date(r.to + 'T00:00:00'), n = 0; d <= end && n < 92; d.setDate(d.getDate() + 1), n++) {
        if (d.getDay() === 0 || d.getDay() === 6) continue;
        await T('attendance').updateOne({ fid: r.fid, date: isoDate(d) }, { $setOnInsert: { _id: uid(), faculty: r.faculty, dept: r.dept, status: 'Excused', in: '', out: '', note: 'Approved ' + r.type } }, { upsert: true });
      }
      await addLog('Leave ' + b.status.toLowerCase(), `${r.faculty} — ${r.type}, ${r.from}`); return send(res, 200, await one('leaves', { _id: id }));
    }
    if (m === 'DELETE') {
      if (u.role !== 'admin' && !(u.fac && r.fid === u.fac._id && r.status === 'Pending')) throw fail(403, 'Only your own pending requests can be cancelled.');
      await T('leaves').deleteOne({ _id: id }); await addLog('Leave removed', `${r.faculty} — ${r.type}, ${r.from}`); return send(res, 200, { ok: true });
    }
  }

  // ----- attendance -----
  if (a === 'attendance') {
    if (m === 'GET' && !id) return send(res, 200, await all('attendance', await scope(u, 'attendance')));
    if (m === 'POST' && id === 'clock') {
      if (!u.fac) throw fail(403, 'Only accounts linked to a faculty record can time in or out.');
      const b = await readBody(req), date = isoDate(new Date()), t = nowT(), rec = await one('attendance', { fid: u.fac._id, date });
      if (b.action === 'in') {
        if (rec && rec.in) throw fail(409, `You already timed in today at ${rec.in}.`);
        const st = t > LATE ? 'Late' : 'Present';
        if (rec) await T('attendance').updateOne({ _id: rec._id }, { $set: { in: t, status: st } });
        else await T('attendance').insertOne({ _id: uid(), fid: u.fac._id, faculty: u.fac.name, dept: u.fac.dept, date, status: st, in: t, out: '', note: '' });
        return send(res, 200, { ok: true, time: t, status: st });
      }
      if (b.action === 'out') {
        if (!rec || !rec.in) throw fail(409, 'Time in first.');
        if (rec.out) throw fail(409, `You already timed out today at ${rec.out}.`);
        await T('attendance').updateOne({ _id: rec._id }, { $set: { out: t } }); return send(res, 200, { ok: true, time: t });
      }
      throw fail(400, 'Unknown action.');
    }
    need(u, 'admin', 'depthead');
    if (m === 'DELETE') { if (!(await inScope(u, 'attendance', id))) throw fail(404, 'Record not found.'); await T('attendance').deleteOne({ _id: id }); return send(res, 200, { ok: true }); }
    if (m === 'POST' || m === 'PUT') {
      if (m === 'PUT' && !(await inScope(u, 'attendance', id))) throw fail(404, 'Record not found.');
      const b = await readBody(req), f = await one('faculty', { name: String(b.faculty || '') });
      if (!f) throw fail(400, 'Choose an existing faculty member.');
      if (u.role === 'depthead' && f.dept !== u.dept) throw fail(403, 'You can only manage attendance of your own department.');
      const d = { fid: f._id, faculty: f.name, dept: f.dept, date: String(b.date || ''), status: String(b.status || ''), in: String(b.in || ''), out: String(b.out || ''), note: String(b.note || '').trim().slice(0, 200) };
      if (!okDate(d.date)) throw fail(400, 'Enter a valid date.');
      if (!ATT.includes(d.status)) throw fail(400, 'Choose a status.');
      if ((d.in && !TIME.test(d.in)) || (d.out && !TIME.test(d.out)) || (d.in && d.out && d.out <= d.in)) throw fail(400, 'Time out must be after time in.');
      if (await one('attendance', { fid: f._id, date: d.date, _id: { $ne: id || '__new__' } })) throw fail(409, 'That faculty member already has a record for that date. Edit it instead.');
      const r = { _id: id || uid(), ...d };
      if (m === 'POST') await T('attendance').insertOne(r); else await T('attendance').replaceOne({ _id: id }, r);
      return send(res, m === 'POST' ? 201 : 200, r);
    }
  }

  // ----- grades -----
  if (a === 'grades') {
    if (m === 'GET' && !id) return send(res, 200, await all('grades', await scope(u, 'grades')));
    let old = null;
    if (id) { old = await inScope(u, 'grades', id); if (!old) throw fail(404, 'Record not found.'); if (!canGrade(u, old.faculty)) throw fail(403, 'Only the class teacher or an administrator can change grades.'); }
    if (m === 'DELETE') { await T('grades').deleteOne({ _id: id }); return send(res, 200, { ok: true }); }
    if (m === 'POST' || m === 'PUT') {
      const b = await readBody(req), sc = await one('schedules', { _id: String(b.sid || '') });
      if (!sc) throw fail(400, 'Choose a class.');
      if (!canGrade(u, sc.faculty)) throw fail(403, 'You can only enter grades for your own classes.');
      const studentId = String(b.studentId || '').trim(), student = String(b.student || '').trim(), term = String(b.term || ''), g = Number(b.grade);
      if (!studentId || !student) throw fail(400, 'Enter the student ID and name.');
      if (!TERMS.includes(term)) throw fail(400, 'Choose a term.');
      if (String(b.grade ?? '').trim() === '' || !(g >= 0 && g <= 100)) throw fail(400, 'Grade must be a number from 0 to 100.');
      if (await one('grades', { sid: sc._id, studentId: rx(studentId), term, _id: { $ne: id || '__new__' } })) throw fail(409, 'That student already has a grade for this class and term. Edit it instead.');
      const f = await one('faculty', { name: sc.faculty });
      const r = { _id: id || uid(), sid: sc._id, subject: sc.subject, section: sc.section, faculty: sc.faculty, fid: f ? f._id : null, dept: f ? f.dept : '', studentId, student, term, grade: Math.round(g * 100) / 100 };
      if (m === 'POST') await T('grades').insertOne(r); else await T('grades').replaceOne({ _id: id }, r);
      return send(res, m === 'POST' ? 201 : 200, r);
    }
  }

  // ----- core records: faculty, non-faculty, departments, subjects, schedules -----
  if (C[a]) {
    if (!VIEW[u.role].includes(a)) throw fail(403, 'You do not have permission to do that.');
    const sc = await scope(u, a);
    if (m === 'GET' && !id) return send(res, 200, await all(a, sc));
    need(u, ...(WRITE[a] || []));
    if (m === 'POST' && !id) {
      const d = clean(a, await readBody(req)); await validate(a, d); await writable(u, a, d);
      const r = { _id: uid(), ...d }; await T(a).insertOne(r); await addLog('Record added', label(r) + ' — ' + a); return send(res, 201, r);
    }
    const r = await inScope(u, a, id); if (!r) throw fail(404, 'Record not found.');
    if (m === 'PUT') {
      const d = clean(a, await readBody(req)); await validate(a, d, id); await writable(u, a, d);
      await T(a).replaceOne({ _id: id }, { _id: id, ...d }); await cascade(a, r, d); await addLog('Record updated', label(d) + ' — ' + a); return send(res, 200, { _id: id, ...d });
    }
    if (m === 'DELETE') {
      const why = await inUse(a, r); if (why) throw fail(409, why);
      await T(a).deleteOne({ _id: id });
      if (a === 'faculty') for (const k of ['leaves', 'attendance', 'grades']) await T(k).deleteMany({ fid: id });
      await addLog('Record deleted', label(r) + ' was removed from ' + a); return send(res, 200, { ok: true });
    }
  }
  throw fail(404, 'Not found.');
}

// ---------- static files ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
function serve(req, res, url) {
  let p = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (p === '/' || p === '\\') p = '/index.html';
  const f = path.join(PUB, p);
  if (!f.startsWith(PUB) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', ...HDR }); fs.createReadStream(f).pipe(res);
}

(async () => {
  const client = new MongoClient(URI, { serverSelectionTimeoutMS: 10000 });
  await client.connect(); db = client.db(DBN);
  await T('users').createIndex({ username: 1 }, { unique: true });
  await T('sessions').createIndex({ exp: 1 }, { expireAfterSeconds: 0 });
  await T('attendance').createIndex({ fid: 1, date: 1 }, { unique: true });
  await T('grades').createIndex({ sid: 1, studentId: 1, term: 1 }, { unique: true });
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/healthz') return send(res, 200, { ok: true });
    if (url.pathname.startsWith('/api/')) {
      try { await api(req, res, url); } catch (e) {
        const st = e.http || (e.code === 11000 ? 409 : 500);
        send(res, st, { error: e.http ? e.message : e.code === 11000 ? 'That record already exists.' : 'Server error.' }); if (st === 500) console.error(e);
      }
    } else serve(req, res, url);
  }).listen(PORT, () => console.log(`IDSC Faculty Management running on port ${PORT} (database: ${DBN})`));
  const bye = () => { server.close(); client.close().finally(() => process.exit(0)); };
  process.on('SIGINT', bye); process.on('SIGTERM', bye);
})().catch(e => { console.error('Could not start:', e.message); process.exit(1); });
