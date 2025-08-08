const User = require('../models/User');

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ name: user.name, email: user.email });
};
