import type {
  FastifyRequest,
  FastifyReply,
} from "fastify";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  email: string;
  role: "HOTEL" | "NGO" | "VOLUNTEER";
}

declare module "fastify" {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return reply.code(401).send({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      request.log.error("JWT_SECRET is not configured");
      return reply.code(500).send({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string" ||
      !["HOTEL", "NGO", "VOLUNTEER"].includes(decoded.role as string)
    ) {
      return reply.code(401).send({
        success: false,
        message: "Invalid authentication token",
      });
    }

    request.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as JwtPayload["role"],
    };
  } catch {
    return reply.code(401).send({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};