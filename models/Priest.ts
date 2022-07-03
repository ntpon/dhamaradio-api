import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript"
import { Album } from "./Album"

@Table({
  tableName: "priests",
})
export class Priest extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "full_name",
  })
  public fullName!: string

  @Column({
    allowNull: false,
    field: "avatar",
    defaultValue: "/images/default/priest-default.png",
  })
  public avatar!: string

  @Column({
    allowNull: false,
    field: "description",
  })
  public description!: string

  @Column({
    allowNull: false,
    field: "slug",
    unique: true,
  })
  public slug!: string

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

  @HasMany(() => Album)
  albums: Album[]
}
