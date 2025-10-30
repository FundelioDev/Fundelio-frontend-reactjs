import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';
import {
  PasswordStrengthIndicator,
  usePasswordValidation,
} from '../components/auth/PasswordStrengthIndicator';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Sử dụng hook validation mật khẩu
  const passwordValidation = usePasswordValidation(formData.password);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    } else {
      // TODO: Validate token with API
      console.log('Validating token:', token);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu mới';
    } else if (!passwordValidation.minLength) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (
      !passwordValidation.hasUpperCase ||
      !passwordValidation.hasLowerCase
    ) {
      newErrors.password = 'Mật khẩu phải có chữ hoa và chữ thường';
    } else if (!passwordValidation.hasNumbers) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 số';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // TODO: Implement actual reset password API call
      console.log('Reset password with token:', token, formData.password);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    }, 1500);
  };

  if (!tokenValid) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center space-y-4'
        >
          <div className='w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto'>
            <AlertCircle className='w-8 h-8 text-red-600 dark:text-red-400' />
          </div>
          <h2 className='text-2xl font-bold text-foreground'>
            Liên kết không hợp lệ
          </h2>
          <p className='text-muted-foreground'>
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </p>
          <Link to='/auth'>
            <Button variant='primary' className='w-full mt-6'>
              Quay lại đăng nhập
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center space-y-4'
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
          >
            <div className='w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto'>
              <CheckCircle2 className='w-10 h-10 text-green-600 dark:text-green-400' />
            </div>
          </motion.div>
          <h2 className='text-2xl font-bold text-foreground'>
            Đặt lại mật khẩu thành công!
          </h2>
          <p className='text-muted-foreground'>
            Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển đến trang đăng
            nhập...
          </p>
          <Link to='/auth'>
            <Button variant='primary' className='w-full mt-6'>
              Đăng nhập ngay
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950'>
      {/* Left Side - Branding */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        {/* Animated Background Gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.3),transparent_50%)]' />
        </div>

        {/* Animated Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0 animate-[pulse_8s_ease-in-out_infinite]'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className='absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]' />
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-secondary-300/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse]' />

        {/* Content */}
        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white'>
          <Link to='/' className='mb-12 group'>
            <h1 className='text-5xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300'>
              Fundelio
            </h1>
          </Link>

          <div className='space-y-6'>
            <h2 className='text-5xl xl:text-6xl font-bold leading-tight'>
              Đặt lại
              <br />
              mật khẩu
            </h2>
            <p className='text-xl text-white/80 leading-relaxed max-w-md'>
              Tạo mật khẩu mới mạnh mẽ để bảo vệ tài khoản của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12'>
        <div className='w-full max-w-lg xl:max-w-xl'>
          {/* Mobile Logo */}
          <Link to='/' className='lg:hidden block mb-8 text-center'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent'>
              Fundelio
            </h1>
          </Link>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/5 p-8 sm:p-12 border border-gray-100 dark:border-gray-700'
          >
            {/* Form Header */}
            <div className='mb-8 text-center'>
              <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-3'>
                Đặt lại mật khẩu
              </h2>
              <p className='text-muted-foreground text-base'>
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Password Input */}
              <div className='group'>
                <label
                  htmlFor='password'
                  className='block text-sm lg:text-base font-semibold text-foreground mb-3'
                >
                  Mật khẩu mới
                </label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='••••••••'
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-xl text-base bg-gray-50 dark:bg-gray-900 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 ${
                      errors.password
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className='mt-2 text-sm text-red-500 flex items-center gap-1'>
                    <span className='inline-block w-1 h-1 bg-red-500 rounded-full'></span>
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Indicator Component */}
                <div className='mt-3'>
                  <PasswordStrengthIndicator
                    password={formData.password}
                    showRequirements={true}
                    showStrengthBar={true}
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className='group'>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm lg:text-base font-semibold text-foreground mb-3'
                >
                  Xác nhận mật khẩu
                </label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors' />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='••••••••'
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-xl text-base bg-gray-50 dark:bg-gray-900 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 ${
                      errors.confirmPassword
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='mt-2 text-sm text-red-500 flex items-center gap-1'>
                    <span className='inline-block w-1 h-1 bg-red-500 rounded-full'></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                variant='primary'
                size='lg'
                className='w-full mt-8 !py-4 !text-base !rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-200'
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </Button>
            </form>

            {/* Footer */}
            <div className='mt-8 text-center'>
              <p className='text-muted-foreground text-sm'>
                Nhớ mật khẩu?{' '}
                <Link
                  to='/auth'
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold transition-all hover:underline underline-offset-2'
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
