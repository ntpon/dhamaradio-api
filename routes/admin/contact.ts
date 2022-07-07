import express from "express"
import {
  deleteContact,
  getAllContact,
  getContactById,
  updateStatus,
} from "../../controllers/admin/contact"

import { auth, authRole } from "../../middleware/auth"

const router = express.Router()

router.get("/", auth, authRole("admin", "viewer"), getAllContact)
router.get("/:id", auth, authRole("admin", "viewer"), getContactById)
router.patch("/:id", auth, authRole("admin"), updateStatus)
router.delete("/:id", auth, authRole("admin"), deleteContact)

export default router
