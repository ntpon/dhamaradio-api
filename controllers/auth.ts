import { NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { v4 as uuidv4 } from "uuid"
import { v2 as cloudinary } from "cloudinary"
import * as fs from "fs"
import { User } from "../models/User"
import { HttpError } from "../utils/HttpError"
import process from "process"
import { Role } from "../models/Role"
import { Playlist } from "../models/Playlist"
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }

    const { email, password, firstName, lastName } = req.body

    const existingUser = await User.findOne({
      where: {
        email,
      },
    })
    if (existingUser) {
      throw HttpError.badRequest(
        "อีเมลนี้ถูกลงทะเบียนโดยผู้ใช้รายอื่นแล้ว กรุณาเปลี่ยนอีเมลใหม่"
      )
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.PASSWORD_LENGTH_SALT)
    )

    const role = await Role.findOne({
      where: {
        name: "user",
      },
    })

    if (!role) {
      throw HttpError.internal("เกิดข้อผิดพลาดทางระบบ")
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      roleId: role.id,
      password: hashedPassword,
    })

    const user = await newUser.save()

    await Playlist.bulkCreate([
      {
        name: "รายการโปรด",
        description: "รายการโปรดของคุณ",
        slug: uuidv4(),
        type: "DEFAULT",
        userId: user.id,
      },
      {
        name: "ประวัติการฟัง",
        description: "ประวัติการฟังเสียงทั้งหมด",
        slug: uuidv4(),
        type: "HISTORY",
        userId: user.id,
      },
    ])

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_KEY || "", {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    return res.status(201).json({
      message: "ลงทะเบียนสำเร็จ",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: role.name,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { email, password } = req.body

    const user = await User.findOne({
      where: {
        email,
      },
      include: {
        model: Role,
      },
    })
    if (!user) {
      throw HttpError.badRequest(
        "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง"
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw HttpError.badRequest(
        "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง"
      )
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY || "", {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role.name,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }

    const user = req.user
    const { firstName, lastName } = req.body
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/user",
      })
      user.avatar = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }
    user.firstName = firstName
    user.lastName = lastName
    await user.save()
    return res.status(200).json({
      message: "อัพเดทข้อมูลสำเร็จ",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }

    const user = req.user
    const { oldPassword, newPassword } = req.body
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid) {
      return next(
        HttpError.badRequest(
          "รหัสผ่านเดิมไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง"
        )
      )
    }
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.PASSWORD_LENGTH_SALT)
    )
    await user.update({
      password: hashedPassword,
    })
    return res.status(200).json({
      message: "อัพเดทรหัสผ่านสำเร็จ",
    })
  } catch (error) {
    next(error)
  }
}
