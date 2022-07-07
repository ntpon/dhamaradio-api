import express from "express"
import { check } from "express-validator"
import {
  createPriest,
  deletePriest,
  getAllPriest,
  getPriestById,
  updateIsActive,
  updatePriest,
} from "../../controllers/admin/priest"
import { auth, authRole } from "../../middleware/auth"
import upload from "../../middleware/upload"

const router = express.Router()

router.get("/", auth, authRole("admin", "viewer"), getAllPriest)
router.get("/:id", auth, authRole("admin", "viewer"), getPriestById)

router.post(
  "/",
  auth,
  authRole("admin"),
  upload.single("avatar"),
  [
    check("fullName").not().isEmpty().withMessage("กรุณาเพิ่มชื่อพระอาจารย์"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("กรุณาเพิ่มคำอธิบายพระอาจารย์"),
  ],
  createPriest
)
router.patch(
  "/:id",
  auth,
  authRole("admin"),
  upload.single("avatar"),
  [
    check("fullName").not().isEmpty().withMessage("กรุณาเพิ่มชื่อพระอาจารย์"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("กรุณาเพิ่มคำอธิบายพระอาจารย์"),
  ],
  updatePriest
)
router.patch(
  "/:id/active",
  auth,
  authRole("admin"),
  [check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ")],
  updateIsActive
)

router.delete("/:id", auth, authRole("admin"), deletePriest)

export default router
