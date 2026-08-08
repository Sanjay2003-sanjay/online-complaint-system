import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authApi } from '../context/AuthContext';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', password: '' });

  const load = async () => {
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        authApi.get('/admin/users'),
        authApi.get('/admin/analytics')
      ]);
      setUsers(usersRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      toast.error('Could not load admin data');
    }
  };

  useEffect(() => { load(); }, []);

  const createAgent = async (e) => {
    e.preventDefault();
    try {
      await authApi.post('/admin/agents', agentForm);
      toast.success('Agent created');
      setAgentForm({ name: '', email: '', password: '' });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create agent');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Admin dashboard</h2>
      {analytics && (
        <div className="row g-3 mb-4">
          <div className="col-md-3"><div className="card stat-card shadow-sm p-3"><h6>Total complaints</h6><p className="display-6">{analytics.totalComplaints}</p></div></div>
          <div className="col-md-3"><div className="card stat-card shadow-sm p-3"><h6>Pending</h6><p className="display-6">{analytics.pending}</p></div></div>
          <div className="col-md-3"><div className="card stat-card shadow-sm p-3"><h6>Resolved</h6><p className="display-6">{analytics.resolved}</p></div></div>
          <div className="col-md-3"><div className="card stat-card shadow-sm p-3"><h6>Avg rating</h6><p className="display-6">{analytics.avgRating}</p></div></div>
        </div>
      )}
      <div className="card panel-card shadow-sm mb-4">
        <div className="card-body">
          <h4>Create agent</h4>
          <form className="row g-3" onSubmit={createAgent}>
            <div className="col-md-4"><input className="form-control" placeholder="Name" value={agentForm.name} onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })} required /></div>
            <div className="col-md-4"><input className="form-control" type="email" placeholder="Email" value={agentForm.email} onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })} required /></div>
            <div className="col-md-4"><input className="form-control" type="password" placeholder="Password" value={agentForm.password} onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })} required /></div>
            <div className="col-12"><button className="btn btn-primary" type="submit">Create agent</button></div>
          </form>
        </div>
      </div>
      <div className="card panel-card shadow-sm">
        <div className="card-body">
          <h4>Users</h4>
          <ul className="list-group">
            {users.map((user) => (
              <li key={user._id} className="list-group-item d-flex justify-content-between">
                <span>{user.name} ({user.email})</span>
                <span className="badge bg-secondary">{user.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
