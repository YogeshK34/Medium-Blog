import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config";

interface Blog {
    content: string,
    title: string,
    id: string,
    author: {
        name: string
    }
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`)
            .then(response => {
                setBlogs(response.data.getAllBlogs);
                setLoading(false)
            })
    }, [])

    return {
        loading,
        blogs
    }
}