import express from "express";
import { ENDPOINT } from "../constants/endpoint.constant";

const router = express.Router();

router.get(`${ENDPOINT}/current_user`, (req, res) => {
  res.send("Hi there!");
});

export { router as currentUserRouter };
