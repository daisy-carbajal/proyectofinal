const express = require("express");
const app = express();

const routes = [
  { path: "/users", route: require("./routes/userRoutes") },
  { path: "/jobtitle", route: require("./routes/jobTitleRoutes") },
  { path: "/department", route: require("./routes/departmentRoutes") },
  { path: "/role", route: require("./routes/roleRoutes") },
  { path: "/auth", route: require("./routes/authRoutes") },
  { path: "/da-reason", route: require("./routes/disciplinaryActionReasonRoutes") },
  { path: "/warning-levels", route: require("./routes/disciplinaryActionWarningLevelRoutes") },
  { path: "/incident-types", route: require("./routes/incidentTypeRoutes") },
  { path: "/type-feedback", route: require("./routes/typeFeedbackRoutes") },
  { path: "/feedback", route: require("./routes/feedbackRoutes") },
  { path: "/incident", route: require("./routes/incidentRoutes") },
  { path: "/da", route: require("./routes/disciplinaryActionRoutes") },
  { path: "/job-title-change", route: require("./routes/jobTitleChangeRoutes") },
  { path: "/department-change", route: require("./routes/departmentChangeRoutes") },
  { path: "/job-title-dept", route: require("./routes/jobTitleDepartmentRoutes") },
  { path: "/job-title-roles", route: require("./routes/jobTitleRoleRoutes") },
  { path: "/user-roles", route: require("./routes/userRoleRoutes") },
  { path: "/role-permissions", route: require("./routes/rolePermissionRoutes") },
  { path: "/permissions", route: require("./routes/permissionRoutes") },
  { path: "/da-tasks", route: require("./routes/disciplinaryActionTaskRoutes") },
  { path: "/comment-feedback", route: require("./routes/commentFeedbackRoutes") },
  { path: "/eval-saved", route: require("./routes/evaluationSavedRoutes") },
  { path: "/eval-type", route: require("./routes/evaluationTypeRoutes") },
  { path: "/eval-params", route: require("./routes/evaluationParameterRoutes") },
  { path: "/eval-params-weight", route: require("./routes/EvaluationParameterWeightRoutes") },
  { path: "/eval-calification", route: require("./routes/evaluationCalificationRoutes") },
  { path: "/eval-master", route: require("./routes/evaluationMasterRoutes") },
  { path: "/eval-detail", route: require("./routes/evaluationDetailRoutes") },
  { path: "/action-plan", route: require("./routes/actionPlanRoutes") },
  { path: "/action-plan-task", route: require("./routes/actionPlanTaskRoutes") },
  { path: "/action-plan-param", route: require("./routes/actionPlanParameterRoutes") },
  { path: "/permission-category", route: require("./routes/permissionCategoryRoutes") },
  { path: "/change-reason", route: require("./routes/changeReasonRoutes")}
];

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json());

routes.forEach((route) => {
  app.use(route.path, route.route);
});

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