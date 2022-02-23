import { router } from "typera-express";
import { UserController } from "../controllers/users-controller";

export const userRoutes = router(
  UserController.getUsers,
  UserController.getTasks,
  UserController.getMetadata,
  UserController.getMetadataExec,
  UserController.getBranchMember,
  UserController.getUser,
  UserController.deleteUser,
  UserController.editMetadata,
).handler();
