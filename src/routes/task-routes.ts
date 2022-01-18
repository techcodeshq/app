import { router } from "typera-express";
import { TaskController } from "../controllers/task-controller";

export const taskRoutes = router(
    TaskController.createSubTask,
    TaskController.createTask,
    TaskController.getTask,
    TaskController.toggleAssignUser,
    TaskController.getAssignees,
    TaskController.deleteTask,
    TaskController.toggleTask,
    TaskController.updateTask,
).handler();
