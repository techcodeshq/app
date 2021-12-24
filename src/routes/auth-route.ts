import { router } from "typera-express";
import { AuthController } from "../controllers/auth-controller";

export const authRoutes = router(
    AuthController.createSession,
    AuthController.createUser,
    AuthController.deleteSession,
    AuthController.getSessionAndUser,
    AuthController.getUser,
    AuthController.getUserByAccount,
    AuthController.getUserByEmail,
    AuthController.linkAccount,
    AuthController.updateSession,
    AuthController.updateUser,
).handler();
