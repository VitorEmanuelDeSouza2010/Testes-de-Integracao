import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export function generateToken(
    data: object,
    expiresIn = "1d" as SignOptions["expiresIn"]
) {
    return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn })
}

export function validateToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}