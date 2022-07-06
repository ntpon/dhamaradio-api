import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { v2 as cloudinary } from "cloudinary"
import cors from "cors"
import { sequelize } from "./database/sequelize"

import authRoute from "./routes/auth"
import clientRoute from "./routes/client"
import memberRoute from "./routes/member"

import seedRoute from "./routes/admin/seed"
import roleAdminRoute from "./routes/admin/role"
import userAdminRoute from "./routes/admin/user"
import albumAdminRoute from "./routes/admin/album"
import audioAdminRoute from "./routes/admin/audio"
import quoteAdminRoute from "./routes/admin/quote"
import priestAdminRoute from "./routes/admin/priest"
import contactAdminRoute from "./routes/admin/contact"
import { errorHandler, errorRoute } from "./utils/errorHandler"

dotenv.config()
const app = express()

app.use(helmet())

app.use(express.json({ limit: "5mb" }))
app.use(cors())

// Setup up

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/client", clientRoute)
app.use("/api/v1/member", memberRoute)

app.use("/api/v1/admin/seed", seedRoute)
app.use("/api/v1/admin/role", roleAdminRoute)
app.use("/api/v1/admin/user", userAdminRoute)
app.use("/api/v1/admin/album", albumAdminRoute)
app.use("/api/v1/admin/audio", audioAdminRoute)
app.use("/api/v1/admin/priest", priestAdminRoute)
app.use("/api/v1/admin/quote", quoteAdminRoute)
app.use("/api/v1/admin/contact", contactAdminRoute)

app.use(errorRoute)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

sequelize
  .sync()
  .then(() => {
    console.log("Conecting to database...")
  })
  .catch((err) => {
    console.log("Error conecting to database...", err)
  })
