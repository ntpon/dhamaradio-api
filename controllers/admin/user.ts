import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { v2 as cloudinary } from "cloudinary"
import * as fs from "fs"
import { User } from "../../models/User"
import { HttpError } from "../../utils/HttpError"
import { getPagination } from "../../utils/pagination"
import { Playlist } from "../../models/Playlist"
import { Role } from "../../models/Role"

// CRUD
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }

    const { email, password, firstName, lastName, roleId } = req.body

    const [existingUser, existingRole] = await Promise.all([
      User.findOne({
        where: {
          email,
        },
      }),
      Role.findByPk(roleId),
    ])

    if (existingUser) {
      return next(
        HttpError.badRequest(
          "อีเมลนี้ถูกลงทะเบียนโดยผู้ใช้รายอื่นแล้ว กรุณาเปลี่ยนอีเมลใหม่"
        )
      )
    }

    if (!existingRole) {
      return next(HttpError.badRequest("ไม่พบสิทธิ์การใช้งาน"))
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.PASSWORD_LENGTH_SALT)
    )

    const newUser = new User({
      firstName,
      lastName,
      email,
      roleId,
      password: hashedPassword,
    })

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/user",
      })
      newUser.avatar = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }

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

    return res.status(201).json({
      message: "สร้างผู้ใช้สำเร็จ",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: existingRole.name,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }

    const { id } = req.params
    const { firstName, lastName, email, roleId } = req.body

    const user = await User.findOne({
      where: {
        id,
      },
    })
    if (!user) {
      return next(HttpError.notFound("ไม่พบผู้ใช้ที่ต้องการ"))
    }

    if (user.email !== email) {
      const existingEmail = await User.findOne({
        where: {
          email,
          $not: {
            id: user.id,
          },
        },
      })
      if (existingEmail) {
        return next(
          HttpError.badRequest(
            "อีเมลนี้ถูกลงทะเบียนโดยผู้ใช้รายอื่นแล้ว กรุณาเปลี่ยนอีเมลใหม่"
          )
        )
      }
    }

    const existingRole = await Role.findOne(roleId)

    if (!existingRole) {
      return next(HttpError.badRequest("ไม่พบสิทธิ์การใช้งาน"))
    }

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

    user.email = email
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.roleId = roleId

    await user.save()

    return res.status(200).json({
      message: "แก้ไขผู้ใช้สำเร็จ",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        existingRole: existingRole.name,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset } = getPagination(req)
    const users = await User.findAndCountAll({
      limit,
      offset,
      include: {
        model: Role,
        attributes: ["name"],
      },
    })

    res.json({ users })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const user = await User.findOne({
      where: {
        id,
      },
      include: {
        model: Role,
        attributes: ["name"],
      },
    })
    if (!user) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    res.json({ user })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await user.destroy()
    res.json({ message: "ลบข้อมูลสำเร็จ" })
  } catch (error) {
    next(error)
  }
}

export const updateIsActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { isActive } = req.body
    const user = await User.findByPk(id)
    if (!user) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await user.update({
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", user })
  } catch (error) {
    next(error)
  }
}
