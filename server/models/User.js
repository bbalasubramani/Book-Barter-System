const mongooses = require('mongoose');
const userSchema = new mongooses.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
module.exports = mongooses.model('User', userSchema);
