import { FastifyInstance } from "fastify";
import { userController } from "../controller/index";

export default async function (app: FastifyInstance) {
  app.post("/register", userController.register);
  app.post("/login", userController.login);
  app.post("/logout", userController.logout);
}
