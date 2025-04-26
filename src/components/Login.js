import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
    if (id === 'name') setName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'https://ceda-auth.vercel.app/auth/login'
      : 'https://ceda-auth.vercel.app/auth/signup';

    const data = isLogin
      ? { email, password }
      : { email, password, name };

    try {
      const response = await axios.post(url, data);

      if (response.data.success) {
        Cookies.set('token', response.data.jwtToken, { expires: 1 });
        Cookies.set('name', response.data.name, { expires: 1 });
        toast.success(`${isLogin ? 'Login' : 'Signup'} successful! Redirecting...`);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <ToastContainer />
      <div className="relative p-8 w-full max-w-md mx-auto bg-white bg-opacity-20 rounded-xl shadow-lg backdrop-blur-lg">
        <h2 className="text-4xl font-bold text-center text-white mb-6">
          {isLogin ? 'Login' : 'Signup'}
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-white hover:text-gray-800 focus:outline-none"
          >
            {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-white text-sm mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
