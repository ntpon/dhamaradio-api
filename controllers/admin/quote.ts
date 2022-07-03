import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { Quote } from "../../models/Quote"
import { HttpError } from "../../utils/HttpError"
import { getPagination } from "../../utils/pagination"

export const createQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw HttpError.badRequest(errors.array())
    }
    const { title, author, isActive } = req.body
    const quote = await Quote.create({
      title,
      author,
      isActive,
    })
    res.status(201).json({ message: "สร้างข้อมูลสำเร็จ", quote })
  } catch (error) {
    next(error)
  }
}

export const updateQuote = async (
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
    const { title, author, isActive } = req.body
    const quote = await Quote.findByPk(id)
    if (!quote) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await quote.update({
      title,
      author,
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", quote })
  } catch (error) {
    next(error)
  }
}

export const getAllQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset } = getPagination(req)
    const quotes = await Quote.findAndCountAll({
      limit,
      offset,
    })

    res.json({ quotes })
  } catch (error) {
    next(error)
  }
}

export const getQuoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const quote = await Quote.findByPk(id)
    if (!quote) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    res.json({ quote })
  } catch (error) {
    next(error)
  }
}

export const deleteQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const quote = await Quote.findByPk(id)
    if (!quote) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await quote.destroy()
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
    const quote = await Quote.findByPk(id)
    if (!quote) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await quote.update({
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", quote })
  } catch (error) {
    next(error)
  }
}
