import { NextFunction, Request, Response } from "express";
import { validateId } from "../helpers/validateData";

export function isIdValid(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    if (validateId(id)) {
        return next();
    }

    return response.status(400).json("Invalid id");
}