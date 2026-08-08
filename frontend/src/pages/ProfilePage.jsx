import { useState } from 'react';
import { toast } from 'react-toastify';
import { authApi, useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.put('/auth/profile', form);
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Profile update failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card panel-card shadow-sm">
          <div className="card-body">
            <p className="eyebrow">Your profile</p>
            <h3>Personal details</h3>
            <p className="text-muted">{user?.email}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Password</label><input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <button className="btn btn-primary" type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
