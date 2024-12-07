import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';
import { authApi } from '../../api/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.post('/login', { email, password });
      alert.success('Login successful!');
      navigate('/home');
    } catch (error) {
      alert.error(error.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
