import request from "supertest";
import { app } from "../../app";
import { ENDPOINT } from "../../constants/endpoint.constant";

const validEmail = "test@test.com";
const validPassword = "password";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: "test.test.com",
      password: validPassword,
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: "",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app).post(`${ENDPOINT}/signup`).send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(201);

  await request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
