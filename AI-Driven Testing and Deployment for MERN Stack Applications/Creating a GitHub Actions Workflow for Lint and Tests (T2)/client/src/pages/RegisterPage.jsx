import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { register } from '../api/auth.js';
import { CheckSquare, User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
      await register(name, email, password);
      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully! Please log in to continue.' },
      });
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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Get started with your personal task workspace</p>
        </div>

        {error && (
          <div role="alert" className="auth-error-banner">
            <p>{error.message || 'Could not register account'}</p>
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
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">
              Full Name
            </label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="name-input"
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={50}
                className="form-input has-icon"
              />
            </div>
          </div>

          {/* Email */}
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
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input has-icon"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>{' '}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
