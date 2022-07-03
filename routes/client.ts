import express from "express"
import { check } from "express-validator"
import {
  createContact,
  getAlbumBySlug,
  getAlbums,
  getPriestBySlug,
  getPriests,
  getQuoteAndAlbumRecommend,
  getAlbumFromSearchData,
} from "../controllers/client"
const router = express.Router()

router.get("/home", getQuoteAndAlbumRecommend)
router.get("/search", getAlbumFromSearchData)
router.get("/priest", getPriests)
router.get("/priest/:slug", getPriestBySlug)
router.get("/album", getAlbums)
router.get("/album/:slug", getAlbumBySlug)

router.post(
  "/contact",
  [
    check("fullName").not().isEmpty().withMessage("กรุณาเพิ่มชื่อ-นามสกุล"),
    check("email").isEmail().withMessage("กรุณาเพิ่มอีเมล"),
    check("title").not().isEmpty().withMessage("กรุณาเพิ่มหัวข้อ / ชื่อเรื่อง"),
    check("description").not().isEmpty().withMessage("กรุณาเพิ่มข้อความ"),
  ],
  createContact
)

export default router
