import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { Role } from "../../models/Role"
import { HttpError } from "../../utils/HttpError"
import { getPagination } from "../../utils/pagination"
import { getSearch } from "../../utils/search"

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
    const { name, description } = req.body
    const role = await Role.create({
      name,
      description,
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
    const { name, description } = req.body
    const role = await Role.findByPk(id)
    if (!role) {
      throw HttpError.notFound("ไม่พบข้อมูล")
    }
    await role.update({
      name,
      description,
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
    const conditionSearch = getSearch(req, ["name", "description"])
    const { limit, offset } = getPagination(req)
    const roles = await Role.findAndCountAll({
      limit,
      offset,
      where: {
        ...conditionSearch,
      },
      order: [["updatedOn", "DESC"]],
    })
    let totalPage = null
    if (roles.count > 0) {
      totalPage = Math.ceil(roles.count / limit)
    }

    res.json({ roles: roles.rows || [], totalPage })
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
