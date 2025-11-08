import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import {
  PasswordStrengthIndicator,
  usePasswordValidation,
} from './PasswordStrengthIndicator';
import { VerifyEmailDialog } from './VerifyEmailDialog';
import { AuthErrorDialog } from './AuthErrorDialog';
import { authApi } from '@/api/authApi';

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerifyEmailDialog, setShowVerifyEmailDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  const [registerData, setRegisterData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  // Sử dụng hook validation mật khẩu
  const passwordValidation = usePasswordValidation(registerData.password);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate các trường bắt buộc
    if (!registerData.firstName) {
      setErrors((prev) => ({ ...prev, firstName: 'Vui lòng nhập họ' }));
      return;
    }
    if (!registerData.lastName) {
      setErrors((prev) => ({ ...prev, lastName: 'Vui lòng nhập tên' }));
      return;
    }
    if (!registerData.email) {
      setErrors((prev) => ({ ...prev, email: 'Vui lòng nhập email' }));
      return;
    }
    if (!registerData.phoneNumber) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: 'Vui lòng nhập số điện thoại',
      }));
      return;
    }

    // Validate mật khẩu
    if (!passwordValidation.isValid) {
      setErrors({
        password: 'Mật khẩu phải có ít nhất 8 ký tự, chữ hoa, chữ thường và số',
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrors({
        confirmPassword: 'Mật khẩu xác nhận không khớp',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Tạo payload theo schema RegisterPayload
      const payload = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phoneNumber: registerData.phoneNumber,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
      };

      const response = await authApi.register(payload);

      if (response && response.data) {
        // Đăng ký thành công, hiển thị dialog xác nhận email
        setShowVerifyEmailDialog(true);
      }
    } catch (error) {
      console.error('Register error:', error);
      const backendErrors = error?.errors;
      const fallbackMessage =
        error?.response?.data?.message ||
        (Array.isArray(backendErrors) && backendErrors[0]?.message) ||
        'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const combinedMessage = backendErrors
          .map((e) => e?.message)
          .filter(Boolean)
          .join('\n');
        const finalMsg = combinedMessage || fallbackMessage;
        setErrors({ general: finalMsg });
        setErrorDialogMessage(finalMsg);
        setShowErrorDialog(true);
      } else {
        setErrors({ general: fallbackMessage });
        setErrorDialogMessage(fallbackMessage);
        setShowErrorDialog(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'firstName', label: 'Họ', type: 'text', placeholder: 'Họ' },
    { name: 'lastName', label: 'Tên', type: 'text', placeholder: 'Tên' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
    {
      name: 'phoneNumber',
      label: 'Số điện thoại',
      type: 'tel',
      placeholder: 'Số điện thoại',
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      type: 'password',
      placeholder: 'Mật khẩu',
    },
    {
      name: 'confirmPassword',
      label: 'Xác nhận mật khẩu',
      type: 'password',
      placeholder: 'Xác nhận mật khẩu',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='w-full'
    >
      <Card className='w-full mx-auto backdrop-blur-sm bg-transparent border-none shadow-none'>
        <CardHeader className='space-y-2 pb-6'>
          <CardTitle className='text-3xl md:text-4xl font-bold text-center bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 bg-clip-text text-transparent'>
            Đăng ký
          </CardTitle>
          <p className='text-center text-sm text-muted-foreground'>
            Tạo tài khoản để bắt đầu hành trình
          </p>
        </CardHeader>
        <CardContent className='px-2 md:px-4'>
          <form onSubmit={handleRegisterSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {formFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  className={`space-y-2 ${
                    field.name === 'password' ||
                    field.name === 'confirmPassword'
                      ? 'md:col-span-2'
                      : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Label
                    htmlFor={`register-${field.name}`}
                    className='text-sm md:text-base font-medium'
                  >
                    {field.label}
                  </Label>
                  {field.type === 'password' ? (
                    <div className='relative'>
                      <Input
                        id={`register-${field.name}`}
                        type={
                          field.name === 'password'
                            ? showPassword
                              ? 'text'
                              : 'password'
                            : showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        name={field.name}
                        placeholder={field.placeholder}
                        value={registerData[field.name]}
                        onChange={handleRegisterChange}
                        className={`transition-all duration-200 text-sm md:text-base h-11 px-4 pr-11 rounded-xl border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                          errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : ''
                        }`}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          field.name === 'password'
                            ? setShowPassword(!showPassword)
                            : setShowConfirmPassword(!showConfirmPassword)
                        }
                        tabIndex={-1}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                      >
                        {(
                          field.name === 'password'
                            ? showPassword
                            : showConfirmPassword
                        ) ? (
                          <EyeOff className='w-4 h-4' />
                        ) : (
                          <Eye className='w-4 h-4' />
                        )}
                      </button>
                    </div>
                  ) : (
                    <Input
                      id={`register-${field.name}`}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={registerData[field.name]}
                      onChange={handleRegisterChange}
                      className={`transition-all duration-200 text-sm md:text-base h-11 px-4 rounded-xl border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
                        errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                  )}
                  {errors[field.name] && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-xs md:text-sm text-red-500 break-words'
                    >
                      {errors[field.name]}
                    </motion.p>
                  )}

                  {/* Hiển thị Password Strength Indicator cho trường password */}
                  {field.name === 'password' && registerData.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <PasswordStrengthIndicator
                        password={registerData.password}
                        showRequirements={true}
                        showStrengthBar={true}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='pt-2'
            >
              <Button
                type='submit'
                className='w-full h-12 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg text-sm md:text-base font-semibold rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800'
                disabled={isLoading}
                onClick={(e) => e.stopPropagation()}
              >
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='animate-spin h-4 w-4'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Đang đăng ký...
                  </span>
                ) : (
                  'Đăng ký tài khoản'
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Verify Email Dialog */}
      <VerifyEmailDialog
        open={showVerifyEmailDialog}
        onOpenChange={setShowVerifyEmailDialog}
        email={registerData.email}
      />

      {/* Common Error Dialog */}
      <AuthErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title='Đăng ký thất bại'
        message={errorDialogMessage}
      />
    </motion.div>
  );
};
