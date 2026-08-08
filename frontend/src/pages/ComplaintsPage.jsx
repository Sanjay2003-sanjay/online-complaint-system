import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../context/AuthContext';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium' });
  const [file, setFile] = useState(null);

  const load = async () => {
    try {
      const res = await authApi.get('/complaints');
      setComplaints(res.data.complaints || []);
    } catch (error) {
      toast.error('Could not load complaints');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (file) formData.append('attachment', file);
      await authApi.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Complaint submitted');
      setForm({ title: '', description: '', category: '', priority: 'Medium' });
      setFile(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card panel-card shadow-sm advanced-card">
          <div className="card-body">
            <h4 className="mb-3">New complaint</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Attachment</label>
                <input className="form-control" type="file" onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <button className="btn btn-primary w-100" type="submit">Submit complaint</button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card panel-card shadow-sm advanced-card">
          <div className="card-body">
            <h4 className="mb-3">Your complaints</h4>
            <ul className="list-group">
              {complaints.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <h6><Link to={`/complaints/${item._id}`}>{item.title}</Link></h6>
                    <div className="text-muted small">{item.category} • {item.priority}</div>
                  </div>
                  <span className="badge badge-soft">{item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
