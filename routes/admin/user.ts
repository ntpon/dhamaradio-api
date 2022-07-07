import express from "express"
import { check } from "express-validator"
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  updateIsActive,
  updateUser,
} from "../../controllers/admin/user"

import { auth, authRole } from "../../middleware/auth"
import upload from "../../middleware/upload"

const router = express.Router()

router.get("/", auth, authRole("admin", "viewer"), getAllUser)
router.get("/:id", auth, authRole("admin", "viewer"), getUserById)
router.post(
  "/",
  auth,
  authRole("admin"),
  upload.single("avatar"),
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("กรุณาเพิ่มอีเมล")
      .isEmail()
      .withMessage("กรุณาเพิ่มอีเมลที่ถูกต้อง"),
    check("firstName").not().isEmpty().withMessage("กรุณาเพิ่มชื่อ"),
    check("lastName").not().isEmpty().withMessage("กรุณาเพิ่มนามสกุล"),
    check("password").not().isEmail().withMessage("กรุณาเพิ่มรหัสผ่าน"),
  ],
  createUser
)
router.patch(
  "/:id",
  auth,
  authRole("admin"),
  upload.single("avatar"),
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("กรุณาเพิ่มอีเมล")
      .isEmail()
      .withMessage("กรุณาเพิ่มอีเมลที่ถูกต้อง"),
    check("firstName").not().isEmpty().withMessage("กรุณาเพิ่มชื่อ"),
    check("lastName").not().isEmpty().withMessage("กรุณาเพิ่มนามสกุล"),
    check("password").not().isEmail().withMessage("กรุณาเพิ่มรหัสผ่าน"),
  ],
  updateUser
)
router.patch(
  "/:id/active",
  auth,
  authRole("admin"),
  [check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ")],
  updateIsActive
)

router.delete("/:id", auth, authRole("admin"), deleteUser)

export default router
