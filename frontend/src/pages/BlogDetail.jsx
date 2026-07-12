import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deleteBlog, fetchBlogById, isAuthenticated } from '../api';
import './BlogDetail.css';

function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function loadBlog() {
      try {
        const data = await fetchBlogById(id);
        setBlog(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteBlog(id);
      navigate('/', { state: { deleted: true } });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading) return <div className="detail-loading"><div className="spinner" /></div>;
  if (error) return (
    <div className="detail-error container">
      <div className="error-box">⚠ {error}</div>
      <Link to="/" className="btn-secondary">← Back to Home</Link>
    </div>
  );

  return (
    <div className="detail-page fade-up">
      <div className="container detail-container">
        {/* Back */}
        <Link to="/" className="back-link">← Back to all posts</Link>

        {/* Article */}
        <article className="article">
          <header className="article-header">
            <div className="article-meta">
              <span className="meta-badge">{readingTime(blog.content)} min read</span>
              <span className="meta-date">{formatDate(blog.created_at)}</span>
            </div>
            <h1 className="article-title">{blog.title}</h1>
          </header>

          <div className="article-divider" />

          <div className="article-body">
            {blog.content.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>
          <div><p> by - {blog.author.email}</p></div>
        </article>

        {/* Actions */}
        {isAuthenticated() ? (
          <div className="article-actions">
            <Link to={`/edit/${blog.id}`} className="btn-edit">
              ✏ Edit Post
            </Link>
            <button
              className="btn-delete"
              onClick={() => setShowConfirm(true)}
            >
              🗑 Delete Post
            </button>
          </div>
        ) : (
          <div className="article-actions">
            <Link to="/login" className="btn-edit">
              🔐 Login to edit or delete
            </Link>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirm && (
          <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Delete this post?</h3>
              <p>This action cannot be undone. The post will be permanently removed.</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="btn-confirm-delete"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
