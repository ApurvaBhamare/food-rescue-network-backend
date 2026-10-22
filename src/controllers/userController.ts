import type { FastifyRequest, FastifyReply } from "fastify";
import { registerUser, loginUser } from "../services/userService.js";

interface RegisterBody {
    name: string;
    email: string;
    password: string;
    role: "HOTEL" | "NGO" | "VOLUNTEER";
}

interface LoginBody {
    email: string;
    password: string;
}

export const register = async (
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
) => {
    try {
        const { name, email, password, role } = request.body;

        if (!name || !email || !password || !role) {
            return reply.code(400).send({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await registerUser({
            name,
            email,
            password,
            role,
        });

        return reply.code(201).send({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Email already registered"
        ) {
            return reply.code(409).send({
                success: false,
                message: error.message,
            });
        }

        request.log.error(error);

        return reply.code(500).send({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const login = async (
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return reply.code(400).send({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await loginUser(email, password);

        return reply.code(200).send({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Invalid email or password"
        ) {
            return reply.code(401).send({
                success: false,
                message: error.message,
            });
        }

        console.error("LOGIN ERROR:", error);

return reply.code(500).send({
  success: false,
  message:
    error instanceof Error ? error.message : "Unknown error",
});
    }
};