import './index.css'
import { useContext, useState } from "react"
import EveryBlogs from "../blogs/allBlogs"

const DisplayBlog = ({ cont }) => {
    const { fetchBlogs } = useContext(EveryBlogs)
    const [title, setTitle] = useState(cont.title)
    const [content, setContent] = useState(cont.content)
    const [isUpdating, setIsUpdating] = useState(false)

    const updateBlog = async () => {
        await fetch(`http://localhost:8000/blogs/${cont.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        })

        fetchBlogs()
        setIsUpdating(false)
    }

    const deleteBlog = async () => {
        await fetch(`http://localhost:8000/blogs/${cont.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        fetchBlogs()
    }
    return (
        // need to add pop that takes title and content
        <div>
            {isUpdating ? (
                <div className="update-form">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
                    <button className="btn-update" onClick={updateBlog}>update</button>
                </div>
            ) : (<div className="blog-card">
                <div className="btn-cont">
                    <div>
                        <button className="btn-update" onClick={() => setIsUpdating(true)}>update</button>
                        <button className="btn-delete" onClick={deleteBlog} aria-label="Delete blog">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M9 3v1H4v2h16V4h-5V3H9zm1 5v9h2V8H10zM6 8v9h2V8H6zm10 0v9h2V8h-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <h2>{cont.title}</h2>
                    <p>{cont.content}</p>
                    <h6>{new Date(cont.created_at).toLocaleString()}</h6>
                </div>
            </div>)}

        </div>
    )
}

export default DisplayBlog




