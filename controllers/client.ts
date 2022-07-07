import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { Op } from "sequelize"

import { Album } from "../models/Album"
import { Audio } from "../models/Audio"
import { Contact } from "../models/Contact"
import { Priest } from "../models/Priest"
import { Quote } from "../models/Quote"
import { User } from "../models/User"
import { HttpError } from "../utils/HttpError"

export const getQuoteAndAlbumRecommend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [quotes, albumsRecommend, albumsPriest] = await Promise.all([
    Quote.findAll({
      attributes: {
        exclude: ["createdAt", "updateDate"],
      },
      where: {
        isActive: true,
      },
    }),
    Album.findAll({
      attributes: {
        exclude: ["createdAt", "updateDate", "totalView"],
      },
      where: {
        isActive: true,
        isRecommend: true,
      },
    }),
    Album.findAll({
      attributes: {
        exclude: ["createdAt", "updateDate", "totalView"],
      },
      where: {
        priestId: "1",
        isActive: true,
        isRecommend: false,
      },
    }),
  ])

  res.json({
    quotes,
    albumsRecommend,
    albumsPriest,
  })
}
export const getAlbumFromSearchData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { value } = req.query
    console.log(value)
    const albums = await Album.findAll({
      attributes: ["slug", "name", "description", "coverImage"],
      where: {
        isActive: true,
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + value + "%",
            },
            description: {
              [Op.like]: "%" + value + "%",
            },
          },
        ],
      },
    })
    res.json({
      albums,
    })
  } catch (error) {
    next(error)
  }
}

export const getPriests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const priests = await Priest.findAll({
    attributes: ["fullName", "avatar", "slug"],
    where: {
      isActive: true,
    },
  })
  res.json({
    priests,
  })
}
export const getPriestBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params
  const priest = await Priest.findOne({
    attributes: ["fullName", "avatar", "slug"],
    where: {
      slug,
      isActive: true,
    },
    include: {
      model: Album,
      as: "albums",
      attributes: ["name", "description", "coverImage", "slug"],
      where: {
        isActive: true,
      },
    },
  })
  res.json({
    priest,
  })
}

export const getAlbums = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const albums = await Album.findAll({
    attributes: ["slug", "name", "coverImage", "description"],
    where: {
      isActive: true,
    },
  })
  res.json({
    albums,
  })
}

export const getAlbumBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params
    const album = await Album.findOne({
      attributes: ["slug", "name", "coverImage", "description", "createdAt"],
      where: {
        slug,
      },
      include: [
        {
          model: Audio,
          as: "audios",
          attributes: ["id", "name", "source", "createdAt"],
          where: {
            isActive: true,
          },
        },
        {
          model: Priest,
          as: "priest",
          attributes: ["fullName"],
          where: {
            isActive: true,
          },
        },
      ],
    })

    res.json({
      album,
    })
  } catch (error) {}
}

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { fullName, email, phone, title, description, userId } = req.body
    const newContact = new Contact({
      fullName,
      email,
      phone,
      title,
      description,
    })
    if (phone) {
      newContact.phone = phone
    }
    if (userId) {
      const user = await User.findByPk(userId)
      if (!user) {
        throw HttpError.notFound("ไม่พบผู้ใช้นี้")
      }
      if (!user.isActive) {
        throw HttpError.badRequest("ผู้ใช้นี้ถูกระงับการใช้งาน")
      }
      newContact.userId = userId
    }
    await newContact.save()
    res.json({
      message: "ส่งข้อมูลสำเร็จ",
    })
  } catch (error) {
    next(error)
  }
}
