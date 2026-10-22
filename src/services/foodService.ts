import { Food } from "../models/Food.js";
import { Op } from "sequelize";

interface CreateFoodData {
  hotel_id: number;
  food_name: string;
  quantity: number;
  description?: string | undefined;
  expiry_time: Date;
}

export const createFood = async (data: CreateFoodData) => {
  const food = await Food.create({
    hotel_id: data.hotel_id,
    food_name: data.food_name,
    quantity: data.quantity,
    description: data.description,
    expiry_time: data.expiry_time,
    status: "AVAILABLE",
  });

  return food;
};

export const getAllFood = async () => {
  const foodList = await Food.findAll({
    order: [["createdAt", "DESC"]],
  });

  return foodList;
};

export const getAvailableFood = async () => {
  const foodList = await Food.findAll({
    where: {
      status: "AVAILABLE",
      expiry_time: {
        [Op.gt]: new Date(),
      },
    },
    order: [["createdAt", "DESC"]],
  });

  return foodList;
};

export const claimFood = async (
  foodId: number,
  ngoId: number
) => {
  const [updatedRows] = await Food.update(
    {
      status: "CLAIMED",
      claimed_by_ngo_id: ngoId,
    },
    {
      where: {
        id: foodId,
        status: "AVAILABLE",
        expiry_time: {
          [Op.gt]: new Date(),
        },
        hotel_id: {
          [Op.ne]: ngoId,
        },
      },
    }
  );

  if (updatedRows === 0) {
    return null;
  }

  return await Food.findByPk(foodId);
};
export const pickupFood = async (
  foodId: number,
  ngoId: number
) => {
  const [updatedRows] = await Food.update(
    { status: "PICKED_UP" },
    {
      where: {
        id: foodId,
        status: "CLAIMED",
        claimed_by_ngo_id: ngoId,
      },
    }
  );

  if (updatedRows === 0) {
    return null;
  }

  return await Food.findByPk(foodId);
};
export const getMyClaimedFood = async (ngoId: number) => {
  const foodList = await Food.findAll({
    where: {
      claimed_by_ngo_id: ngoId,
    },
    order: [["createdAt", "DESC"]],
  });

  return foodList;
};

export const getMyAddedFood = async (hotelId: number) => {
  const foodList = await Food.findAll({
    where: {
      hotel_id: hotelId,
    },
    order: [["createdAt", "DESC"]],
  });      

  return foodList;
};
