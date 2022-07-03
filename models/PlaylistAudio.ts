import {
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
})
export class PlaylistAudio extends Model {
  @ForeignKey(() => Playlist)
  @Column({
    allowNull: false,
    field: "playlist_id",
  })
  public playlistId!: number

  @ForeignKey(() => Audio)
  @Column({
    allowNull: false,
    field: "audio_id",
  })
  public audioId!: number

  @CreatedAt
  @Column({
    field: "created_at",
  })
  creationDate: Date

  @UpdatedAt
  @Column({
    field: "updated_at",
  })
  updatedDate: Date
}
