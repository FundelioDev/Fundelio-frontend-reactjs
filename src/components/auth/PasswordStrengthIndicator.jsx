import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

/**
 * Component hiển thị độ mạnh của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @param {boolean} showRequirements - Hiển thị danh sách yêu cầu (mặc định: true)
 * @param {boolean} showStrengthBar - Hiển thị thanh độ mạnh (mặc định: true)
 */
export const PasswordStrengthIndicator = ({
  password,
  showRequirements = true,
  showStrengthBar = true,
}) => {
  // Validate password với các tiêu chí
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    };
  };

  // Tính toán độ mạnh của mật khẩu
  const getPasswordStrength = (password) => {
    if (!password) return null;

    const validations = validatePassword(password);
    const score = Object.values(validations).filter(Boolean).length;

    if (score <= 2) return { text: 'Yếu', color: 'red', width: '33%' };
    if (score <= 3)
      return { text: 'Trung bình', color: 'yellow', width: '66%' };
    return { text: 'Mạnh', color: 'green', width: '100%' };
  };

  // Danh sách các yêu cầu mật khẩu với label
  const getRequirementLabel = (key) => {
    const labels = {
      minLength: 'Ít nhất 8 ký tự',
      hasUpperCase: 'Có chữ hoa',
      hasLowerCase: 'Có chữ thường',
      hasNumbers: 'Có số',
      hasSpecialChar: 'Có ký tự đặc biệt',
    };
    return labels[key] || '';
  };

  const passwordStrength = getPasswordStrength(password);
  const validations = password ? validatePassword(password) : {};

  if (!password) return null;

  return (
    <div className='space-y-3'>
      {/* Thanh độ mạnh mật khẩu */}
      {showStrengthBar && passwordStrength && (
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: passwordStrength.width }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`h-full transition-colors duration-300 ${
                  passwordStrength.color === 'red'
                    ? 'bg-red-500'
                    : passwordStrength.color === 'yellow'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
            </div>
            <span
              className={`text-xs font-medium min-w-[70px] text-right ${
                passwordStrength.color === 'red'
                  ? 'text-red-500'
                  : passwordStrength.color === 'yellow'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              {passwordStrength.text}
            </span>
          </div>
        </div>
      )}

      {/* Danh sách yêu cầu mật khẩu */}
      {showRequirements && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='space-y-1 text-xs'
        >
          {Object.entries(validations).map(([key, valid]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.05 * Object.keys(validations).indexOf(key),
              }}
              className={`flex items-center gap-2 transition-colors duration-200 ${
                valid
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              }`}
            >
              <CheckCircle2
                className={`w-3 h-3 transition-all duration-200 ${
                  valid ? 'scale-110' : 'scale-100 opacity-50'
                }`}
              />
              <span>{getRequirementLabel(key)}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

/**
 * Hook để validate mật khẩu
 * @param {string} password - Mật khẩu cần validate
 * @returns {object} - Object chứa các validation
 */
export const usePasswordValidation = (password) => {
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers,
    };
  };

  return validatePassword(password);
};
