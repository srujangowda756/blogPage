import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './BlogForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({ title: false, content: false });

  useEffect(() => {
    if (!isEdit) return;
    async function fetchBlog() {
      try {
        const res = await fetch(`${API_URL}/blogs/${id}`);
        if (!res.ok) throw new Error('Blog not found');
        const data = await res.json();
        const blog = Array.isArray(data) ? data[0] : data;
        setTitle(blog.title);
        setContent(blog.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true, content: true });
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const url = isEdit ? `${API_URL}/blogs/${id}` : `${API_URL}/blogs/`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      if (!res.ok) throw new Error(isEdit ? 'Failed to update' : 'Failed to create');

      setSuccess(isEdit ? 'Post updated successfully!' : 'Post published successfully!');
      setTimeout(() => {
        navigate(isEdit ? `/blogs/${id}` : '/');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="form-loading"><div className="spinner" /></div>;

  return (
    <div className="form-page fade-up">
      <div className="container form-container">
        <Link to={isEdit ? `/blogs/${id}` : '/'} className="back-link">
          ← {isEdit ? 'Back to post' : 'Back to home'}
        </Link>

        <div className="form-header">
          <h1 className="form-title">
            {isEdit ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="form-subtitle">
            {isEdit
              ? 'Update your post content below.'
              : 'Share your thoughts, ideas, and stories with the world.'}
          </p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}
        {success && <div className="alert alert-success">✔ {success}</div>}

        <form className="blog-form" onSubmit={handleSubmit} noValidate>
          <div className={`field ${touched.title && !title.trim() ? 'field-error' : ''}`}>
            <label className="field-label" htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              className="field-input"
              placeholder="Enter a compelling title…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, title: true }))}
              maxLength={120}
            />
            <div className="field-footer">
              {touched.title && !title.trim() && (
                <span className="field-hint error">Title is required</span>
              )}
              <span className="field-count">{title.length}/120</span>
            </div>
          </div>

          <div className={`field ${touched.content && !content.trim() ? 'field-error' : ''}`}>
            <label className="field-label" htmlFor="content">Content</label>
            <textarea
              id="content"
              className="field-textarea"
              placeholder="Write your post content here… Share your story, ideas, or knowledge."
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, content: true }))}
              rows={14}
            />
            {touched.content && !content.trim() && (
              <span className="field-hint error">Content is required</span>
            )}
          </div>

          <div className="form-actions">
            <Link to={isEdit ? `/blogs/${id}` : '/'} className="btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting
                ? (isEdit ? 'Saving…' : 'Publishing…')
                : (isEdit ? 'Save Changes' : 'Publish Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
