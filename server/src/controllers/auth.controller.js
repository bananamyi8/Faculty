const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const SELF_SIGNUP_ROLES = ["staff", "faculty"];
const ALL_ROLES = ["admin", "staff", "faculty"];

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

// POST /api/v1/auth/register
// First account becomes admin; later sign-ups can only pick staff or faculty.
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    const isFirstUser = (await User.countDocuments()) === 0;
    const finalRole = isFirstUser
      ? "admin"
      : SELF_SIGNUP_ROLES.includes(role) ? role : "faculty";

    const user = await User.create({ name, email, password, role: finalRole });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: "Email already in use" });
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
    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
    if (!user || !user.isActive || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/v1/auth/me
exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user: publicUser(user) });
};

// GET /api/v1/auth/users  (admin only)
exports.listUsers = async (req, res) => {
  try {
    res.json(await User.find().sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PATCH /api/v1/auth/users/:id/role  (admin only)
exports.setRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!ALL_ROLES.includes(role)) return res.status(400).json({ message: "Invalid role" });
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot change your own role." });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: publicUser(user) });
  } catch (e) { res.status(400).json({ message: e.message }); }
};