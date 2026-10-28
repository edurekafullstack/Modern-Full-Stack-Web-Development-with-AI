import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { login } from '../api/auth.js';
import { useAuth } from '../context/useAuth.js';
import { CheckSquare, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user) {
        setUser(user);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err);
      setPending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="brand-icon-wrapper large">
            <CheckSquare size={26} className="brand-icon" />
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your TaskFlow workspace</p>
        </div>

        {location.state?.message && (
          <div className="auth-notice" role="status">
            {location.state.message}
          </div>
        )}

        {error && (
          <div role="alert" className="auth-error-banner">
            <p>{error.message || 'Invalid email or password'}</p>
            {error.errors?.length > 0 && (
              <ul>
                {error.errors.map((fe, idx) => (
                  <li key={idx}>{fe.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email address
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="email-input"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input has-icon"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input has-icon has-toggle"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
            {pending ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>{' '}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
