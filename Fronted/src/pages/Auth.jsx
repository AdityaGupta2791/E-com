import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function Auth({ mode }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        const res = await api.post('/auth/signup', {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        const token = res?.data?.token;
        const user = res?.data?.user;
        if (token) {
          signIn(token, user);
          navigate('/');
          return;
        }
      } else {
        const res = await api.post('/auth/signin', {
          email: form.email,
          password: form.password,
        });
        const token = res?.data?.token;
        const user = res?.data?.user;
        if (token) {
          signIn(token, user);
          navigate('/');
          return;
        }
      }
      setError('Auth failed. Please try again.');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-slate-600">
          {isSignup
            ? 'Create a new account to start shopping.'
            : 'Log in to continue your shopping.'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {isSignup ? (
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Your name"
              required
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2"
            type="email"
            placeholder="you@email.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2"
            type="password"
            placeholder="••••••••"
            required
          />
        </label>
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link
          to={isSignup ? '/login' : '/signup'}
          className="font-medium text-slate-900 underline"
        >
          {isSignup ? 'Login' : 'Sign up'}
        </Link>
      </p>
    </section>
  );
}

export default Auth;
