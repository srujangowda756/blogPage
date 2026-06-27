import { useContext } from "react"
import EveryBlogs from "../blogs/allBlogs"

const InputForm = () => {
    const { new_blog, setAddBlog, setNewBlog,fetchBlogs } = useContext(EveryBlogs)

    
      const send_blog = async () => {
        const res=await fetch("http://localhost:8000/add-blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(new_blog)
        })
        const resp= await res.json()
        alert(resp.status)
        setNewBlog({ title: "", content: "" })
        fetchBlogs();
        setAddBlog(false)
      }
    return (
        <div className="blog-form card">
            <label>
              <span>Title</span>
              <input
                className="form-input"
                type="text"
                placeholder="Title"
                value={new_blog.title}
                onChange={(e) => setNewBlog({ ...new_blog, title: e.target.value })}
              />
            </label>
            <label>
              <span>Content</span>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Content"
                value={new_blog.content}
                onChange={(e) => setNewBlog({ ...new_blog, content: e.target.value })}
              />
            </label>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={send_blog}>Submit</button>
              <button className="btn btn-tertiary" onClick={() => setAddBlog(false)}>Cancel</button>
            </div>
          </div>
    )
}

export default InputForm