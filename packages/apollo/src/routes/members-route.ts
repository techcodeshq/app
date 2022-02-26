import { router } from "typera-express";
import { MemberController } from "../controllers/member-controller";

export const memberRoutes = router(
  MemberController.getMetadataUser,
  MemberController.getMetadataById,
  MemberController.getMember,
  MemberController.getMemberById,
  MemberController.editMetadata,
).handler();
