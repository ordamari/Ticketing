import request from "supertest";
import { app } from "../../app";
import { ENDPOINT } from "../../constants/endpoint.constant";

const validEmail = "test@test.com";
const validPassword = "password";
const emptyCookie =
  "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly";

it("clears the cookie after signing out", async () => {
  await request(app)
    .post(`${ENDPOINT}/signup`)
    .send({
      email: validEmail,
      password: validPassword,
    })
    .expect(201);

  const response = await request(app)
    .post(`${ENDPOINT}/signout`)
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(emptyCookie);
});
