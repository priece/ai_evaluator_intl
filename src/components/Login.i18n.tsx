'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface LoginProps {
  onLoginSuccess: (user: { id: string; username: string; role: string }) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const t = useTranslations('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || t('loginFailed'));
      }
    } catch (err) {
      setError(t('loginFailedRetry'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">{t('loginTitle')}</h1>
          <p className="text-gray-400 mt-2">{t('loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#252525] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-100 placeholder-gray-500"
              placeholder={t('usernamePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#252525] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-100 placeholder-gray-500"
              placeholder={t('passwordPlaceholder')}
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-300 px-4 py-3 rounded-lg text-sm border border-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('loginLoading') : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
}
