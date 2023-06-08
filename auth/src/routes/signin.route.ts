import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { ENDPOINT } from "../constants/endpoint.constant";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { Password } from "../services/password.service";
import { User } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request.error";

const router = express.Router();

const validate = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").trim().notEmpty().withMessage("You must supply a password"),
];

const handler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }
  const passwordMatch = await Password.compare(existingUser.password, password);
  if (!passwordMatch) {
    throw new BadRequestError("Invalid credentials");
  }
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_KEY!
  );
  req.session = {
    jwt: userJwt,
  };
  res.status(200).send(existingUser);
};

router.post(`${ENDPOINT}/signin`, validate, validateRequest, handler);

export { router as signinRouter };
