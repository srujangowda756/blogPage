import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, getWsUrl } from '../api';
import './BlogList.css';

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [liveMessage, setLiveMessage] = useState('');
  const pageSize = 6;

  const loadBlogs = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchBlogs((nextPage - 1) * pageSize, pageSize);
      setBlogs(data);
      setPage(nextPage);
      setHasMore(data.length === pageSize);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    loadBlogs(1);
  }, [loadBlogs]);

  useEffect(() => {
    const socket = new WebSocket(getWsUrl());

    socket.onmessage = (event) => {
      setLiveMessage(event.data);
      loadBlogs(1);
    };

    socket.onerror = () => {
      setLiveMessage('');
    };

    return () => {
      socket.close();
    };
  }, [loadBlogs]);

  return (
    <div className="bloglist-page">
      <main className="container bloglist-main">
        {loading && <div className="spinner" />}
        {error && <div className="error-box">⚠ {error}</div>}
        {liveMessage && (
          <div className="error-box" style={{ background: '#eefdf3', color: '#166534' }}>
            🔔 {liveMessage}
          </div>
        )}

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

        {!loading && !error && blogs.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              className="pagination-btn"
              onClick={() => loadBlogs(page - 1)}
              disabled={page === 1 || loading}
            >
              ← Previous
            </button>
            <span className="pagination-page">Page {page}</span>
            <button
              type="button"
              className="pagination-btn"
              onClick={() => loadBlogs(page + 1)}
              disabled={!hasMore || loading}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
