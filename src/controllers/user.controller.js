// controllers/user.controller.js
// We already fetched the user in the 'protect' middleware!
exports.getMe = (req, res, next) => {
  // req.user was attached by the middleware
  res.status(200).json({
    success: true,
    data: req.user,
  });
};