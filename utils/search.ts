import { Request } from "express"
import { Op } from "sequelize"

export const getSearch = (req: Request, filedInDatabase: string[]) => {
  const search = req.query.search
  if (!search) return null
  const conditionSearch = {
    [Op.or]: filedInDatabase.map((field) => ({
      [field]: {
        [Op.like]: `%${search}%`,
      },
    })),
  }
  return conditionSearch
}
