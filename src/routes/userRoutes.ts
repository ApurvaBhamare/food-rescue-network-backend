import type { FastifyInstance } from "fastify";
import { register, login } from "../controllers/userController.js";

export default async function userRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
}