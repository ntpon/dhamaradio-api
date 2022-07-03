import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import { User } from "../models/User"
import { HttpError } from "../utils/HttpError"
import { Role } from "../models/Role"
dotenv.config()
const JWT_KEY = process.env.JWT_KEY || ""

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return next(HttpError.badRequest("Invalid token"))
  }
  try {
    const decodedToken = jwt.verify(token, JWT_KEY)
    if (typeof decodedToken === "string")
      return next(HttpError.unauthorized("Invalid token"))

    const user = await User.findByPk(decodedToken.id, {
      include: {
        model: Role,
      },
    })
    if (!user) {
      return next(HttpError.unauthorized("Account not found"))
    }
    if (!user.isActive) {
      return next(HttpError.unauthorized("Account not found"))
    }
    req.user = user
    next()
  } catch (error) {
    return next(HttpError.unauthorized("Invalid token"))
  }
}
export const authRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role.name, 0)) {
      return next(HttpError.forbidden("Access denied admin only"))
    }
    next()
  }
}
