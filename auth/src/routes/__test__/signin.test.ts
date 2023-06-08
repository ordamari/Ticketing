import request from "supertest";
import { app } from "../../app";
import { ENDPOINT } from "../../constants/endpoint.constant";

const validEmail = "test@test.com";
const validPassword = "password";

it("fails when a email that does not exist supplied", async () => {
  return request(app)
    .post(`${ENDPOINT}/signin`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(201);

  await request(app)
    .post(`${ENDPOINT}/signin`)
    .send({
      email: validEmail,
      password: "wrongPassword",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(201);

  const response = await request(app)
    .post(`${ENDPOINT}/signin`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
