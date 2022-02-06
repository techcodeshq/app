import { router } from "typera-express";
import { AuditController } from "../controllers/audit-controller";

export const auditRoutes = router(AuditController.getAudits).handler();
