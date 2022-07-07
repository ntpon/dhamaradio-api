import express from "express"
import { getDashboard } from "../../controllers/admin/dashboard"
import { auth, authRole } from "../../middleware/auth"
const router = express.Router()

router.get("/", auth, authRole("admin"), getDashboard)

export default router
