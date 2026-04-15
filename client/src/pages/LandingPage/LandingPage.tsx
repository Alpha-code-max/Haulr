import { Link, Navigate } from "react-router-dom";
import { FiTruck, FiShield, FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import "./LandingPage.css";
import { useAuthStore } from "../../store/useAuthStore";

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Redirect if already logged in (as outlined in user goals)
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role === 'admin' ? 'vendor' : user.role}`} replace />;
  }

  return (
    <div className="landing-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Next-Gen Logistics</span>
          <h1 className="hero-title">
            The Escrow-Backed <br />
            <span className="text-gradient">Haulage Marketplace</span>
          </h1>
          <p className="hero-subtitle">
            Secure, transparent, and efficient delivery management for vendors and haulers across the nation. 
            Connect with verified partners and track every move with peace of mind.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid - No Boxes */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Haulr?</h2>
          <p>Built for trust and built for scale.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <FiShield className="feature-icon text-blue-500" />
            </div>
            <h3>Escrow Protection</h3>
            <p>Funds are held securely until the delivery is verified via OTP. No more payment disputes.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <FiTruck className="feature-icon text-green-500" />
            </div>
            <h3>Verified Haulers</h3>
            <p>Every driver undergoes rigorous KYC verification including NIN and vehicle documentation.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <FiMessageSquare className="feature-icon text-fuchsia-500" />
            </div>
            <h3>Real-time Chat</h3>
            <p>Direct communication channel between vendors and haulers for seamless coordination.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <FiTrendingUp className="feature-icon text-amber-500" />
            </div>
            <h3>Automated Workflows</h3>
            <p>From booking to delivery confirmation, everything is automated with smart OTP verification.</p>
          </div>
        </div>
      </section>

      {/* Footer-like section */}
      <section className="cta-banner">
        <h2>Ready to move your goods?</h2>
        <p>Join thousands of businesses streamlining their logistics today.</p>
        <Link to="/register" className="btn btn-primary btn-lg">Join Haulr for Free</Link>
      </section>
    </div>
  );
};

export default LandingPage;
