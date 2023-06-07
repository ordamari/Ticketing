import express from "express";
import { ENDPOINT } from "../constants/endpoint.constant";

const router = express.Router();

router.post(`${ENDPOINT}/signin`, (req, res) => {
  res.send("Hi there!");
});

export { router as signinRouter };
