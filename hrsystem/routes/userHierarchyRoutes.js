const express = require("express");
const router = express.Router();
const userHierarchyController = require("../controllers/userHierarchyController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_USER"),
  userHierarchyController.createUserHierarchy
);

router.get(
  "/",
  checkPermission("VIEW_USER"),
  userHierarchyController.getAllUserHierarchies
);

router.put(
  "/:id",
  checkPermission("EDIT_USER"),
  userHierarchyController.updateUserHierarchy
);

router.patch(
  "/:id",
  checkPermission("EDIT_USER"),
  userHierarchyController.deactivateUserHierarchy
);

router.delete(
  "/:id",
  checkPermission("DELETE_USER_HIERARCHY"),
  userHierarchyController.deleteUserHierarchy
);

module.exports = router;
