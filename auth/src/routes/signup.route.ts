import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request.middleware";
import { User } from "../models/user.model";
import { ENDPOINT } from "../constants/endpoint.constant";
import { BadRequestError } from "../errors/bad-request.error";

const router = express.Router();

const validate = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

const handler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("Email in use");
  }
  const user = User.build({ email, password });
  await user.save();

  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );
  req.session = {
    jwt: userJwt,
  };
  res.status(201).send(user);
};

router.post(`${ENDPOINT}/signup`, validate, validateRequest, handler);

export { router as signupRouter };
