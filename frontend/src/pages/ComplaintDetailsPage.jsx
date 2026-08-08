import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../context/AuthContext';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const load = async () => {
    try {
      const res = await authApi.get(`/complaints/${id}`);
      setComplaint(res.data);
      const msgRes = await authApi.get(`/messages/${id}`);
      setMessages(msgRes.data);
    } catch (error) {
      toast.error('Unable to load complaint');
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await authApi.post('/messages', { complaint: id, text });
      setText('');
      load();
    } catch (error) {
      toast.error('Could not send message');
    }
  };

  if (!complaint) return <div>Loading...</div>;

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3>{complaint.title}</h3>
            <p className="text-muted">{complaint.category} • {complaint.priority}</p>
            <p>{complaint.description}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
            {complaint.resolution && <p><strong>Resolution:</strong> {complaint.resolution}</p>}
          </div>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Messages</h5>
            <ul className="list-group mb-3">
              {messages.map((msg) => (
                <li key={msg._id} className="list-group-item">
                  <div className="fw-bold">{msg.sender?.name || 'User'}</div>
                  <div>{msg.text}</div>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSend}>
              <textarea className="form-control mb-2" rows="3" value={text} onChange={(e) => setText(e.target.value)} required />
              <button className="btn btn-primary" type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
