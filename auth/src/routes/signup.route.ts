import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation.error";
import { ENDPOINT } from "../constants/endpoint.constant";
import { User } from "../models/user.model";
import { BadRequestError } from "../errors/BadRequest.error";

const router = express.Router();

const validate = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

const handler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("Email in use");
  }
  const user = User.build({ email, password });
  await user.save();
  res.status(201).send(user);
};

router.post(`${ENDPOINT}/signup`, validate, handler);

export { router as signupRouter };
