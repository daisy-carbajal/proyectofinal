const { check } = require("express-validator");

class User {
  constructor(
    FirstName,
    LastName,
    PersonalEmail,
    BirthDate,
    Gender,
    PhoneNumber,
    TaxID,
    StreetAddress,
    City,
    State,
    PostalCode,
    Country,
    Status,
    CreatedBy
  ) {
    this.firstName = FirstName;
    this.lastName = LastName;
    this.personalEmail = PersonalEmail;
    this.birthDate = BirthDate;
    this.gender = Gender;
    this.phoneNumber = PhoneNumber;
    this.taxId = TaxID;
    this.streetAddress = StreetAddress;
    this.city = City;
    this.state = State;
    this.postalCode = PostalCode;
    this.country = Country;
    this.status = Status;
    this.createdBy = CreatedBy;
  }
}

const userValidations = [
  check("FirstName").notEmpty().withMessage("El nombre es requerido"),
  check("LastName").notEmpty().withMessage("El apellido es requerido"),
  check("PersonalEmail")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),
  check("PhoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("El número de teléfono no es válido"),
  check("Gender")
    .optional()
    .isIn(["M", "F", "O"])
    .withMessage("El género debe ser M, F o O"),
  check("TaxID")
    .notEmpty()
    .withMessage("El número de identidad es requerido")
    .isLength({ min: 13, max: 13 })
    .withMessage("El número de Identidad debe tener exactamente 13 caracteres"),
];

module.exports = { User, userValidations };
