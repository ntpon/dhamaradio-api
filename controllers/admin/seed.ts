import { NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { Role } from "../../models/Role"
import { User } from "../../models/User"
import { Quote } from "../../models/Quote"
import { Priest } from "../../models/Priest"
import quotesData from "../../data/quotes.json"
import priestData from "../../data/priests.json"
import albumsData from "../../data/albums.json"
import audiosData from "../../data/audios.json"
import { Album } from "../../models/Album"
import { Audio } from "../../models/Audio"
import { Playlist } from "../../models/Playlist"
export const createRoleWithAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await Role.bulkCreate([
      {
        name: "user",
        description: "ผู้ใช้งานระบบ",
      },
      {
        name: "admin",
        description: "ผู้ดูแลระบบ",
      },
    ])

    const roleAdmin = roles[1]
    const hashedPassword = await bcrypt.hash(
      "password@admin",
      Number(process.env.PASSWORD_LENGTH_SALT)
    )

    const admin = await User.create({
      roleId: roleAdmin.id,
      firstName: "Super",
      lastName: "Admin",
      email: "admin@admin.com",
      password: hashedPassword,
    })

    await Playlist.bulkCreate([
      {
        name: "รายการโปรด",
        description: "รายการโปรดของคุณ",
        slug: uuidv4(),
        type: "DEFAULT",
        userId: admin.id,
      },
      {
        name: "ประวัติการฟัง",
        description: "ประวัติการฟังเสียงทั้งหมด",
        slug: uuidv4(),
        type: "HISTORY",
        userId: admin.id,
      },
    ])

    return res.json({
      status: "success",
      message: "สร้างข้อมูลเริ่มต้นสำเร็จ",
      admin,
      roles,
    })
  } catch (error) {
    next(error)
  }
}

export const createQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quotes = await Quote.bulkCreate(quotesData)
    res.status(201).json({
      message: "สร้างข้อมูลเริ่มต้นสำเร็จ",
      quotes,
    })
  } catch (error) {
    next(error)
  }
}

export const createPriestAlbumAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const priest = await Priest.create({
      fullName: priestData.name,
      description: priestData.description,
      avatar: priestData.avatar,
      slug: priestData.slug,
    })
    for (const albumData of albumsData) {
      if (albumData.priest_name === "หลวงพ่อพุทธทาสภิกขุ") {
        const album = await Album.create({
          name: albumData.name,
          description: albumData.description,
          priestId: priest.id,
          coverImage: albumData.image.url,
          slug: albumData.slug,
          isRecommend: albumData.isRecommend,
        })
        let audioList = []
        for (const audioData of audiosData) {
          if (audioData.album === albumData._id) {
            audioList.push({
              name: audioData.name,
              source: audioData.source.url,
              albumId: album.id,
            })
          }
        }
        if (audioList.length > 0) {
          await Audio.bulkCreate(audioList)
        }
      }
    }

    res.status(201).json({
      message: "สร้างข้อมูลเริ่มต้นสำเร็จ",
      priest,
    })
  } catch (error) {
    next(error)
  }
}
