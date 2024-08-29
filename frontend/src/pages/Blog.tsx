import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { useBlogs } from "../hooks/index"

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return <div>
            loading...
        </div>
    }

    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="">
                {
                    blogs.map(blog => <BlogCard
                        authorName={blog.author.name || "Anonymous  "}
                        title={blog.title}
                        content={blog.content}
                        publishedDate={"26th March 2024"}
                    />)
                }
            </div>
        </div>
    </div>
}