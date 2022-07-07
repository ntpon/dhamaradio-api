import { Optional } from "sequelize"
import {
  Table,
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript"
import { Playlist } from "./Playlist"
import { Role } from "./Role"

@Table({ tableName: "users", timestamps: true, underscored: true })
export class User extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "first_name",
  })
  public firstName!: string

  @Column({
    allowNull: false,
    field: "last_name",
  })
  public lastName!: string

  @Column({
    allowNull: false,
    field: "email",
  })
  public email!: string

  @Column({
    allowNull: false,
    field: "password",
  })
  public password!: string

  @Column({
    allowNull: false,
    field: "avatar",
    defaultValue: "/images/default/user-default.png",
  })
  public avatar!: string

  @ForeignKey(() => Role)
  @Column({
    field: "role_id",
  })
  public roleId!: number

  @Column({
    defaultValue: true,
    allowNull: false,
    type: "BOOLEAN",
    field: "is_active",
  })
  public isActive!: boolean

  @HasMany(() => Playlist)
  playlists: Playlist[]

  @BelongsTo(() => Role)
  role: Role
}
