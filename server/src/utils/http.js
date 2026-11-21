// One place to turn database errors into clean JSON responses.
function sendError(res, e) {
  if (e && e.name === "ValidationError") {
    const detail = Object.values(e.errors).map((x) => x.message).join(", ");
    return res.status(400).json({ message: detail, detail });
  }
  if (e && e.code === 11000) {
    const field = Object.keys(e.keyPattern || e.keyValue || {})[0] || "value";
    const detail = `That ${field} already exists.`;
    return res.status(409).json({ message: detail, detail });
  }
  if (e && e.name === "CastError") {
    return res.status(400).json({ message: "Invalid value", detail: "Invalid value" });
  }
  console.error(e);
  return res.status(500).json({ message: e.message, detail: e.message });
}

function notFound(res, label) {
  const detail = `${label} not found`;
  return res.status(404).json({ message: detail, detail });
}

function badRequest(res, detail) {
  return res.status(400).json({ message: detail, detail });
}

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function pick(body, keys) {
  const out = {};
  for (const k of keys) if (body && body[k] !== undefined) out[k] = body[k];
  return out;
}

module.exports = { sendError, notFound, badRequest, parseId, pick };
