import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript"
import { Audio } from "./Audio"
import { Priest } from "./Priest"

@Table({
  tableName: "albums",
})
export class Album extends Model {
  public id!: number

  @Column({
    allowNull: false,
    field: "name",
    unique: true,
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

  @Column({
    allowNull: false,
    field: "total_view",
    defaultValue: 0,
  })
  public totalView!: number

  @ForeignKey(() => Priest)
  @Column({
    allowNull: false,
    field: "priest_id",
  })
  public priestId!: number

  @Column({
    allowNull: false,
    field: "is_recommend",
    defaultValue: false,
  })
  public isRecommend!: boolean

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

  @BelongsTo(() => Priest)
  priest: Priest

  @HasMany(() => Audio)
  audios: Audio[]
}
