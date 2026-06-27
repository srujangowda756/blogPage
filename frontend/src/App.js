import './App.css';
import { useState, useEffect,useCallback } from "react"
import DisplayBlog from "./components/blog-display"


function App() {
  const [addBlog, setAddBlog] = useState(false);
  const [new_blog, setNewBlog] = useState({ title: "", content: "" });
  const [blogs, setBlogs] = useState([]);
  const [skip, setSkip] = useState(0);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8000/get-blogs?skip=${skip}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await res.json()
      setBlogs(data)
    }
    catch {
      alert("failed");
    }
  },[skip])

  const send_blog = async () => {
    fetch("http://localhost:8000/add-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new_blog)
    })
    setNewBlog({ title: "", content: "" })
    setAddBlog(false)
    fetchBlogs();
  }

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs])

  return (
    <div className="main">
      <header>
        <div>
          <h1>Blog Page</h1>
          <p className="subtitle">Read, create, and browse your latest posts.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setAddBlog(true)}>Add blog</button>
      </header>

      <div className="content">
        {addBlog ? (
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
        ) : (
          <div className="blog-area">
            <div className="display">
              {blogs.map((blog) => (<DisplayBlog key={blog.id} cont={blog} />))}
            </div>
            <div className="pagination card">
              <button className="btn btn-tertiary" onClick={() => setSkip(prev => Math.max(0, prev - 10))}>Prev</button>
              <span>Showing {skip + 1} - {skip + 10}</span>
              <button className="btn btn-tertiary" onClick={() => setSkip(prev => prev + 10)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
