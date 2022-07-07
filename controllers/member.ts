import { NextFunction, Request, Response } from "express"
import * as fs from "fs"
import { v2 as cloudinary } from "cloudinary"
const { v4: uuidv4 } = require("uuid")

import { Playlist } from "../models/Playlist"
import { HttpError } from "../utils/HttpError"
import { Audio } from "../models/Audio"
import { PlaylistAudio } from "../models/PlaylistAudio"
import { validationResult } from "express-validator"
import { Album } from "../models/Album"
import { Priest } from "../models/Priest"
import { Contact } from "../models/Contact"
import { User } from "../models/User"
import { col, literal } from "sequelize"

export const getPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlists = await Playlist.findAll({
    attributes: ["slug", "name", "coverImage", "description", "type"],
    where: {
      isActive: true,
      userId: req.user.id,
      type: ["DEFAULT", "CREATE"],
    },
  })
  res.json({
    playlists,
  })
}

export const getPlaylistsWithCountAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlists = await Playlist.findAll({
    attributes: ["slug", "name", "coverImage", "description"],
    where: {
      isActive: true,
      userId: req.user.id,
      type: ["DEFAULT", "CREATE"],
    },
    include: {
      model: Audio,
      as: "audios",
      attributes: ["id"],
      where: {
        isActive: true,
      },
      required: false,
    },
  })
  res.json({
    playlists,
  })
}

export const createAudioToPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { slug, audioId } = req.body
    let condition = {}
    if (slug === "HISTORY" || slug === "DEFAULT") {
      condition = {
        userId: req.user.id,
        type: slug,
      }
    } else {
      condition = {
        slug,
        userId: req.user.id,
      }
    }

    const myPlaylist = await Playlist.findOne({
      where: condition,
    })
    if (!myPlaylist) {
      throw HttpError.badRequest("ไม่พบรายการนี้")
    }
    const [playlistAudio, audio] = await Promise.all([
      PlaylistAudio.findOne({
        where: {
          playlistId: myPlaylist.id,
          audioId,
        },
      }),
      Audio.findOne({
        where: {
          id: audioId,
          isActive: true,
        },
      }),
    ])

    if (playlistAudio && slug !== "HISTORY") {
      throw HttpError.badRequest("มีเสียงนี้อยู่ในรายการแล้ว")
    }

    if (!audio) {
      return next(HttpError.notFound("ไม่พบเสียงนี้"))
    }
    if (slug === "HISTORY") {
      const history = await PlaylistAudio.findOne({
        where: {
          playlistId: myPlaylist.id,
          audioId,
        },
        include: {
          model: Audio,
          as: "audio",
          attributes: ["id"],
          where: {
            isActive: true,
          },
          required: false,
        },
      })
      if (history) {
        const time = new Date().getTime() - history.createdAt.getTime()
        if (time < 60000) {
          return res.json({
            message: "เสียงไม่ถูกเพิ่ม",
          })
        }
      }
    }

    await PlaylistAudio.create({
      playlistId: myPlaylist.id,
      audioId: audio.id,
    })

    res.json({
      message: "เพิ่มเสียงลงรายการสำเร็จ",
    })
  } catch (error) {
    next(error)
  }
}

export const getPlaylistBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { slug } = req.params
    let condition = {}
    if (slug === "HISTORY") {
      condition = {
        userId: req.user.id,
        type: slug,
      }
      // Return all history in playlist
      const playlist = await Playlist.findOne({
        where: {
          userId: req.user.id,
          type: slug,
        },
      })
      if (playlist) {
        const data = await PlaylistAudio.findAll({
          attributes: ["id", "audioId"],
          where: {
            playlistId: playlist.id,
          },
          include: {
            model: Audio,
            as: "audio",
            where: {
              isActive: true,
            },
            include: [
              {
                model: Album,
                as: "album",
                attributes: ["id", "name", "coverImage"],
                include: [
                  {
                    model: Priest,
                    as: "priest",
                    attributes: ["id", "fullName", "avatar"],
                  },
                ],
              },
            ],
          },
        })
        res.json({
          playlist: data,
        })
      }
    } else {
      condition = {
        slug,
        userId: req.user.id,
      }
    }

    // Order by createdAt of PlaylistAudio desc

    const myPlaylist = await Playlist.findOne({
      attributes: ["slug", "name", "coverImage", "description"],
      where: condition,
      include: [
        {
          model: Audio,
          as: "audios",
          required: true,

          // through: {
          //   // attributes: ["updatedAt"],
          //   as: "playlist_audios",
          // },

          where: {
            isActive: true,
          },
          include: [
            {
              model: Album,
              as: "album",
              attributes: ["name"],
              include: [
                {
                  model: Priest,
                  as: "priest",
                  attributes: ["fullName"],
                },
              ],
            },
          ],
        },
      ],
      order: [["audios", PlaylistAudio, "updatedAt", "DESC"]],
    })

    if (!myPlaylist) {
      throw HttpError.badRequest("ไม่พบรายการนี้")
    }

    res.json({
      playlist: myPlaylist,
    })
  } catch (error) {
    next(error)
  }
}

export const createPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { name, description, isPrivate } = req.body
    const playlist = new Playlist({
      name,
      description,
      slug: uuidv4(),
      userId: req.user.id,
      isPrivate,
      type: "CREATE",
    })
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.FOLDER_NAME + "/playlist",
      })
      playlist.coverImage = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err
        }
      })
    }
    await playlist.save()
    res.json({
      message: "สร้างรายการเสร็จสิ้น",
      playlist: {
        name: playlist.name,
        description: playlist.description,
        coverImage: playlist.coverImage,
        slug: playlist.slug,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const deletePlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params
    const playlist = await Playlist.findOne({
      where: {
        slug,
        userId: req.user.id,
        type: "CREATE",
      },
    })
    if (!playlist) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await playlist.destroy()
    res.json({
      message: "ลบรายการเสร็จสิ้น",
    })
  } catch (error) {
    next(error)
  }
}
