const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/v1/auth/register
// Only works while there are NO users yet (creates the first admin).
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(403).json({ message: "Registration is closed. An admin already exists." });
    }

    const user = await User.create({ name, email, password, role: "admin" });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(400).json({ message: e.message });
  }
};

// POST /api/v1/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /api/v1/auth/me
exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};