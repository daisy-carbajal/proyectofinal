const { check } = require("express-validator");

const departmentValidations = [
  check("Name")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres"),
];

module.exports = { departmentValidations };
