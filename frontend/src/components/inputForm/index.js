import { useContext} from "react"
import EveryBlogs from "../blogs/allBlogs"

const API_URL = process.env.REACT_APP_API_URL;

const InputForm = () => {
    const { new_blog, setAddBlog, setNewBlog,fetchBlogs } = useContext(EveryBlogs)

    
      const send_blog = async () => {
        await fetch(`${API_URL}/blogs/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(new_blog)
        })
        //const resp= await res.json()
        //add pop up saying "blog added successfully not alert
         


        setNewBlog({ title: "", content: "" })
        fetchBlogs();
        setAddBlog(false)
      }
    return (
        <div className="blog-form card">
            <div className="form-header">
              <div>
                <h2 className="form-title">Create new blog</h2>
                <p className="form-subtitle">Write your blog content here and submit to save it.</p>
              </div>
            </div>
            <label>
              <span>Title</span>
              <input
                className="form-input"
                type="text"
                placeholder="Enter title"
                value={new_blog.title}
                onChange={(e) => setNewBlog({ ...new_blog, title: e.target.value })}
              />
            </label>
            <label>
              <span>Content</span>
              <textarea
                className="form-textarea"
                rows={8}
                placeholder="Write your blog content here"
                value={new_blog.content}
                onChange={(e) => setNewBlog({ ...new_blog, content: e.target.value })}
              />
            </label>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={send_blog}>Save changes</button>
              <button className="btn btn-tertiary" onClick={() => setAddBlog(false)}>Cancel</button>
            </div>
          </div>
    )
}

export default InputForm