import { FastifyInstance } from "fastify";
import { userController } from "../controller/index";
const loginUserSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
};
const registerUserSchema = {
  body: {
    type: "object",
    required: [
      "email",
      "password",
      "first_name",
      "last_name",
      "avtar",
      "theme",
    ],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
      first_name: { type: "string" },
      last_name: { type: "string" },
      avtar: { type: "string" },
      theme: { type: "string", enum: ["dark", "light"] },
    },
  },
};
export default async function (app: FastifyInstance) {
  app.post(
    "/register",
    { schema: registerUserSchema },
    userController.register
  );
  app.post("/login", { schema: loginUserSchema }, userController.login);
  app.post("/logout", userController.logout);
}
