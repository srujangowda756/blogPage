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
    <div className="main border">
      <header>
        <h1>Blog Page</h1>
        <button onClick={() => { setAddBlog(true) }}>Add blog</button>
      </header>
      <div className="content border">
        {addBlog ? (
          <div>
            <p>Title:</p><input type="text" placeholder="Title" value={new_blog.title} onChange={(e) => setNewBlog({ ...new_blog, title: e.target.value })} />
            <p>Content:</p><textarea row={5} col={5} type="text" placeholder="Content" value={new_blog.content} onChange={(e) => setNewBlog({ ...new_blog, content: e.target.value })} />
            <button onClick={send_blog}>Submit</button>
          </div>
        ) : (<div>
                <div className="display">
                  {
                    blogs.map((blog) => (<DisplayBlog key={blog.id} cont={blog} />))
                  }
                </div>
                <div>
                  <button onClick={()=>{setSkip(prev=>Math.max(0,prev-10))}}>prev</button>From: {skip} - To:{skip+10}<button onClick={()=>{setSkip(prev=>prev+10)}}>next</button>
                </div>
          </div>)
        }
      </div>
    </div>
  );
}

export default App;
