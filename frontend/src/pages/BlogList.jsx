import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogList.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_URL}/blogs/`);
        if (!res.ok) throw new Error('Failed to load blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="bloglist-page">
      <main className="container bloglist-main">
        {loading && <div className="spinner" />}
        {error && <div className="error-box">⚠ {error}</div>}

        {!loading && !error && blogs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No posts yet.</h3>
            <p>Be the first to write something!</p>
            <Link to="/create" className="btn-primary">Write your first post</Link>
          </div>
        )}

        <div className="blog-grid">
          {blogs.map((blog, i) => (
            <article
              key={blog.id}
              className="blog-card fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="card-badge">
                {readingTime(blog.content)} min read
              </div>
              <h2 className="card-title">{blog.title}</h2>
              <p className="card-excerpt">
                {blog.content.slice(0, 50)}{blog.content.length > 50 ? '…' : ''}
              </p>
              <div className="card-footer">
                <span className="card-date">{formatDate(blog.created_at)}</span>
                <Link to={`/blogs/${blog.id}`} className="card-link">
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
