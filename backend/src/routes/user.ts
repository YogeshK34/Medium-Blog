import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "commonsyogeshmodule";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>();

// signup route
userRouter.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body)
    if (!success) {
      c.status(411);
      return c.json({
        message: "Invalid Inputs"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    })
    c.text("User created")
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.json({
      jwt: jwt
    })

  } catch (err) {
    c.status(411);
    return c.json("Error creating usser");
  }
})


//signin route 
userRouter.post('/signin', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body)
    if (!success) {
      c.status(411);
      return c.json({
        message: "Invalid Inputs"
      })
    }
    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (err) {
    c.status(403);
    c.json({
      msg: "Error verifying the JWT"
    })
  }
})