import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { v2 as cloudinary } from "cloudinary"
import * as fs from "fs"
import { Album } from "../../models/Album"
import { HttpError } from "../../utils/HttpError"
import { strToSlug } from "../../utils/slug"
import { getPagination } from "../../utils/pagination"
import { Priest } from "../../models/Priest"

export const createAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { name, description, priestId, isRecommend } = req.body
    const [isAlbumExisted, priest] = await Promise.all([
      Album.findOne({
        where: {
          name: name,
        },
      }),
      Priest.findByPk(priestId),
    ])
    if (isAlbumExisted) {
      throw HttpError.badRequest("มีชื่ออัลบั้มนี้อยู่แล้ว")
    }
    if (!priest || !priest.isActive) {
      throw HttpError.badRequest("ไม่มีพระอาจารย์")
    }
    const album = new Album({
      name,
      description,
      priestId,
      slug: strToSlug(name),
      isRecommend,
    })
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/album",
      })
      album.coverImage = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }

    await album.save()

    res.status(201).json({ message: "สร้างข้อมูลสำเร็จ", album })
  } catch (error) {
    next(error)
  }
}

export const updateAlbum = async (
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
    const { name, description, priestId } = req.body
    const album = await Album.findByPk(id)
    if (!album) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }

    if (album.name !== name) {
      const isAlbumExisted = await Album.findOne({
        where: {
          name: name,
        },
      })
      if (isAlbumExisted) {
        throw HttpError.badRequest("มีชื่อพระอาจารย์นี้อยู่แล้ว")
      }
    }

    if (album.priestId !== priestId) {
      const priest = await Priest.findByPk(priestId)
      if (!priest || !priest.isActive) {
        throw HttpError.badRequest("ไม่มีพระอาจารย์")
      }
    }

    album.name = name
    album.description = description
    album.slug = strToSlug(name)
    album.priestId = priestId

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/album",
      })
      album.coverImage = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }
    album.save()

    res.json({ message: "แก้ไขข้อมูลสำเร็จ", album })
  } catch (error) {
    next(error)
  }
}

export const getAllAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset } = getPagination(req)
    const albums = await Album.findAndCountAll({
      limit,
      offset,
    })

    res.json({ albums })
  } catch (error) {
    next(error)
  }
}

export const getAlbumById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const album = await Album.findByPk(id)
    if (!album) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    res.json({ album })
  } catch (error) {
    next(error)
  }
}

export const deleteAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const album = await Album.findByPk(id)
    if (!album) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await album.destroy()
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
    const album = await Album.findByPk(id)
    if (!album) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await album.update({
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", album })
  } catch (error) {
    next(error)
  }
}
