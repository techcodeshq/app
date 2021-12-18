import { Request, Response } from "express";

export class TestController {
    public indexResponse(_: Request, res: Response) {
        return res.json({ message: "test" });
    }
}
