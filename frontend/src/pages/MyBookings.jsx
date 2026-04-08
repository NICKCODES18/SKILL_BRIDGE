import React, { useState, useEffect } from 'react';
import { bookingApi } from '../api/bookingApi';
import { reviewApi } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import './MyBookings.css';

const statusBadge = (status) => {
  const map = { PENDING: 'badge-warning', CONFIRMED: 'badge-primary', COMPLETED: 'badge-success', CANCELLED: 'badge-danger' };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
};

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const data = await bookingApi.getMy(p);
      setBookings(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await bookingApi.updateStatus(id, 'CANCELLED');
    load(page);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await reviewApi.create({ bookingId: reviewModal, ...reviewForm });
      setReviewModal(null);
      load(page);
    } catch (err) {
      setReviewError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">Services you've booked</p>
          </div>
        </div>

        {loading ? <div className="loading-spinner" /> : bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>Browse services and book one to get started</p>
          </div>
        ) : (
          <>
            <div className="bookings-list">
              {bookings.map(b => (
                <div key={b.id} className="booking-item card">
                  <div className="booking-item-header">
                    <div>
                      <h3 className="booking-service-title">{b.serviceTitle}</h3>
                      <p className="booking-provider">by {b.providerName}</p>
                    </div>
                    <div className="booking-item-right">
                      <span className="booking-price">${b.servicePrice}</span>
                      {statusBadge(b.status)}
                    </div>
                  </div>
                  {b.message && <p className="booking-message">"{b.message}"</p>}
                  <div className="booking-actions">
                    <span className="booking-date">{new Date(b.bookedAt).toLocaleDateString()}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {b.status === 'PENDING' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancel</button>
                      )}
                      {b.status === 'COMPLETED' && !b.hasReview && (
                        <button className="btn btn-primary btn-sm" onClick={() => setReviewModal(b.id)}>Leave Review</button>
                      )}
                      {b.status === 'COMPLETED' && b.hasReview && (
                        <span className="badge badge-success">✓ Reviewed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={load} />
          </>
        )}

        {/* Review Modal */}
        {reviewModal && (
          <div className="modal-overlay" onClick={() => setReviewModal(null)}>
            <div className="modal-card card" onClick={e => e.stopPropagation()}>
              <h3>Leave a Review</h3>
              {reviewError && <div className="alert alert-error">{reviewError}</div>}
              <form onSubmit={handleReview}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="star-picker">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button"
                        className={`star-btn ${n <= reviewForm.rating ? 'active' : ''}`}
                        onClick={() => setReviewForm(p => ({ ...p, rating: n }))}>★</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea className="form-textarea" value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    placeholder="Share your experience..." rows={3} />
                </div>
                <div className="form-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setReviewModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
