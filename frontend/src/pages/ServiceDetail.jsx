import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceApi } from '../api/serviceApi';
import { reviewApi } from '../api/reviewApi';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import './ServiceDetail.css';

const Stars = ({ rating }) => {
  if (!rating) return <span className="text-muted">No ratings yet</span>;
  return <span className="stars">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))} {rating.toFixed(1)}</span>;
};

export default function ServiceDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState({ page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookError, setBookError] = useState('');
  const [bookLoading, setBookLoading] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [svc, rev] = await Promise.all([
          serviceApi.getById(id),
          reviewApi.getByService(id),
        ]);
        setService(svc);
        setReviews(rev.content || []);
        setReviewPage({ page: rev.number || 0, totalPages: rev.totalPages || 0 });
      } catch {
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const loadReviews = async (page) => {
    const rev = await reviewApi.getByService(id, page);
    setReviews(rev.content || []);
    setReviewPage({ page: rev.number || 0, totalPages: rev.totalPages || 0 });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setBookError(''); setBookLoading(true);
    try {
      await bookingApi.create({ serviceId: Number(id), message: bookingMsg });
      setBookSuccess(true);
    } catch (err) {
      setBookError(err.message);
    } finally {
      setBookLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner" />;
  if (!service) return null;

  const isOwner = user?.userId === service.providerId;

  return (
    <div className="page">
      <div className="container detail-layout">
        {/* Main */}
        <div className="detail-main">
          <div className="detail-meta">
            <span className="badge badge-primary">{service.categoryName}</span>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>🕐 {service.deliveryDays} day delivery</span>
          </div>
          <h1 className="detail-title">{service.title}</h1>

          <div className="detail-provider">
            <div className="provider-avatar provider-avatar-lg">{service.providerName?.[0]?.toUpperCase()}</div>
            <div>
              <div className="provider-name">{service.providerName}</div>
              <div className="provider-bio">{service.providerBio || 'No bio provided'}</div>
            </div>
          </div>

          <div className="detail-rating">
            <Stars rating={service.averageRating} />
            {service.reviewCount > 0 && <span className="text-muted">({service.reviewCount} reviews)</span>}
          </div>

          <div className="detail-section">
            <h3>About this service</h3>
            <p className="detail-desc">{service.description}</p>
          </div>

          {/* Reviews */}
          <div className="detail-section">
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-muted">No reviews yet. Be the first!</p>
            ) : (
              <>
                {reviews.map(r => (
                  <div key={r.id} className="review-item">
                    <div className="review-header">
                      <div className="provider-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                        {r.reviewerName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="review-name">{r.reviewerName}</div>
                        <div className="stars" style={{ fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                    </div>
                    {r.comment && <p className="review-comment">{r.comment}</p>}
                  </div>
                ))}
                <Pagination page={reviewPage.page} totalPages={reviewPage.totalPages} onPageChange={loadReviews} />
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="booking-card card">
            <div className="booking-price">${service.price}</div>
            <div className="booking-info">
              <span>🕐 {service.deliveryDays} day delivery</span>
            </div>

            {isOwner ? (
              <div className="alert alert-success" style={{ textAlign: 'center' }}>This is your service</div>
            ) : bookSuccess ? (
              <div className="alert alert-success">✅ Booking request sent! Check your bookings.</div>
            ) : (
              <form onSubmit={handleBook}>
                {bookError && <div className="alert alert-error">{bookError}</div>}
                <div className="form-group">
                  <label className="form-label">Message (optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe your project..."
                    value={bookingMsg}
                    onChange={e => setBookingMsg(e.target.value)}
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={bookLoading}>
                  {!isAuthenticated ? 'Login to Book' : bookLoading ? 'Booking...' : 'Book Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
