import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceApi } from '../api/serviceApi';
import './ServiceForm.css';

export default function CreateService() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', deliveryDays: '', categoryId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { serviceApi.getCategories().then(setCategories).catch(() => {}); }, []);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await serviceApi.create({
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

  return (
    <div className="page">
      <div className="container form-page">
        <div className="page-header">
          <h1 className="page-title">Create New Service</h1>
        </div>
        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Service Title</label>
              <input name="title" className="form-input" placeholder="e.g. I will build a React website" value={form.title} onChange={handleChange} required minLength={5} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-textarea" placeholder="Describe your service in detail..." value={form.description} onChange={handleChange} required minLength={20} rows={6} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input name="price" type="number" step="0.01" min="0.01" className="form-input" placeholder="50.00" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Days</label>
                <input name="deliveryDays" type="number" min="1" className="form-input" placeholder="7" value={form.deliveryDays} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange} required>
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
