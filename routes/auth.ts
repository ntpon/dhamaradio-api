import express from "express"
import { check } from "express-validator"
import {
  login,
  me,
  register,
  updateMe,
  updatePassword,
} from "../controllers/auth"
import { auth } from "../middleware/auth"
import upload from "../middleware/upload"
const router = express.Router()

router.get("/me", auth, me)

router.post(
  "/register",
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
  register
)

router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  login
)
router.post(
  "/login/:role",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  login
)
router.patch(
  "/me",
  auth,
  upload.single("avatar"),
  [
    check("firstName").not().isEmpty().withMessage("กรุณาเพิ่มชื่อ"),
    check("lastName").not().isEmpty().withMessage("กรุณาเพิ่มนามสกุล"),
  ],
  updateMe
)

router.patch(
  "/password",
  auth,
  [check("oldPassword").not().isEmpty(), check("newPassword").not().isEmpty()],
  updatePassword
)

export default router
