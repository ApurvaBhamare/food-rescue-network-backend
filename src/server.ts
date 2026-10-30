
import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

import { connectDatabase, sequelize } from "./config/database.js";
import { User } from "./models/User.js";
import userRoutes from "./routes/userRoutes.js";
import { Food } from "./models/Food.js";
import foodRoutes from "./routes/foodRoutes.js";

dotenv.config();

const app = Fastify({
  logger: true,
});

// Enable CORS

// Enable CORS
app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Register user routes
app.register(userRoutes, {
  prefix: "/api/users",
});

// Register food routes
app.register(foodRoutes, {
  prefix: "/api/food",
});

// Home route
app.get("/", async () => {
  return {
    success: true,
    message: "Food Rescue Network API is running!",
  };
});

// Health route
app.get("/health", async () => {
  return {
    success: true,
    message: "Food Backend API is healthy!",
  };
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    // Create tables if they do not exist
    await sequelize.sync();

    console.log("Database tables synchronized successfully!");

    const port = Number(process.env.PORT || 3000);

await app.ready();

console.log("Registered Routes:");
console.log(app.printRoutes());


    await app.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

startServer();
