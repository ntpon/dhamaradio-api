import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript"
import { Audio } from "./Audio"
import { PlaylistAudio } from "./PlaylistAudio"
import { User } from "./User"

type PlaylistType = "DEFAULT" | "CREATE"

@Table({
  tableName: "playlists",
  timestamps: true,
  underscored: true,
})
export class Playlist extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "name",
  })
  public name!: string

  @Column({
    allowNull: false,
    field: "description",
  })
  public description!: string

  @Column({
    allowNull: false,
    field: "cover_image",
    defaultValue: "/images/default/album-default.png",
  })
  public coverImage!: string

  @Column({
    allowNull: false,
    field: "slug",
    unique: true,
  })
  public slug!: string

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    field: "user_id",
  })
  public userId!: number

  @Default("CREATE")
  @Column(DataType.ENUM("DEFAULT", "HISTORY", "CREATE"))
  public type!: PlaylistType

  @Column({
    defaultValue: true,
    allowNull: false,
    type: "BOOLEAN",
    field: "is_private",
  })
  public isPrivate!: boolean

  @Column({
    defaultValue: true,
    allowNull: false,
    type: "BOOLEAN",
    field: "is_active",
  })
  public isActive!: boolean

  @BelongsTo(() => User)
  user: User

  @BelongsToMany(() => Audio, {
    through: {
      model: () => PlaylistAudio,
      unique: false,
    },
  })
  audios: Audio[]
}
