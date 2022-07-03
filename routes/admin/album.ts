import express from "express"
import { check } from "express-validator"
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbum,
  updateAlbum,
  updateIsActive,
} from "../../controllers/admin/album"
import { auth, authRole } from "../../middleware/auth"

import upload from "../../middleware/upload"

const router = express.Router()

router.get("/", auth, authRole("admin"), getAllAlbum)
router.get("/:id", auth, authRole("admin"), getAlbumById)
router.post(
  "/",
  auth,
  authRole("admin"),
  upload.single("coverImage"),
  [
    check("name").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("description").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("priestId").not().isEmpty().withMessage("กรุณาเพิ่มชื่อพระอาจารย์"),
    check("isRecommend")
      .not()
      .isEmpty()
      .isBoolean()
      .withMessage("กรุณาเพิ่มสถานะแนะนำ"),
  ],
  createAlbum
)
router.patch(
  "/:id",
  auth,
  authRole("admin"),
  upload.single("coverImage"),
  [
    check("name").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("description").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("priestId").not().isEmpty().withMessage("กรุณาเพิ่มชื่อพระอาจารย์"),
    check("isRecommend")
      .not()
      .isEmpty()
      .isBoolean()
      .withMessage("กรุณาเพิ่มสถานะแนะนำ"),
  ],
  updateAlbum
)
router.patch(
  "/:id/active",
  auth,
  authRole("admin"),
  [check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ")],
  updateIsActive
)

router.delete("/:id", auth, authRole("admin"), deleteAlbum)

export default router
