import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { v2 as cloudinary } from "cloudinary"
import * as fs from "fs"
import { Audio } from "../../models/Audio"
import { HttpError } from "../../utils/HttpError"
import { strToSlug } from "../../utils/slug"
import { getPagination } from "../../utils/pagination"
import { Album } from "../../models/Album"

export const createAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { name, albumId } = req.body

    const album = await Album.findByPk(albumId)
    if (!album || !album.isActive) {
      throw HttpError.badRequest("ไม่มีชุดเสียง")
    }

    const audio = new Audio({
      name,
      albumId,
    })
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/audio",
        resource_type: "video",
      })
      audio.source = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }
    await audio.save()
    res.status(201).json({ message: "สร้างข้อมูลสำเร็จ", audio })
  } catch (error) {
    next(error)
  }
}

export const updateAudio = async (
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
    const { name, albumId } = req.body
    const audio = await Audio.findByPk(id)
    if (!audio) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }

    if (audio.albumId !== albumId) {
      const album = await Album.findByPk(albumId)
      if (!album || !album.isActive) {
        throw HttpError.badRequest("ไม่มีชุดเสียง")
      }
    }

    audio.name = name
    audio.albumId = albumId

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/audio",
      })
      audio.source = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }
    audio.save()

    res.json({ message: "แก้ไขข้อมูลสำเร็จ", audio })
  } catch (error) {
    next(error)
  }
}

export const getAllAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset } = getPagination(req)
    const audios = await Audio.findAndCountAll({
      limit,
      offset,
    })
    res.json({ audios })
  } catch (error) {
    next(error)
  }
}

export const getAudioById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const audio = await Audio.findByPk(id)
    if (!audio) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    res.json({ audio })
  } catch (error) {
    next(error)
  }
}

export const deleteAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const audio = await Audio.findByPk(id)
    if (!audio) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await audio.destroy()
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
    const audio = await Audio.findByPk(id)
    if (!audio) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await audio.update({
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", audio })
  } catch (error) {
    next(error)
  }
}
