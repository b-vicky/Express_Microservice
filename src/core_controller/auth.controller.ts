import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

export function validateToken(request: Request, response: Response, next: NextFunction) {
    const token: string = get(request.headers, 'authorization', '');
    Jwt.verify(token, `${process.env.JWT_SECRET}`, (error, success) => {
        console.log("🚀 ~ Jwt.verify ~ error:", error?.message);
        if (error?.name === 'TokenExpiredError') {
            return response.status(401).send({
                message: 'Token Expried'
            })
        } else if (error?.name === 'JsonWebTokenError') {
            return response.status(401).send({
                message: 'Token Invalid'
            })
        } else {
            return next()
        }
    })
}
