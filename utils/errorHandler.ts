import { Request, Response, NextFunction } from "express"
import { HttpError } from "./HttpError"
import * as fs from "fs"
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
  if (err instanceof HttpError) {
    if (err.message.length > 0) {
      return res.status(err.code).json({
        code: err.code,
        error: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
      })
    } else {
      return res.status(err.code).json({ code: err.code, error: err.message })
    }
  }

  if (process.env.APP_MODE === "production") {
    return res.status(500).json({ code: 500, error: "Something went wrong" })
  } else {
    console.log(err)
    return res
      .status(500)
      .json({ code: 500, error: err.message ? err.message : err })
  }
}

export const errorRoute = () => {
  throw HttpError.notFound("Could not find this route.")
}
