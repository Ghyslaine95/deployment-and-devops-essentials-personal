import React, { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { connect, error } = useSocketContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (username.trim().length < 2) {
      return;
    }

    setLoading(true);
    connect(username.trim());
    // Note: The context will handle the loading state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Socket.io Chat
          </h1>
          <p className="text-gray-600">
            Join the conversation in real-time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Choose a username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={20}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Username must be 2-20 characters long
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={username.trim().length < 2}
            className="w-full"
          >
            Join Chat
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Features</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Real-time messaging
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Multiple chat rooms
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Private messaging
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Typing indicators
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};