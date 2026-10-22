import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "HOTEL" | "NGO" | "VOLUNTEER";
}) => {
  const existingUser = await User.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  });

  return {
    id: user.get("id"),
    name: user.get("name"),
    email: user.get("email"),
    role: user.get("role"),
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const storedPassword = user.get("password") as string;

  const isPasswordValid = await bcrypt.compare(
    password,
    storedPassword
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  const token = jwt.sign(
    {
      id: user.get("id"),
      email: user.get("email"),
      role: user.get("role"),
    },
    secret,
    { expiresIn: "1h" }
  );

  return {
    id: user.get("id"),
    name: user.get("name"),
    email: user.get("email"),
    role: user.get("role"),
    token,
  };
};