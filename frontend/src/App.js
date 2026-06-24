import './App.css';
import { useState, useEffect } from "react"
import {v4 as uuid4} from 'uuid'


function App() {
  const [addBlog, setAddBlog] = useState(false);
  const [new_blog, setNewBlog] = useState({ id:uuid4(),title: "", content: "" });
  const [blogs, setBlogs] = useState([]);
  
  const fetchBlogs = async() => {
      try {
        const res = await fetch("http://localhost:8000/get-blogs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json()
        setBlogs(data)
      }
      catch {
        alert("failed");
      }
    }

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
  }, [])

  return (
    <div>
      <header>
        <h1>Blog Page</h1>
        <button onClick={() => { setAddBlog(true) }}>Add blog</button>
      </header>
      {addBlog ? (<div>
        <p>Title:</p><input type="text" placeholder="Title" value={new_blog.title} onChange={(e) => setNewBlog({ ...new_blog, title: e.target.value })} />
        <p>Content:</p><input type="text" placeholder="Content" value={new_blog.content} onChange={(e) => setNewBlog({ ...new_blog, content: e.target.value })} />
        <button onClick={send_blog}>Submit</button>
      </div>) : (blogs.map((blog) => {
        console.log(blog);
        return (
          
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <p>{blog.created_at}</p>
          </div>
        )
      }))}
    </div>
  );
}

export default App;
