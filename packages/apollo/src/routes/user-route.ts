import { router } from "typera-express";
import { UserController } from "../controllers/user-controller";

export const userRoutes = router(
    UserController.getUsers,
    UserController.getTasks,
    UserController.getMetadata,
    UserController.getMetadataExec,
    UserController.deleteUser,
    UserController.getUser,
    UserController.editMetadata,
).handler();
