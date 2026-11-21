const Faculty = require('../models/Faculty');
const NonFaculty = require('../models/NonFaculty');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Schedule = require('../models/Schedule');

exports.summary = async (req, res) => {
  try {
    const [faculty, nonFaculty, departments, subjects, schedules] = await Promise.all([
      Faculty.countDocuments(),
      NonFaculty.countDocuments(),
      Department.countDocuments(),
      Subject.countDocuments(),
      Schedule.countDocuments()
    ]);
    res.json({ faculty, nonFaculty, departments, subjects, schedules });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.facultyByDepartment = async (req, res) => {
  try {
    const rows = await Faculty.aggregate([
      { $group: { _id: '$department', total: { $sum: 1 } } },
      {
        $lookup: {
          from: Department.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'dept'
        }
      },
      {
        $project: {
          _id: 0,
          department: { $ifNull: [{ $arrayElemAt: ['$dept.name', 0] }, 'Unassigned'] },
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.nonFacultyByDepartment = async (req, res) => {
  try {
    const rows = await NonFaculty.aggregate([
      { $group: { _id: '$department', total: { $sum: 1 } } },
      {
        $lookup: {
          from: Department.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'dept'
        }
      },
      {
        $project: {
          _id: 0,
          department: { $ifNull: [{ $arrayElemAt: ['$dept.name', 0] }, 'Unassigned'] },
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.schedulesPerFaculty = async (req, res) => {
  try {
    const rows = await Schedule.aggregate([
      { $group: { _id: '$faculty', total: { $sum: 1 } } },
      {
        $lookup: {
          from: Faculty.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'f'
        }
      },
      { $unwind: { path: '$f', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          faculty: {
            $ifNull: [
              '$f.name',
              {
                $trim: {
                  input: {
                    $concat: [
                      { $ifNull: ['$f.firstName', ''] },
                      ' ',
                      { $ifNull: ['$f.lastName', ''] }
                    ]
                  }
                }
              }
            ]
          },
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.schedulesPerSubject = async (req, res) => {
  try {
    const rows = await Schedule.aggregate([
      { $group: { _id: '$subject', total: { $sum: 1 } } },
      {
        $lookup: {
          from: Subject.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 's'
        }
      },
      {
        $project: {
          _id: 0,
          subject: { $ifNull: [{ $arrayElemAt: ['$s.name', 0] }, 'Unknown'] },
          code: { $arrayElemAt: ['$s.code', 0] },
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};