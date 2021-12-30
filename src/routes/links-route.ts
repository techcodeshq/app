import { router } from "typera-express";
import { LinksController } from "../controllers/link-controller";

export const linkRoutes = router(
    LinksController.getLinkActions,
    LinksController.createLink,
    LinksController.getLinks,
    LinksController.getLink,
    LinksController.redeemLink,
    LinksController.toggleLink,
).handler();
