import express, { Request, Response } from "express";

import { ENDPOINT } from "../constants/endpoint.constant";
import { currentUser } from "../middlewares/current-user.middleware";

const router = express.Router();

const handler = async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

router.get(`${ENDPOINT}/current_user`, currentUser, handler);

export { router as currentUserRouter };
