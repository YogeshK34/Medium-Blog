import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { useBlogs } from "../hooks"

export const Blogs = () => {
    const [loading, blogs] = useBlogs();

    if (loading) {
        return <div>
            loading...
        </div>
    }

    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="max-w-xl">
                <BlogCard
                    authorName={"Yogesh Khutwad"}
                    title={"Embracing the Unpredictable: How to Find Joy in Life's Random Moments"}
                    content={"Life is a series of unpredictable events, each with its own unique surprises...."}
                    publishedDate={"26th March 2022"}
                />
                <BlogCard
                    authorName={"Yogesh Khutwad"}
                    title={"Embracing the Unpredictable: How to Find Joy in Life's Random Moments"}
                    content={"Life is a series of unpredictable events, each with its own unique surprises...."}
                    publishedDate={"26th March 2022"}
                />
                <BlogCard
                    authorName={"Yogesh Khutwad"}
                    title={"Embracing the Unpredictable: How to Find Joy in Life's Random Moments"}
                    content={"Life is a series of unpredictable events, each with its own unique surprises...."}
                    publishedDate={"26th March 2022"}
                />
            </div>
        </div>
    </div>
}