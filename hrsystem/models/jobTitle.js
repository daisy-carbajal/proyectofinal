const { check } = require("express-validator");

const jobTitleValidations = [
  check("Title")
    .isLength({ min: 1, max: 50 })
    .withMessage("El título debe tener entre 1 y 50 caracteres"),
  check("Description")
    .isLength({ max: 255 })
    .withMessage("La descripción no debe exceder los 255 caracteres"),
];

module.exports = { jobTitleValidations };