const express = require("express");
const router = express.Router();
const { userValidations } = require("../models/user");
const { validateFields } = require("../middlewares/validateFields");
const { upload } = require("../middlewares/upload");
const { checkPermission } = require("../middlewares/checkRolePermission");
const verifyToken = require("../middlewares/auth");
const userController = require("../controllers/userController");

router.post(
  "/",
  checkPermission("CREATE_USER"),
  userValidations,
  validateFields,
  userController.createUser
);

router.get(
  "/",
  verifyToken,
  checkPermission("VIEW_USER"),
  userController.getAllUsers
);

router.get(
  "/details",
  checkPermission("VIEW_USER"),
  userController.getAllUserDetails
);

router.get(
  "/user-details/:id",
  checkPermission("VIEW_USER"),
  userController.getUserDetailsById
);

router.put("/u/:id", checkPermission("EDIT_USER"), userController.updateUser);

router.patch(
  "/user-detail/:id",
  checkPermission("EDIT_USER"),
  userController.updateUserField
);

router.patch(
  "/d/:id",
  checkPermission("EDIT_USER"),
  userController.deactivateUser
);

router.post(
  "/import-csv",
  upload.single("file"),
  checkPermission("CREATE_USER"),
  userController.importUsersFromCSV
);

router.delete(
  "/:id",
  checkPermission("DELETE_USER"),
  userController.deleteUser
);

module.exports = router;
