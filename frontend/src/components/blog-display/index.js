import './index.css'
import { useContext } from "react"
import EveryBlogs from "../blogs/allBlogs"

const DisplayBlog = ({ cont }) => {
    const { fetchBlogs } = useContext(EveryBlogs)

    const deleteBlog = async () => {
        const res= await fetch(`http://localhost:8000/delete-blog/${cont.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resp=await res.json()
        fetchBlogs()
        alert(resp.status)
    }

    return (
        <div className="blog-card">
            <div className="btn-cont">
                <div>
                    {/* <button onClick={updateBlog}>update</button> */}
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
                <h6>{cont.created_at}</h6>
            </div>
        </div>
    )
}

export default DisplayBlog