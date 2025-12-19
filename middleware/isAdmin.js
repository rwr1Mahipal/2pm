exports.isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.isAdmin) {
      return res
        .status(404)
        .json({ message: "You are not admin || authroize" });
    }
    next();
  } catch (error) {
    return res.status(404).json({ message: "Admin checking error", error });
  }
};
