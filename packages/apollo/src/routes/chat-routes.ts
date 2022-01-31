import { router } from "typera-express";
import { ChatController } from "../controllers/chat-controller";

export const chatRoutes = router(
  ChatController.getMessages,
  ChatController.createMessage,
  ChatController.deleteMessage,
).handler();
