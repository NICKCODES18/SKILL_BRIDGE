import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceApi } from '../api/serviceApi';
import './ServiceForm.css';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', deliveryDays: '', categoryId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    Promise.all([serviceApi.getCategories(), serviceApi.getById(id)])
      .then(([cats, svc]) => {
        setCategories(cats);
        setForm({ title: svc.title, description: svc.description, price: svc.price, deliveryDays: svc.deliveryDays, categoryId: svc.categoryId });
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setFetchLoading(false));
  }, [id]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await serviceApi.update(id, {
        ...form,
        price: parseFloat(form.price),
        deliveryDays: parseInt(form.deliveryDays),
        categoryId: parseInt(form.categoryId),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading-spinner" />;

  return (
    <div className="page">
      <div className="container form-page">
        <div className="page-header">
          <h1 className="page-title">Edit Service</h1>
        </div>
        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Service Title</label>
              <input name="title" className="form-input" value={form.title} onChange={handleChange} required minLength={5} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} required minLength={20} rows={6} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input name="price" type="number" step="0.01" min="0.01" className="form-input" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Days</label>
                <input name="deliveryDays" type="number" min="1" className="form-input" value={form.deliveryDays} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange} required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
