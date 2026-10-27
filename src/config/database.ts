
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL;

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging: false,
      dialectOptions: isProduction
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    })
  : new Sequelize(
      process.env.DB_NAME || "food_rescue",
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        dialect: "postgres",
        logging: false,
      }
    );

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    throw error;
  }
};
