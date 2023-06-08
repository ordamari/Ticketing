import request from "supertest";
import { app } from "../../app";
import { ENDPOINT } from "../../constants/endpoint.constant";

const validEmail = "test@test.com";
const validPassword = "password";

it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get(`${ENDPOINT}/current_user`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual(validEmail);
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get(`${ENDPOINT}/current_user`)
    .send({})
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});
