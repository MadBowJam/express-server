// controllers/usersController.js
exports.getUsers = (req, res) => {
  res.send('Get users route');
};

exports.postUser = (req, res) => {
  res.send('Post users route');
};

exports.getUserById = (req, res) => {
  res.send(`Get user by Id route: ${req.params.userId}`);
};

exports.putUserById = (req, res) => {
  res.send(`Put user by Id route: ${req.params.userId}`);
};

exports.deleteUserById = (req, res) => {
  res.send(`Delete user by Id route: ${req.params.userId}`);
};
