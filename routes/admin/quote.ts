import express from "express"
import { check } from "express-validator"
import {
  createQuote,
  deleteQuote,
  getAllQuote,
  getQuoteById,
  updateIsActive,
  updateQuote,
} from "../../controllers/admin/quote"
import { auth, authRole } from "../../middleware/auth"

const router = express.Router()

router.get("/", auth, authRole("admin"), getAllQuote)
router.get("/:id", auth, authRole("admin"), getQuoteById)

router.post(
  "/",
  auth,
  authRole("admin"),
  [
    check("title").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("author").not().isEmpty().withMessage("กรุณาเพิ่มชื่อผู้เขียน"),
    check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ"),
  ],
  createQuote
)
router.patch(
  "/:id",
  auth,
  authRole("admin"),
  [
    check("title").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
    check("author").not().isEmpty().withMessage("กรุณาเพิ่มชื่อผู้เขียน"),
    check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ"),
  ],
  updateQuote
)
router.patch(
  "/:id/active",
  auth,
  authRole("admin"),
  [check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ")],
  updateIsActive
)

router.delete("/:id", auth, authRole("admin"), deleteQuote)

export default router
