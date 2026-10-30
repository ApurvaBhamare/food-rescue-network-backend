import type { FastifyRequest, FastifyReply } from "fastify";
import {
  createFood,
  getAllFood,
  getAvailableFood,
  claimFood,
  pickupFood,
  getMyClaimedFood,
  getMyAddedFood,
  updateFood,deleteFood
} from "../services/foodService.js";


interface CreateFoodBody {
  food_name: string;
  quantity: number;
  description?: string;
  expiry_time: string;
}


export const addFood = async (
  request: FastifyRequest<{ Body: CreateFoodBody }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user;

    // Check login and role
    if (!user) {
      return reply.code(401).send({
        success: false,
        message: "Please login first",
      });
    }

    if (user.role !== "HOTEL") {
      return reply.code(403).send({
        success: false,
        message: "Only HOTEL users can add food",
      });
    }

    const { food_name, quantity, description, expiry_time } =
      request.body;

    // Validate required fields
    if (
      typeof food_name !== "string" ||
      !food_name.trim() ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      typeof expiry_time !== "string" ||
      !expiry_time.trim()
    ) {
      return reply.code(400).send({
        success: false,
        message: "Please provide valid food name, quantity and expiry time",
      });
    }
 
    const expiryDate = new Date(expiry_time);

    if (
      !Number.isFinite(expiryDate.getTime()) ||
      expiryDate.getTime() <= Date.now()
    ) {
      return reply.code(400).send({
        success: false,
        message: "Expiry time must be a valid future date and time",
      });
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return reply.code(400).send({
        success: false,
        message: "Description must be text",
      });
    }

    const food = await createFood({
      hotel_id: user.id,
      food_name: food_name.trim(),
      quantity,
      description,
      expiry_time: expiryDate,
    });

    return reply.code(201).send({
      success: true,
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to add food",
    });
  }
};

export const getFoodList = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const foodList = await getAllFood();

    return reply.code(200).send({
      success: true,
      message: "Food list fetched successfully",
      food: foodList,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to fetch food list",
    });
  }
};

export const getAvailableFoodList = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const foodList = await getAvailableFood();

    return reply.code(200).send({
      success: true,
      message: "Available food fetched successfully",
      food: foodList,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to fetch available food",
    });
  }
};
export const claimFoodController = async (
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const foodId = Number(request.params.id);

    if (!Number.isInteger(foodId) || foodId <= 0) {
      return reply.code(400).send({
        success: false,
        message: "Invalid food ID",
      });
    }

    const user = request.user;

    if (!user || user.role !== "NGO") {
      return reply.code(403).send({
        success: false,
        message: "Only NGOs can claim food",
      });
    }

    const food = await claimFood(foodId, user.id);

    if (!food) {
      return reply.code(409).send({
        success: false,
        message: "Food not found or already claimed",
      });
    }

    return reply.code(200).send({
      success: true,
      message: "Food claimed successfully",
      food,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to claim food",
    });
  }
};
export const pickupFoodController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const foodId = Number(request.params.id);

    if (!Number.isInteger(foodId) || foodId <= 0) {
      return reply.code(400).send({
        success: false,
        message: "Invalid food ID",
      });
    }

    const user = request.user;

    if (!user || user.role !== "NGO") {
      return reply.code(403).send({
        success: false,
        message: "Only an NGO can confirm food pickup",
      });
    }

    const food = await pickupFood(foodId, user.id);

    if (!food) {
      return reply.code(409).send({
        success: false,
        message: "Food not found or not yet claimed",
      });
    }

    return reply.code(200).send({
      success: true,
      message: "Food pickup completed successfully",
      food,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to update food pickup status",
    });
  }
};

export const getMyClaimedFoodController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user;

    if (!user || user.role !== "NGO") {
      return reply.code(403).send({
        success: false,
        message: "Only NGO can view claimed food",
      });
    }

    const foodList = await getMyClaimedFood(user.id);

    return reply.code(200).send({
      success: true,
      message: "My claimed food fetched successfully",
      food: foodList,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to fetch claimed food",
    });
  }
};
export const getMyAddedFoodController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user;

    if (!user || user.role !== "HOTEL") {
      return reply.code(403).send({
        success: false,
        message: "Only hotel users can view their added food",
      });
    }

    const foodList = await getMyAddedFood(user.id);

    return reply.code(200).send({
      success: true,
      message: "My added food fetched successfully",
      food: foodList,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to fetch added food",
    });
  }

};


interface UpdateFoodBody {
  food_name: string;
  quantity: number;
  description?: string;
  expiry_time: string;
}

export const updateFoodController = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateFoodBody;
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user;

    if (!user || user.role !== "HOTEL") {
      return reply.code(403).send({
        success: false,
        message: "Only HOTEL users can edit food",
      });
    }

    const foodId = Number(request.params.id);
    const { food_name, quantity, description, expiry_time } =
      request.body;

    if (
      !Number.isInteger(foodId) ||
      foodId <= 0 ||
      typeof food_name !== "string" ||
      !food_name.trim() ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      typeof expiry_time !== "string" ||
      !expiry_time.trim() ||
      (description !== undefined &&
        typeof description !== "string")
    ) {
      return reply.code(400).send({
        success: false,
        message: "Please provide valid food details",
      });
    }

    const expiryDate = new Date(expiry_time);

    if (
      !Number.isFinite(expiryDate.getTime()) ||
      expiryDate.getTime() <= Date.now()
    ) {
      return reply.code(400).send({
        success: false,
        message: "Expiry time must be a valid future date",
      });
    }

    const food = await updateFood(foodId, user.id, {
      food_name: food_name.trim(),
      quantity,
      description,
      expiry_time: expiryDate,
    });

    if (!food) {
      return reply.code(404).send({
        success: false,
        message: "Food not found or cannot be edited",
      });
    }

    return reply.code(200).send({
      success: true,
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to update food",
    });
  }
};

export const deleteFoodController = async (
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user;

    if (!user || user.role !== "HOTEL") {
      return reply.code(403).send({
        success: false,
        message: "Only HOTEL users can delete food",
      });
    }

    const foodId = Number(request.params.id);

    if (!Number.isInteger(foodId) || foodId <= 0) {
      return reply.code(400).send({
        success: false,
        message: "Invalid food ID",
      });
    }

    const deleted = await deleteFood(foodId, user.id);

    if (!deleted) {
      return reply.code(404).send({
        success: false,
        message: "Food not found or cannot be deleted",
      });
    }

    return reply.code(200).send({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: "Unable to delete food",
    });
  }
};
