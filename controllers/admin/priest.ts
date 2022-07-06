import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { v2 as cloudinary } from "cloudinary"
import * as fs from "fs"
import { Priest } from "../../models/Priest"
import { HttpError } from "../../utils/HttpError"
import { strToSlug } from "../../utils/slug"
import { getPagination } from "../../utils/pagination"
import { getSearch } from "../../utils/search"

// CRUD
export const createPriest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { fullName, description } = req.body
    const isExisted = await Priest.findOne({
      where: {
        fullName: fullName,
      },
    })
    if (isExisted) {
      throw HttpError.badRequest("มีชื่อพระอาจารย์นี้อยู่แล้ว")
    }
    const newPriest = new Priest({
      fullName,
      description,
      slug: strToSlug(fullName),
    })
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/priest",
      })
      newPriest.avatar = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }

    const priest = await newPriest.save()

    res.status(201).json({ message: "สร้างข้อมูลสำเร็จ", priest })
  } catch (error) {
    next(error)
  }
}

export const updatePriest = async (
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
    const { fullName, description } = req.body
    const priest = await Priest.findByPk(id)
    if (!priest) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }

    if (priest.fullName !== fullName) {
      const isExisted = await Priest.findOne({
        where: {
          fullName: fullName,
        },
      })
      if (isExisted) {
        throw HttpError.badRequest("มีชื่อพระอาจารย์นี้อยู่แล้ว")
      }
    }
    priest.fullName = fullName
    priest.description = description
    priest.slug = strToSlug(fullName)

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/priest",
      })
      priest.avatar = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }
    priest.save()

    res.json({ message: "แก้ไขข้อมูลสำเร็จ", priest })
  } catch (error) {
    next(error)
  }
}

export const getAllPriest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conditionSearch = getSearch(req, ["fullName"])
    const { limit, offset } = getPagination(req)
    const priests = await Priest.findAndCountAll({
      limit,
      offset,
      where: { ...conditionSearch },
      order: [["updatedOn", "DESC"]],
    })
    let totalPage = null
    if (priests.count > 0) {
      totalPage = Math.ceil(priests.count / limit)
    }
    res.json({ priests: priests.rows || [], totalPage })
  } catch (error) {
    next(error)
  }
}

export const getPriestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const priest = await Priest.findByPk(id)
    if (!priest) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    res.json({ priest })
  } catch (error) {
    next(error)
  }
}

export const deletePriest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const priest = await Priest.findByPk(id)
    if (!priest) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await priest.destroy()
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
    const priest = await Priest.findByPk(id)
    if (!priest) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await priest.update({
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", priest })
  } catch (error) {
    next(error)
  }
}
