import express from "express"
import {
  createQuote,
  createRoleWithAdmin,
  createPriestAlbumAudio,
} from "../../controllers/admin/seed"
const router = express.Router()

router.get("/init/role-admin", createRoleWithAdmin)
router.get("/init/quote", createQuote)
router.get("/init/priest-album-audio", createPriestAlbumAudio)

export default router
