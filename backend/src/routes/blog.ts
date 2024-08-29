import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { createBlog, uppdateCreateBlog } from "commonsyogeshmodule"


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();

// middleware
blogRouter.use("/", async (c, next) => {
    try {
        const authHeader = c.req.header("authorization") || "";
        const token = authHeader.split(" ")[1]; // Split by space to get the token

        if (!token) {
            c.status(403);
            return c.json({ message: "User is not logged in" });
        }

        const user = await verify(token, c.env.JWT_SECRET);
        if (user) {
            //@ts-ignore
            c.set("userId", user.id);
            await next(); // Proceed to the next middleware or route handler
        } else {
            c.status(403);
            return c.json({ message: "User is not logged in" });
        }

    } catch (err) {
        c.status(403);
        return c.json({ message: "Invalid token or error in verification" });
    }
});


// to add a blog
blogRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { success } = createBlog.safeParse(body)
        if (!success) {
            c.status(411);
            return c.json({
                message: "Invalid Inputs"
            })

        }
        const authorId = c.get("userId")
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const createBlogs = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })

        return c.json({
            id: createBlogs.id
        })

    } catch (err) {
        c.status(401);
        return c.json({
            message: "Error creating Blog-Post"
        })
    }
})

// to update the Blogs
blogRouter.put("/", async (c) => {
    try {
        const body = await c.req.json();
        const { success } = uppdateCreateBlog.safeParse(body)
        if (!success) {
            c.status(411);
            return c.json({
                message: "Invalid Inputs"
            })
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const updateBlogs = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })

        return c.json({
            id: updateBlogs.id
        })

    } catch (err) {
        c.status(411);
        return c.json({
            message: "Error updating Blog-Posts"
        })
    }
})

//to get all the Blogs
blogRouter.get('/bulk', async (c) => {
    try {
        // const body = await c.req.json();
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const getAllBlogs = await prisma.post.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({
            getAllBlogs: getAllBlogs
        })

    } catch (err) {
        c.status(401);
        return c.json({
            message: "Error loading the blogs"
        })
    }
})

// to get a specific blog 
blogRouter.get('/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const getBlogs = await prisma.post.findFirst({
            where: {
                id: id
            }
        })

        return c.json({
            getBlogs
        })

    } catch (err) {
        c.status(403);
        return c.json({
            message: "Error getting the specific Blog"
        })
    }
})

