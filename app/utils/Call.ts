import { NextFunction, Request, Response } from "express";

const Call = (method: any) => (req: Request, res: Response, next: NextFunction) => method(req, res).catch((e: any) => next(e));

export default Call;
