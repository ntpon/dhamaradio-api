import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { Role } from "../../models/Role"
import { HttpError } from "../../utils/HttpError"
import { getPagination } from "../../utils/pagination"

export const createRole = async (
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
    const role = await Role.create({
      title,
      author,
      isActive,
    })
    res.status(201).json({ message: "สร้างข้อมูลสำเร็จ", role })
  } catch (error) {
    next(error)
  }
}

export const updateRole = async (
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
    const role = await Role.findByPk(id)
    if (!role) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await role.update({
      title,
      author,
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", role })
  } catch (error) {
    next(error)
  }
}

export const getAllRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, offset } = getPagination(req)
    const roles = await Role.findAndCountAll({
      limit,
      offset,
    })

    res.json({ roles })
  } catch (error) {
    next(error)
  }
}

export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const role = await Role.findByPk(id)
    if (!role) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    res.json({ role })
  } catch (error) {
    next(error)
  }
}

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const role = await Role.findByPk(id)
    if (!role) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await role.destroy()
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
    const role = await Role.findByPk(id)
    if (!role) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await role.update({
      isActive,
    })
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", role })
  } catch (error) {
    next(error)
  }
}
