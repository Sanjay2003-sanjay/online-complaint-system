import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../context/AuthContext';

const DashboardPage = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    authApi.get('/complaints').then(res => setComplaints(res.data.complaints || [])).catch(() => {});
  }, []);

  const pending = complaints.filter((item) => item.status === 'Pending').length;
  const resolved = complaints.filter((item) => item.status === 'Resolved' || item.status === 'Closed').length;

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card stat-card shadow-sm advanced-card">
            <div className="card-body">
              <p className="stat-label">Open tickets</p>
              <h3 className="display-6">{pending}</h3>
              <small className="text-muted">Waiting for attention</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card shadow-sm advanced-card">
            <div className="card-body">
              <p className="stat-label">Resolved</p>
              <h3 className="display-6">{resolved}</h3>
              <small className="text-muted">Successfully completed</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card shadow-sm advanced-card">
            <div className="card-body">
              <p className="stat-label">Total</p>
              <h3 className="display-6">{complaints.length}</h3>
              <small className="text-muted">All submitted complaints</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card panel-card shadow-sm advanced-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Recent activity</h5>
            <Link className="btn btn-primary btn-sm" to="/complaints">Create new</Link>
          </div>
          <ul className="list-group">
            {complaints.slice(0, 6).map((item) => (
              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{item.title}</div>
                  <small className="text-muted">{item.category}</small>
                </div>
                <span className="badge badge-soft">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
