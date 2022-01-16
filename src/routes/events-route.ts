import { router } from "typera-express";
import { EventsController } from "../controllers/events-controller";

export const eventsRoutes = router(
    EventsController.createEvent,
    EventsController.getEvents,
    EventsController.getEventBySlug,
    EventsController.getTasks,
    EventsController.deleteEvent,
).handler();
