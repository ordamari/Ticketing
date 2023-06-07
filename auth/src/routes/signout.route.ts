import express, { Request, Response } from "express";
import { body, validationResult, ValidationChain } from "express-validator";
import { ENDPOINT } from "../constants/endpoint.constant";

const router = express.Router();

const validate = [] as ValidationChain[];

const handler = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }
  console.log("creating user");

  const { email, password } = req.body;
  res.send({});
};

router.post(`${ENDPOINT}/signout`, validate, handler);

export { router as signoutRouter };
