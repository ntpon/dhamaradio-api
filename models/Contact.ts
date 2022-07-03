import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript"

@Table({
  tableName: "contacts",
})
export class Contact extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "title",
  })
  public title!: string

  @Column({
    allowNull: false,
    field: "description",
  })
  public description!: string

  @Column({
    allowNull: false,
    field: "full_name",
  })
  public fullName!: string

  @Column({
    allowNull: false,
    field: "email",
  })
  public email!: string

  @Column({
    field: "phone",
  })
  public phone!: string

  @Column({
    field: "user_id",
  })
  public userId!: string

  @Column({
    allowNull: false,
    field: "is_reply",
    defaultValue: false,
  })
  public isReply!: boolean

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
  updateDate: Date
}
