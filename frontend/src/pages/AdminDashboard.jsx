import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import Pagination from '../components/Pagination';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [tab, setTab] = useState('stats');
  const [usersPage, setUsersPage] = useState(0);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [servicesPage, setServicesPage] = useState(0);
  const [servicesTotalPages, setServicesTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const loadUsers = async (page = 0) => {
    const data = await adminApi.getUsers(page);
    setUsers(data.content || []);
    setUsersTotalPages(data.totalPages || 0);
    setUsersPage(page);
  };

  const loadServices = async (page = 0) => {
    const data = await adminApi.getServices(page);
    setServices(data.content || []);
    setServicesTotalPages(data.totalPages || 0);
    setServicesPage(page);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (newTab === 'users' && users.length === 0) loadUsers();
    if (newTab === 'services' && services.length === 0) loadServices();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await adminApi.deleteUser(id);
    loadUsers(usersPage);
  };

  const handleToggleService = async (id) => {
    await adminApi.toggleService(id);
    loadServices(servicesPage);
  };

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">🛡️ Admin Dashboard</h1>
            <p className="page-subtitle">Platform management</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          {['stats','users','services'].map(t => (
            <button key={t} className={`dash-tab ${tab === t ? 'active' : ''}`} onClick={() => handleTabChange(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === 'stats' && stats && (
          <div className="admin-stats-grid">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Total Services', value: stats.totalServices, icon: '🛠️' },
              { label: 'Active Services', value: stats.activeServices, icon: '✅' },
              { label: 'Total Bookings', value: stats.totalBookings, icon: '📋' },
              { label: 'Pending Bookings', value: stats.pendingBookings, icon: '⏳' },
              { label: 'Completed', value: stats.completedBookings, icon: '🎉' },
              { label: 'Total Reviews', value: stats.totalReviews, icon: '⭐' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-warning' : 'badge-primary'}`}>{u.role}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u.role !== 'ADMIN' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={usersPage} totalPages={usersTotalPages} onPageChange={loadUsers} />
          </>
        )}

        {/* Services */}
        {tab === 'services' && (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th><th>Provider</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td style={{ maxWidth: 200 }}>{s.title}</td>
                      <td>{s.providerName}</td>
                      <td>{s.categoryName}</td>
                      <td>${s.price}</td>
                      <td>
                        <span className={`badge ${s.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${s.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => handleToggleService(s.id)}
                        >
                          {s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={servicesPage} totalPages={servicesTotalPages} onPageChange={loadServices} />
          </>
        )}
      </div>
    </div>
  );
}
