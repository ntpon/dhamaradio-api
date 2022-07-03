import { Request } from "express"

export const getPagination = (
  req: Request,
  pageDefault = 1,
  limitDefault = 100
) => {
  const page = Number(req.query.page) || pageDefault
  const limit = Number(req.query.limit) || limitDefault
  const offset = (page - 1) * limit
  return { page, limit, offset }
}
