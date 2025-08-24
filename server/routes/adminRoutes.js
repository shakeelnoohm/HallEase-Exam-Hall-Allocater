const express = require('express');
const { addAdmin, adminLogin } = require('../controllers/adminController');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

router.post('/register', addAdmin);
router.post('/login', adminLogin);

// Example protected admin route
router.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.admin.id}` });
});

module.exports = router;
