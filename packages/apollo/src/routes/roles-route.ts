import { router } from "typera-express";
import { RoleController } from "../controllers/roles-controller";

export const roleRoutes = router(
  RoleController.getAllRoles,
  RoleController.setRoles,
  RoleController.setPerms,
  RoleController.createRole,
  RoleController.getRole,
  RoleController.deleteRole,
  RoleController.editRole,
).handler();
