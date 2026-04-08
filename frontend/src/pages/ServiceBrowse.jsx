import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceApi } from '../api/serviceApi';
import ServiceCard from '../components/ServiceCard';
import Pagination from '../components/Pagination';
import './ServiceBrowse.css';

export default function ServiceBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    page: 0,
    size: 9,
  });

  useEffect(() => { serviceApi.getCategories().then(setCategories).catch(() => {}); }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.search) delete params.search;
      if (!params.categoryId) delete params.categoryId;
      if (!params.minPrice) delete params.minPrice;
      if (!params.maxPrice) delete params.maxPrice;

      const data = await serviceApi.getAll(params);
      setServices(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleFilterChange = (key, value) => {
    setFilters(p => ({ ...p, [key]: value, page: 0 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  return (
    <div className="page browse-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Browse Services</h1>
            <p className="page-subtitle">{totalElements} services available</p>
          </div>
        </div>

        {/* Filters */}
        <div className="browse-filters card">
          <form onSubmit={handleSearch} className="filters-row">
            <input
              id="browse-search"
              type="text"
              className="form-input"
              placeholder="Search services..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
            <select
              id="browse-category"
              className="form-select filter-select"
              value={filters.categoryId}
              onChange={e => handleFilterChange('categoryId', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-input filter-price"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={e => handleFilterChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              className="form-input filter-price"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={e => handleFilterChange('maxPrice', e.target.value)}
            />
            <select
              className="form-select filter-select"
              value={filters.sortBy}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price ↑</option>
            </select>
            <button id="browse-search-btn" type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-spinner" />
        ) : services.length === 0 ? (
          <div className="empty-state">
            <h3>No services found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid-3">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
            <Pagination
              page={filters.page}
              totalPages={totalPages}
              onPageChange={p => setFilters(prev => ({ ...prev, page: p }))}
            />
          </>
        )}
      </div>
    </div>
  );
}
