import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ServiceCard.css';

const renderStars = (rating) => {
  if (!rating) return null;
  const full = Math.floor(rating);
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
  return <span className="stars">{stars} <span className="rating-num">{rating.toFixed(1)}</span></span>;
};

export default function ServiceCard({ service }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="service-card card">
      <div className="service-card-header">
        <span className="badge badge-primary">{service.categoryName}</span>
        <span className="service-delivery">🕐 {service.deliveryDays}d delivery</span>
      </div>

      <h3 className="service-title">{service.title}</h3>
      <p className="service-desc">{service.description?.slice(0, 100)}...</p>

      <div className="service-provider">
        <div className="provider-avatar">{service.providerName?.[0]?.toUpperCase()}</div>
        <span>{service.providerName}</span>
      </div>

      <div className="service-footer">
        <div className="service-meta">
          {renderStars(service.averageRating)}
          {service.reviewCount > 0 && (
            <span className="review-count">({service.reviewCount})</span>
          )}
        </div>
        <div className="service-right">
          <span className="service-price">${service.price}</span>
          <Link to={`/services/${service.id}`} className="btn btn-primary btn-sm">View</Link>
        </div>
      </div>
    </div>
  );
}
