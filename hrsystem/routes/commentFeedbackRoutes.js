const express = require('express');
const commentFeedbackController = require("../controllers/commentFeedbackController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_FEEDBACK"), commentFeedbackController.createCommentFeedback);

router.get('/:id', checkPermission("VIEW_FEEDBACK"), commentFeedbackController.getCommentFeedbackByFeedbackID);

router.put('/u/:id', checkPermission("EDIT_FEEDBACK"), commentFeedbackController.updateCommentFeedback);

router.put('/d/:id', checkPermission("EDIT_FEEDBACK"), commentFeedbackController.deactivateCommentFeedback);

router.delete('/:id', checkPermission("DELETE_FEEDBACK"), commentFeedbackController.deleteCommentFeedback);

module.exports = router;