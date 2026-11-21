// Next sequential number for a numeric id field (max + 1).
module.exports = async function nextId(Model, field) {
  const last = await Model.findOne({ [field]: { $ne: null } })
    .sort({ [field]: -1 })
    .select(field)
    .lean();
  return ((last && last[field]) || 0) + 1;
};
