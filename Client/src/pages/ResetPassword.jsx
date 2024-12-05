import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../redux/apiSlice';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token) {
      // Handle password reset
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      try {
        const res = await resetPassword({ token, password }).unwrap();
        if (res.success) {
          toast.success('Password reset successful');
          navigate('/login');
        }
      } catch (err) {
        toast.error(err?.data?.error || 'Failed to reset password');
      }
    } else {
      // Handle forgot password request
      if (!email) {
        toast.error('Please enter your email');
        return;
      }

      try {
        const res = await forgotPassword({ email }).unwrap();
        if (res.success) {
          toast.success('Reset instructions sent to your email');
          navigate('/login');
        }
      } catch (err) {
        toast.error(err?.data?.error || 'Failed to send reset instructions');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {token ? 'Reset your password' : 'Reset password request'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {token 
              ? 'Enter your new password'
              : 'Enter your email to receive reset instructions'
            }
          </p>
        </motion.div>

        <motion.form
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {token ? (
            // Password reset form
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          ) : (
            // Email form for reset request
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isResetting || isSending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {token
                ? (isResetting ? "Resetting..." : "Reset Password")
                : (isSending ? "Sending..." : "Send Reset Instructions")}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
