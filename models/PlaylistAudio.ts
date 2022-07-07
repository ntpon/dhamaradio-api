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
import { Audio } from "./Audio"
import { Playlist } from "./Playlist"

@Table({
  tableName: "playlist_audios",
  timestamps: true,
  underscored: true,
})
export class PlaylistAudio extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  })
  public id!: number

  @ForeignKey(() => Playlist)
  @Column({
    allowNull: false,
    field: "playlist_id",
    unique: false,
  })
  public playlistId!: number

  @ForeignKey(() => Audio)
  @Column({
    allowNull: false,
    field: "audio_id",
  })
  public audioId!: number

  @BelongsTo(() => Playlist)
  public playlist!: Playlist

  @BelongsTo(() => Audio)
  public audio!: Audio
}
