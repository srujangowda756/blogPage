import './App.css';
import { useState, useEffect, useCallback } from "react"
import DisplayBlog from "./components/blog-display"
import EveryBlogs from "./components/blogs/allBlogs"
import InputForm from "./components/inputForm"

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [addBlog, setAddBlog] = useState(false);
  const [new_blog, setNewBlog] = useState({ title: "", content: "" });
  const [blogs, setBlogs] = useState([]);
  const [skip, setSkip] = useState(0);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/blogs?skip=${skip}`);
      const data = await res.json()
      setBlogs(data)

    }
    catch {
      alert("failed to fetch blogs");
    }
  }, [skip])

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs])

  return (
    <EveryBlogs.Provider value={{fetchBlogs,setNewBlog,new_blog,setAddBlog}}>
      <div className="main">
      <header>
        <div>
          <h1>Blog Page</h1>
        </div>
        <button className="btn btn-secondary" onClick={() => setAddBlog(true)}>Add blog</button>
      </header>

      <div className="content">
        {addBlog ? (
          <InputForm/>
        ) : (
          <div className="blog-area">
            <div className="display">
              {blogs.map((blog) => (<DisplayBlog key={blog.id} cont={blog} />))}
            </div>
            <div className="pagination card">
              <button className="btn btn-tertiary" onClick={() => setSkip(prev => Math.max(0, prev - 8))}>Prev</button>
              <span>Showing {skip + 1} - {skip + 8}</span>
              <button className="btn btn-tertiary" onClick={() => setSkip(prev => prev + 8)}>Next</button>
            </div>
          </div>
        )}
      </div>
      </div>
    </EveryBlogs.Provider>
  );
}

export default App;