const crypto = require("crypto");

exports.verifyIntegrationToken = (req, res, next) => {
  const expected = process.env.API_INTEGRATION_TOKEN;

  if (!expected) {
    return res.status(500).json({
      success: false,
      message: "Integration authentication is not configured.",
    });
  }

  const sent = req.headers["x-api-key"];
  const a = Buffer.from(typeof sent === "string" ? sent : "");
  const b = Buffer.from(expected);

  // Compare byte lengths (not string lengths) so timingSafeEqual can never throw.
  const valid = typeof sent === "string" && a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: "Invalid API integration token.",
    });
  }

  next();
};
