import { router } from "typera-express";
import { UserController } from "../controllers/users-controller";

export const userRoutes = router(
  UserController.getUsers,
  UserController.getTasks,
  UserController.deleteUser,
  UserController.getUser,
  UserController.deleteUser,
).handler();
