const express = require("express");
const changeReasonController = require("../controllers/changeReasonController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_CHANGE_REASON"),
  changeReasonController.createChangeReason
);

router.get(
  "/",
  checkPermission("VIEW_CHANGE_REASON"),
  changeReasonController.getAllChangeReasons
);

router.put(
  "/u/:id",
  checkPermission("EDIT_CHANGE_REASON"),
  changeReasonController.updateChangeReason
);

router.put(
  "/d/:id",
  checkPermission("DEACTIVATE_CHANGE_REASON"),
  changeReasonController.deactivateChangeReason
);

router.delete(
  "/:id",
  checkPermission("DELETE_CHANGE_REASON"),
  changeReasonController.deleteChangeReason
);

module.exports = router;
