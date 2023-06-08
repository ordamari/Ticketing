import express, { Request, Response } from "express";
import { ENDPOINT } from "../constants/endpoint.constant";

const router = express.Router();

const handler = (req: Request, res: Response) => {
  req.session = null;
  return res.send({});
};

router.post(`${ENDPOINT}/signout`, handler);

export { router as signoutRouter };
