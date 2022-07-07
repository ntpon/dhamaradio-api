import express from "express"
import { check } from "express-validator"
import {
  createRole,
  deleteRole,
  getAllRole,
  getRoleById,
  updateIsActive,
  updateRole,
} from "../../controllers/admin/role"
import { auth, authRole } from "../../middleware/auth"
const router = express.Router()
router.get("/", auth, authRole("admin", "viewer"), getAllRole)
router.get("/all", auth, authRole("admin", "viewer"), getAllRole)
router.get("/:id", auth, authRole("admin", "viewer"), getRoleById)
router.post(
  "/",
  auth,
  authRole("admin"),
  [
    check("name").not().isEmpty().withMessage("กรุณาเพิ่มชื่อ"),
    check("description").not().isEmpty().withMessage("กรุณาเพิ่มรายละเอียด"),
  ],
  createRole
)
router.patch(
  "/:id",
  auth,
  authRole("admin"),
  [
    check("name").not().isEmpty().withMessage("กรุณาเพิ่มชื่อ"),
    check("description").not().isEmpty().withMessage("กรุณาเพิ่มรายละเอียด"),
  ],
  updateRole
)
router.patch(
  "/:id/active",
  auth,
  authRole("admin"),
  [check("isActive").not().isEmpty().withMessage("กรุณาเพิ่มสถานะ")],
  updateIsActive
)

router.delete("/:id", auth, authRole("admin"), deleteRole)

export default router
