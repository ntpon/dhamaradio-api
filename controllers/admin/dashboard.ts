import { NextFunction, Request, Response } from "express"
import { Op, QueryTypes } from "sequelize"
import { sequelize } from "../../database/sequelize"
import { Album } from "../../models/Album"
import { Contact } from "../../models/Contact"
import { Playlist } from "../../models/Playlist"
import { PlaylistAudio } from "../../models/PlaylistAudio"
import { User } from "../../models/User"

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [userCount, albumCount, contactCount, playlistCount] =
      await Promise.all([
        User.count(),
        Album.count(),
        Contact.count({
          where: {
            isActive: true,
            isReply: false,
          },
        }),
        // only current year
        PlaylistAudio.count({
          where: {
            createdAt: {
              [Op.between]: [
                new Date(new Date().getFullYear(), 0, 1),
                new Date(new Date().getFullYear(), 11, 31),
              ],
            },
          },
        }),
      ])

    const chartData = await sequelize.query(
      `
      SELECT 
      m.mth, 
      m.mlabel,
      CASE WHEN 
          d.value IS NULL THEN 0 
          ELSE d.value 
      END
      FROM (VALUES (1,'มกราคม' ), (2,'กุมภาพันธ์' ), (3,'มีนาคม'), (4,'เมษายน'), (5,'พฤษภาคม'), (6,'มิถุนายน'), (7,'กรกฎาคม'), (8,'สิงหาคม'), (9,'กันยายน'), (10,'ตุลาคม'), (11,'พฤศจิกายน'), (12,'ธันวาคม')) AS m (mth,mlabel)
      LEFT JOIN (
          SELECT 
              date_part('month',updated_at) AS mo,
              count(id) AS value
          FROM playlist_audios
          WHERE date_part('year',updated_at) = date_part('year', CURRENT_DATE)
          GROUP BY date_part('month', updated_at)
      ) AS d ON d.mo = m.mth
`,
      {
        type: QueryTypes.SELECT,
      }
    )

    res.json({
      userCount,
      albumCount,
      contactCount,
      playlistCount,
      chartData,
    })
  } catch (error) {
    res.json({
      userCount: 0,
      albumCount: 0,
      contactCount: 0,
      playlistCount: 0,
    })
  }
}
