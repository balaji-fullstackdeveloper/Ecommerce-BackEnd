const express = require("express");
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const {
  registerUser,
  googleRegisterUser,
  loginUser,
  loginGoogleUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  githubRegistration,
  loginGithubUser,
} = require("../controllers/authController");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/google/register").post(googleRegisterUser);
router.route("/github/register").post(githubRegistration);
router.route("/login").post(loginUser);
router.route("/google/login").post(loginGoogleUser);
router.route("/github/login").post(loginGithubUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/change").put(isAuthenticatedUser, changePassword);
router.route("/myprofile").get(isAuthenticatedUser, getUserProfile);
router
  .route("/update")
  .put(isAuthenticatedUser, upload.single("avatar"), updateProfile);

//Admin routes
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
