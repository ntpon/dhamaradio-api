import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { Contact } from "../../models/Contact"
import { Quote } from "../../models/Quote"
import { HttpError } from "../../utils/HttpError"
import { getPagination } from "../../utils/pagination"
import { getSearch } from "../../utils/search"

export const getAllContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conditions = getSearch(req, [
      "title",
      "description",
      "fullName",
      "email",
      "phone",
    ])
    const { limit, offset } = getPagination(req)
    const contacts = await Contact.findAndCountAll({
      limit,
      offset,
      where: {
        ...conditions,
      },
    })
    let totalPage = null
    if (contacts.count > 0) {
      totalPage = Math.ceil(contacts.count / limit)
    }
    res.json({ contacts: contacts.rows || [], totalPage })
  } catch (error) {
    next(error)
  }
}

export const getContactById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const contact = await Contact.findByPk(id)
    if (!contact) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    res.json({ contact })
  } catch (error) {
    next(error)
  }
}

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { isActive, isReply } = req.body
    const contact = await Contact.findByPk(id)
    if (!contact) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await contact.update({
      isActive: isActive || contact.isActive,
      isReply: isReply || contact.isReply,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", contact })
  } catch (error) {
    next(error)
  }
}

export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const contact = await Contact.findByPk(id)
    if (!contact) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await contact.destroy()
    res.json({ message: "ลบข้อมูลสำเร็จ" })
  } catch (error) {
    next(error)
  }
}
