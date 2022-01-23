import { router } from "typera-express";
import { UserController } from "../controllers/user-controller";

export const userRoutes = router(
    UserController.getUsers,
    UserController.getTasks,
    UserController.getUser,
    UserController.getMetadata,
    UserController.getMetadataExec,
    UserController.deleteUser,
    UserController.editMetadata,
).handler();
