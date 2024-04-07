import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { get, split } from "lodash";

export function validateToken(request: Request, response: Response, next: NextFunction) {
    const token: string[] = split(get(request.headers, 'authorization', ''), ' ');
    console.log("🚀 ~ validateToken ~ token:", token)
    Jwt.verify(token[1], `${process.env.JWT_SECRET}`, (error, success) => {
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
