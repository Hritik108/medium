import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { Hono } from "hono"
import { sign } from "hono/jwt"
// import { signupInput } from "../zod"
import { signupInput,signinInput } from "@kamleshd13/medium-common"

// export const userRouter = new Hono();
// const app = new Hono()
export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string,
      JWT_SECRET: string
    }
  }>()

  userRouter.post('/signup', async (c) => {

  const body = await c.req.json()
  const {success} =signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({message:"Inputs not correct"})
  }
  // It is defined in each worker since it cannot be global, it can only be access using c
  console.log(c.env)

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    console.log(body)
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name
      }
    })

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.text(jwt)

  }
  catch (e) {
    console.log(e);
    c.status(411);
    return c.text("invalid")
  }

})

userRouter.post('/signin', async (c) => {
  const body = await c.req.json()
const {success} = signinInput.safeParse(body);
  // It is defined in each worker since it cannot be global, it can only be access using c
  if(!success){
    c.status(411);
    return c.json({message:"Inputs not correct"})
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    console.log(body)
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password
      }
    })

    if (!user) {
      c.status(403);
      return c.json({ message: "Incorrect creds" })
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.text(jwt)

  }
  catch (e) {
    console.log(e);
    c.status(411);
    return c.text("invalid")
  }

})