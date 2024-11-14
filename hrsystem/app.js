const express = require("express");
const app = express();
//const authenticateToken = require("./middlewares/authenticateToken");

const userRoutes = require("./routes/userRoutes");
const jobTitleRoutes = require("./routes/jobTitleRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");
const disciplinaryActionReasonRoutes = require("./routes/disciplinaryActionReasonRoutes");
const warningLevelRoutes = require("./routes/disciplinaryActionWarningLevelRoutes");
const incidentTypeRoutes = require("./routes/incidentTypeRoutes");
const typeFeedbackRoutes = require("./routes/typeFeedbackRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const disciplinaryActionRoutes = require("./routes/disciplinaryActionRoutes");
const jobTitleChangeRoutes = require("./routes/jobTitleChangeRoutes");
const departmentChangeRoutes = require("./routes/departmentChangeRoutes");
const jobTitleDepartmentRoutes = require("./routes/jobTitleDepartmentRoutes");
const jobTitleRoleRoutes = require("./routes/jobTitleRoleRoutes");
const userRoleRoutes = require("./routes/userRoleRoutes");
const rolePermissionRoutes = require("./routes/rolePermissionRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const disciplinaryActionTaskRoutes = require("./routes/disciplinaryActionTaskRoutes");
const commentFeedbackRoutes = require("./routes/commentFeedbackRoutes");
const evaluationSavedRoutes = require("./routes/evaluationSavedRoutes");
const evaluationTypeRoutes = require("./routes/evaluationTypeRoutes");
const evaluationParameterRoutes = require("./routes/evaluationParameterRoutes");
const EvaluationParameterWeightRoutes = require("./routes/EvaluationParameterWeightRoutes");
const evaluationCalificationRoutes = require("./routes/evaluationCalificationRoutes");
const evaluationMasterRoutes = require("./routes/evaluationMasterRoutes");
const evaluationDetailRoutes = require("./routes/evaluationDetailRoutes");
const actionPlanRoutes = require("./routes/actionPlanRoutes");
const actionPlanTaskRoutes = require("./routes/actionPlanTaskRoutes");
const actionPlanParameterRoutes = require("./routes/actionPlanParameterRoutes");

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/jobtitle", jobTitleRoutes);
app.use("/department", departmentRoutes);
app.use("/role", roleRoutes);
app.use("/auth", authRoutes);
app.use("/da-reason", disciplinaryActionReasonRoutes);
app.use("/warning-levels", warningLevelRoutes);
app.use("/incident-types", incidentTypeRoutes);
app.use("/type-feedback", typeFeedbackRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/incident", incidentRoutes);
app.use("/da", disciplinaryActionRoutes);
app.use("/job-title-change", jobTitleChangeRoutes);
app.use("/department-change", departmentChangeRoutes);
app.use("/job-title-dept", jobTitleDepartmentRoutes);
app.use("/job-title-roles", jobTitleRoleRoutes);
app.use("/user-roles", userRoleRoutes);
app.use("/role-permissions", rolePermissionRoutes);
app.use("/permissions", permissionRoutes);
app.use("/da-tasks", disciplinaryActionTaskRoutes);
app.use("/comment-feedback", commentFeedbackRoutes);
app.use("/eval-saved", evaluationSavedRoutes);
app.use("/eval-type", evaluationTypeRoutes);
app.use("/eval-params", evaluationParameterRoutes);
app.use("/eval-params-weight", EvaluationParameterWeightRoutes);
app.use("/eval-calification", evaluationCalificationRoutes);
app.use("/eval-master", evaluationMasterRoutes);
app.use("/eval-detail", evaluationDetailRoutes);
app.use("/action-plan", actionPlanRoutes);
app.use("/action-plan-task", actionPlanTaskRoutes);
app.use("/action-plan-param", actionPlanParameterRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal.");
});

app.use((req, res, next) => {
  res.status(404).send("Página no encontrada");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
