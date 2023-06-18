import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user.route";
import { signinRouter } from "./routes/signin.route";
import { signupRouter } from "./routes/signup.route";
import { signoutRouter } from "./routes/signout.route";
import { NotFoundError, errorHandler } from "@ordamaritickets/common";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
