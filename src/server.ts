
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
app.register(cors, {
  origin: true,
});

// Register user routes
app.register(userRoutes, {
  prefix: "/api/users",
});
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

    // Create the Users table if it does not exist
    await sequelize.sync({ alter: true });

    console.log("Database tables synchronized successfully!");

    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log("Server running on port 3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

startServer();
