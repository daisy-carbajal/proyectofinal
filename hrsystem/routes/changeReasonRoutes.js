const express = require("express");
const changeReasonController = require("../controllers/changeReasonController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_SETTINGS"),
  changeReasonController.createChangeReason
);

router.get(
  "/",
  checkPermission("VIEW_SETTINGS"),
  changeReasonController.getAllChangeReasons
);

router.put(
  "/u/:id",
  checkPermission("EDIT_SETTINGS"),
  changeReasonController.updateChangeReason
);

router.patch(
  "/d/:id",
  checkPermission("EDIT_SETTINGS"),
  changeReasonController.deactivateChangeReason
);

router.delete(
  "/:id",
  checkPermission("DELETE_SETTINGS"),
  changeReasonController.deleteChangeReason
);

module.exports = router;
