import { router } from "typera-express";
import { MailController } from "../controllers/mail-controller";

export const mailRoutes = router(MailController.sendMessage).handler();
