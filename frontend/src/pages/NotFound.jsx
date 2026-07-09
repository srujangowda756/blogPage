
import './NotFound.css'

function NotFound() {
  return (
    <div className="main-div">
      <div className="emoji">🌌</div>
      <h2 className="small-heading">Page not found</h2>
      <p className="para">The page you're looking for doesn't exist.</p>
      <a href="/" className="link">Go Home </a>
    </div>
  );
}

export default NotFound;