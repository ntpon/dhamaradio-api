import express from "express"
import { check } from "express-validator"
import {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  getPlaylistBySlug,
  createAudioToPlaylist,
  getPlaylistsWithCountAudio,
} from "../controllers/memeber"
import { auth } from "../middleware/auth"
import upload from "../middleware/upload"

const router = express.Router()

router.get("/playlist", auth, getPlaylists)
router.get("/playlist/with-count", auth, getPlaylistsWithCountAudio)
router.get("/playlist/:slug", auth, getPlaylistBySlug)

router.post(
  "/playlist",
  auth,
  upload.single("coverImage"),
  [
    check("name").not().isEmpty().withMessage("กรุณาเพิ่มชื่อรายการ"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("กรุณาเพิ่มคำอธิบายรายการ"),
    check("isPrivate")
      .not()
      .isEmpty()
      .isBoolean()
      .withMessage("กรุณาเลือกสถานะรายการ"),
  ],
  createPlaylist
)

router.patch(
  "/playlist",
  auth,
  [
    check("slug").not().isEmpty().withMessage("กรุณาเลือกรายการ"),
    check("audioId").not().isEmpty().withMessage("กรุณาเลือกเสียง"),
  ],
  createAudioToPlaylist
)

router.delete("/playlist/:slug", auth, deletePlaylist)

export default router
