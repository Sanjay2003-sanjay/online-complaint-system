import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg glass-nav">
      <div className="container">
        <NavLink className="navbar-brand" to="/">ComplaintFlow</NavLink>
        <div className="navbar-nav ms-auto align-items-center">
          <NavLink className="nav-link" to="/">Overview</NavLink>
          <NavLink className="nav-link" to="/complaints">Tickets</NavLink>
          <NavLink className="nav-link" to="/profile">Profile</NavLink>
          {user.role === 'admin' && <NavLink className="nav-link" to="/admin">Admin</NavLink>}
          <div className="nav-user-pill">{user.role}</div>
          <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
