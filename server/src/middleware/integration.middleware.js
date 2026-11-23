
const crypto = require("crypto");

exports.verifyIntegrationToken = (req, res, next) => {
  const token = req.headers["x-api-key"];
  const expectedToken = process.env.API_INTEGRATION_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({
      success: false,
      message: "Integration authentication is not configured."
    });
  }

  if (
    typeof token !== "string" ||
    token.length !== expectedToken.length ||
    !crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(expectedToken)
    )
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid API integration token."
    });
  }

  next();
};
