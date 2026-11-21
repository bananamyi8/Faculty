// Generic numeric-id CRUD used by non-faculty, subjects and schedules.
const nextId = require("../utils/ids");
const { sendError, notFound, badRequest, parseId, pick } = require("../utils/http");

module.exports = function createCrud(Model, { idField, label, fields, sort }) {
  return {
    getAll: async (req, res) => {
      try {
        res.json(await Model.find().sort(sort || { [idField]: 1 }));
      } catch (e) { sendError(res, e); }
    },

    getOne: async (req, res) => {
      try {
        const id = parseId(req.params.id);
        if (!id) return badRequest(res, "Invalid ID");
        const doc = await Model.findOne({ [idField]: id });
        if (!doc) return notFound(res, label);
        res.json(doc);
      } catch (e) { sendError(res, e); }
    },

    create: async (req, res) => {
      try {
        const data = pick(req.body, fields);
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const doc = await Model.create({ ...data, [idField]: await nextId(Model, idField) });
            return res.status(201).json(doc);
          } catch (e) {
            const clash = e && e.code === 11000 && e.keyPattern && e.keyPattern[idField];
            if (!clash || attempt === 2) throw e;
          }
        }
      } catch (e) { sendError(res, e); }
    },

    update: async (req, res) => {
      try {
        const id = parseId(req.params.id);
        if (!id) return badRequest(res, "Invalid ID");
        const doc = await Model.findOne({ [idField]: id });
        if (!doc) return notFound(res, label);
        doc.set(pick(req.body, fields));
        await doc.save();
        res.json(doc);
      } catch (e) { sendError(res, e); }
    },

    remove: async (req, res) => {
      try {
        const id = parseId(req.params.id);
        if (!id) return badRequest(res, "Invalid ID");
        const doc = await Model.findOneAndDelete({ [idField]: id });
        if (!doc) return notFound(res, label);
        res.json({ message: `${label} deleted` });
      } catch (e) { sendError(res, e); }
    },
  };
};
