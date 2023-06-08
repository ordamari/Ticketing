import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ENDPOINT } from "../constants/endpoint.constant";

const router = express.Router();

const handler = async (req: Request, res: Response) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    return res.send({ currentUser: payload });
  } catch (err) {
    return res.send({ currentUser: null });
  }
};

router.get(`${ENDPOINT}/current_user`, handler);

export { router as currentUserRouter };
