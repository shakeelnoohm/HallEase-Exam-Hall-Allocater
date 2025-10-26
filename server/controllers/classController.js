const Class = require('../models/Class');

// Add new class
exports.addClass = async (req, res) => {
  try {
    const { date, time } = req.body;

    // ✅ Check if class already exists for same date & time
    const existingClass = await Class.findOne({ date, time });
    if (existingClass) {
      return res.status(400).json({
        message: 'A class is already scheduled for this date and time',
      });
    }

    // ✅ Add new class
    const newClass = new Class(req.body);
    await newClass.save();

    res.status(201).json({
      message: 'Class added successfully',
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding class',
      error: error.message,
    });
  }
};

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching classes',
      error: error.message,
    });
  }
};
