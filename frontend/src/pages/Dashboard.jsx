import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../api/serviceApi';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import Pagination from '../components/Pagination';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [myServices, setMyServices] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [servicesPage, setServicesPage] = useState(0);
  const [servicesTotalPages, setServicesTotalPages] = useState(0);
  const [bookingsPage, setBookingsPage] = useState(0);
  const [bookingsTotalPages, setBookingsTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('services');

  const loadServices = async (page = 0) => {
    const data = await serviceApi.getMy(page);
    setMyServices(data.content || []);
    setServicesTotalPages(data.totalPages || 0);
    setServicesPage(page);
  };

  const loadBookings = async (page = 0) => {
    const data = await bookingApi.getReceived(page);
    setReceivedBookings(data.content || []);
    setBookingsTotalPages(data.totalPages || 0);
    setBookingsPage(page);
  };

  useEffect(() => {
    Promise.all([loadServices(), loadBookings()]).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await serviceApi.delete(id);
    loadServices(servicesPage);
  };

  const handleStatusChange = async (bookingId, status) => {
    await bookingApi.updateStatus(bookingId, status);
    loadBookings(bookingsPage);
  };

  const statusBadge = (status) => {
    const map = { PENDING: 'badge-warning', CONFIRMED: 'badge-primary', COMPLETED: 'badge-success', CANCELLED: 'badge-danger' };
    return <span className={`badge ${map[status] || 'badge-primary'}`}>{status}</span>;
  };

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Welcome, {user?.name} 👋</h1>
            <p className="page-subtitle">Manage your services and incoming bookings</p>
          </div>
          <Link to="/services/new" className="btn btn-primary">+ New Service</Link>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button className={`dash-tab ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
            My Services ({myServices.length})
          </button>
          <button className={`dash-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
            Received Bookings ({receivedBookings.length})
          </button>
        </div>

        {tab === 'services' && (
          <>
            {myServices.length === 0 ? (
              <div className="empty-state">
                <h3>No services yet</h3>
                <p>Create your first service listing to start getting clients</p>
                <Link to="/services/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Service</Link>
              </div>
            ) : (
              <>
                <div className="grid-3">
                  {myServices.map(s => (
                    <div key={s.id} className="service-card-wrapper">
                      <ServiceCard service={s} />
                      <div className="service-actions">
                        <Link to={`/services/${s.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination page={servicesPage} totalPages={servicesTotalPages} onPageChange={loadServices} />
              </>
            )}
          </>
        )}

        {tab === 'bookings' && (
          <>
            {receivedBookings.length === 0 ? (
              <div className="empty-state">
                <h3>No bookings received yet</h3>
                <p>Once clients book your services, they'll appear here</p>
              </div>
            ) : (
              <>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Client</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedBookings.map(b => (
                        <tr key={b.id}>
                          <td>{b.serviceTitle}</td>
                          <td>{b.clientName}</td>
                          <td style={{ maxWidth: 200, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {b.message || '—'}
                          </td>
                          <td>{statusBadge(b.status)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {b.status === 'PENDING' && (
                                <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(b.id, 'CONFIRMED')}>Confirm</button>
                              )}
                              {b.status === 'CONFIRMED' && (
                                <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(b.id, 'COMPLETED')}>Complete</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={bookingsPage} totalPages={bookingsTotalPages} onPageChange={loadBookings} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
