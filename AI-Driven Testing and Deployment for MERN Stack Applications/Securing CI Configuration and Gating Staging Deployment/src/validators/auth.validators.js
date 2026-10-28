import { body } from "express-validator";

export const registerRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ max: 60 })
    .withMessage("Name must be at most 60 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .toLowerCase(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .custom((value) => Buffer.byteLength(value) <= 72)
    .withMessage("Password must be at most 72 bytes"),
];

export const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .toLowerCase(),
  body("password").notEmpty().withMessage("Password is required"),
];
