import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript"
import { Album } from "./Album"
import { Playlist } from "./Playlist"
import { PlaylistAudio } from "./PlaylistAudio"

@Table({
  tableName: "audios",
})
export class Audio extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "order_number",
    defaultValue: 0,
  })
  public orderNumber: number

  @Column({
    allowNull: false,
    field: "name",
  })
  public name!: string

  @Column({
    allowNull: false,
    field: "source",
  })
  public source!: string

  @Column({
    allowNull: false,
    field: "total_view",
    defaultValue: 0,
  })
  public totalView!: number

  @ForeignKey(() => Album)
  @Column({
    allowNull: false,
    field: "album_id",
  })
  public albumId!: number

  @Column({
    allowNull: false,
    field: "is_active",
    defaultValue: true,
  })
  public isActive!: boolean

  @CreatedAt
  @Column({
    field: "created_at",
  })
  creationDate: Date

  @UpdatedAt
  @Column({
    field: "updated_at",
  })
  updatedOn: Date

  @BelongsTo(() => Album)
  album!: Album

  @BelongsToMany(() => Playlist, () => PlaylistAudio)
  playlists!: Playlist[]
}
