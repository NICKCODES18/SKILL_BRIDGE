import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const features = [
  { icon: '🎯', title: 'Post Your Skills', desc: 'Create service listings in minutes and start getting clients.' },
  { icon: '🔍', title: 'Find Experts', desc: 'Browse thousands of verified services across 8+ categories.' },
  { icon: '🤝', title: 'Collaborate', desc: 'Book, communicate, and get work done seamlessly.' },
  { icon: '⭐', title: 'Leave Reviews', desc: 'Build trust with verified reviews after project completion.' },
];

const categories = [
  { name: 'Web Development', icon: '💻' },
  { name: 'Mobile Apps', icon: '📱' },
  { name: 'Graphic Design', icon: '🎨' },
  { name: 'Content Writing', icon: '✍️' },
  { name: 'Digital Marketing', icon: '📈' },
  { name: 'Video Editing', icon: '🎬' },
  { name: 'Data Science', icon: '📊' },
  { name: 'Cybersecurity', icon: '🔒' },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">🚀 The #1 Skill Marketplace</div>
          <h1 className="hero-title">
            Connect. Create.<br />
            <span className="gradient-text">Succeed Together.</span>
          </h1>
          <p className="hero-subtitle">
            SkillBridge connects talented freelancers with clients who need their skills.
            Post your services, get discovered, and grow your freelance career.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary btn-lg">Browse Services</Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-outline btn-lg">Start Selling →</Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>8+</strong><span>Categories</span></div>
            <div className="hero-stat"><strong>100%</strong><span>Verified Reviews</span></div>
            <div className="hero-stat"><strong>JWT</strong><span>Secured</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <p className="text-muted">Find the perfect service for your needs</p>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/services?search=${encodeURIComponent(cat.name)}`}
              className="category-chip"
            >
              <span className="cat-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Why SkillBridge?</h2>
            <p className="text-muted">Everything you need to freelance professionally</p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="section container cta-section">
          <div className="cta-card">
            <h2>Ready to get started?</h2>
            <p>Join thousands of freelancers and clients on SkillBridge today.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          </div>
        </section>
      )}
    </div>
  );
}
