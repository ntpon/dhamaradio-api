import express from "express"
import { check } from "express-validator"
import {
  createAudio,
  deleteAudio,
  getAllAudio,
  getAudioById,
  updateAudio,
  updateIsActive,
} from "../../controllers/admin/audio"
import { auth, authRole } from "../../middleware/auth"
import upload from "../../middleware/upload"

const router = express.Router()

router.get("/", auth, authRole("admin"), getAllAudio)
router.get("/:id", auth, authRole("admin"), getAudioById)
router.post(
  "/",
  auth,
  authRole("admin"),
  upload.single("source"),
  [
    check("name").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("albumId").not().isEmpty().withMessage("กรุณาเพิ่มชุดเสียง"),
  ],
  createAudio
)
router.patch(
  "/:id",
  auth,
  authRole("admin"),
  upload.single("source"),
  [
    check("name").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("albumId").not().isEmpty().withMessage("กรุณาเพิ่มชุดเสียง"),
  ],
  updateAudio
)
router.patch(
  "/:id/active",
  auth,
  authRole("admin"),
  [check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ")],
  updateIsActive
)

router.delete("/:id", auth, authRole("admin"), deleteAudio)
export default router
