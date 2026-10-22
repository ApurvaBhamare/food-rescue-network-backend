import type { FastifyInstance } from "fastify";
import { addFood,getFoodList,getAvailableFoodList,claimFoodController,pickupFoodController,
  getMyClaimedFoodController,getMyAddedFoodController  } from "../controllers/foodController.js";
import { authenticate,authorize } from "../middleware/authMiddleware.js";

export default async function foodRoutes(app: FastifyInstance) {
 app.post<{
  Body: {
    
    food_name: string;
    quantity: number;
    description?: string;
    expiry_time: string;
  };
}>(
  "/add",
  {
    preHandler: authenticate,
  },
  addFood
);

   app.get("/", getFoodList);
   app.get("/available", getAvailableFoodList);
   
   app.patch<{ Params: { id: string } }>(
  "/:id/claim",
  {
    preHandler: authenticate,
  },
  claimFoodController
);
app.patch<{ Params: { id: string } }>(
  "/:id/pickup",
  {
    preHandler: authenticate,
  },
  pickupFoodController
);

app.get(
    "/my-claimed",
    {
      preHandler: authenticate,
    },
    getMyClaimedFoodController
  );
app.get(
    "/my-added",
    {
      preHandler: [
        authenticate,
        authorize("HOTEL"),
      ],
    },
    getMyAddedFoodController
  );
}

