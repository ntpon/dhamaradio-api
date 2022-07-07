import {
  Column,
  CreatedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript"
import { User } from "./User"

@Table({
  tableName: "roles",
  timestamps: true,
  underscored: true,
})
export class Role extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "name",
    unique: true,
  })
  public name!: string

  @Column({
    field: "description",
  })
  public description!: string

  @Column({
    defaultValue: true,
    allowNull: false,
    type: "BOOLEAN",
    field: "is_active",
  })
  public isActive!: boolean

  @HasMany(() => User, {
    onDelete: "RESTRICT",
  })
  public users: User[]
}
