import { router } from "typera-express";
import { UserController } from "../controllers/user-controller";

export const userRoutes = router(UserController.getUsers).handler();
