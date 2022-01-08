import { router } from "typera-express";
import { LinksController } from "../controllers/link-controller";

export const linkRoutes = router(
    LinksController.getLinkActions,
    LinksController.createLink,
    LinksController.getLinks,
    LinksController.getLink,
    LinksController.getRedeemed,
    LinksController.redeemLink,
    LinksController.grantLink,
    LinksController.toggleLink,
    LinksController.getLinkByCode,
).handler();
