import { router } from "typera-express";
import { MemberController } from "../controllers/member-controller";

export const memberRoutes = router(
  MemberController.getUser,
  MemberController.getMetadataUser,
  MemberController.getMetadataById,
  MemberController.getMember,
  MemberController.getAuthedMemberById,
  MemberController.editMetadata,
).handler();
