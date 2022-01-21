import { router } from "typera-express";
import { UserController } from "../controllers/user-controller";

export const userRoutes = router(
    UserController.getUsers,
    UserController.getMetadata,
    UserController.getMetadataExec,
    UserController.getUser,
    UserController.getTasks,
    UserController.deleteUser,
    UserController.editMetadata,
).handler();
