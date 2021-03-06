import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript"

@Table({
  tableName: "quotes",
  timestamps: true,
  underscored: true,
})
export class Quote extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "order_number",
    defaultValue: 0,
  })
  public orderNumber: number

  @Column({
    allowNull: false,
    field: "title",
  })
  public title!: string

  @Column({
    allowNull: false,
    field: "author",
  })
  public author!: string

  @Column({
    allowNull: false,
    field: "is_active",
    defaultValue: true,
  })
  public isActive!: boolean
}
