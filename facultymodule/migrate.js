// One-time import of the OLD data/db.json (file storage) into MongoDB Atlas.
// Usage: npm run migrate     (safe to run twice; it upserts by _id)
require('./loadenv');
const fs = require('fs'), path = require('path'), { MongoClient } = require('mongodb');
const file = path.join(__dirname, 'data', 'db.json');
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI is missing in .env'); process.exit(1); }
if (!fs.existsSync(file)) { console.log('No data/db.json found - nothing to import.'); process.exit(0); }
(async () => {
  const old = JSON.parse(fs.readFileSync(file, 'utf8')), c = new MongoClient(process.env.MONGODB_URI), db = (await c.connect(), c.db(process.env.DB_NAME || 'idsc'));
  const put = async (name, docs) => { if (docs.length) await db.collection(name).bulkWrite(docs.map(d => ({ replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true } }))); console.log(name.padEnd(12), docs.length); };
  for (const k of ['faculty', 'nonfaculty', 'departments', 'subjects', 'schedules']) await put(k, (old[k] || []).map(d => ({ ...d, _id: d._id || require('crypto').randomBytes(8).toString('hex') })));
  await put('log', (old.log || []).map((d, i) => ({ ...d, _id: d._id || 'log' + i })));
  await put('users', (old.users || []).map(({ id, ...u }) => ({ ...u, _id: id, role: 'admin' })));
  if (old.cfg && old.cfg.college) await db.collection('cfg').updateOne({ _id: 'cfg' }, { $set: { college: old.cfg.college } }, { upsert: true });
  console.log('Done.'); await c.close();
})().catch(e => { console.error(e.message); process.exit(1); });
