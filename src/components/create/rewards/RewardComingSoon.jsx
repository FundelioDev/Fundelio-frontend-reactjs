import { Gift } from 'lucide-react';

/**
 * RewardComingSoon component - Placeholder for reward section (Coming Soon)
 */
export default function RewardComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Gift className="w-16 h-16 text-gray-300 dark:text-gray-700" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Phần thưởng
        </h3>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Tính năng này sắp ra mắt
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-500">
          Vui lòng quay lại sau để tạo các phần thưởng cho chiến dịch của bạn.
        </p>
      </div>
    </div>
  );
}
