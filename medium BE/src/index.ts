import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'


// const app = new Hono()
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()


app.route('/api/v1/user',userRouter)

// app.route('/api/v1/user/signin',userRouter)
app.route('/api/v1/blog',blogRouter)
export default app


// postgres://avnadmin:AVNS_ElFbcApF3tOv-tuRuUK@pg-1c222f27-kamleshdubey108-ec24.h.aivencloud.com:25259/defaultdb?sslmode=require