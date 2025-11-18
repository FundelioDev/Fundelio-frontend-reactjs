import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/api/userApi';
import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import toast from 'react-hot-toast';

export default function BecomeFounderPage() {
    const navigate = useNavigate();
    const { user, fetchUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isAlreadyFounder, setIsAlreadyFounder] = useState(false);

    // Check if user is already a founder
    useEffect(() => {
        if (user) {
            const hasFounderRole = user.rolesSecured?.some(role => role.name === 'FOUNDER');
            setIsAlreadyFounder(hasFounderRole);
        }
    }, [user]);

    console.log('User roles:', user.roles);
    const handleBecomeFounder = async () => {
        if (!acceptedTerms) {
            toast.error('Vui lòng đồng ý với điều khoản và điều kiện');
            return;
        }

        try {
            setLoading(true);
            const response = await userApi.becomeFounder();

            if (response?.data?.success) {
                toast.success('Chúc mừng! Bạn đã trở thành Creator!');

                // Refresh user data to get updated roles
                if (fetchUserData) {
                    await fetchUserData();
                }

                setIsAlreadyFounder(true);
            } else {
                toast.error('Không thể trở thành Creator');
            }
        } catch (error) {
            console.error('Error becoming founder:', error);
            toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký Creator');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = () => {
        navigate('/campaigns/create');
    };

    const handleGoToSettings = () => {
        navigate('/dashboard');
    };

    if (isAlreadyFounder) {
        return (
            <div className="min-h-screen bg-background-light-2 dark:bg-darker flex items-center justify-center px-4">
                <div className="w-full max-w-2xl">
                    {/* Success Card */}
                    <div className="bg-white dark:bg-darker-2 rounded-lg p-12 text-center shadow-[0px_1px_11px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.3)]">
                        {/* Check Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-[#00D9A6] flex items-center justify-center">
                                <Check className="w-10 h-10 text-white" strokeWidth={3} />
                            </div>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-3xl font-bold text-[#00D9A6] mb-4">
                            Bạn đã là một Fundelio Founder!
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            Hồ sơ founder của bạn đã sẵn sàng để sử dụng.
                        </p>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Button
                                onClick={handleCreateProject}
                                variant="primary"
                                size="lg"
                                className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-3 rounded-lg text-base"
                            >
                                TẠO DỰ ÁN ĐẦU TIÊN CỦA BẠN
                            </Button>

                            <div className="text-muted-foreground text-sm">hoặc</div>

                            <button
                                onClick={handleGoToSettings}
                                className="text-[#00D9A6] hover:text-[#00F5B8] font-medium text-base transition-colors"
                            >
                                Đi tới cài đặt founder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light-2 dark:bg-darker flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-text-primary dark:text-white mb-3">Trở thành một creator</h1>
                    <p className="text-muted-foreground text-lg">
                        Hoàn thành các bước bên dưới để trở thành Fundelio creator và bắt đầu dự án đầu tiên của bạn.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white dark:bg-darker-2 rounded-lg p-8 space-y-8 shadow-[0px_1px_11px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.3)]">
                    {/* Step 1 - Login Status */}
                    <div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-[#00D9A6] flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-2 flex items-center gap-3">
                                    1. Đăng nhập / Đăng ký
                                    <Check className="w-6 h-6 text-[#00D9A6]" strokeWidth={3} />
                                </h2>
                                <p className="text-muted-foreground">
                                    Hồ sơ creator của bạn sẽ được liên kết với tài khoản Fundelio sau:{' '}
                                    <span className="font-semibold text-text-primary dark:text-white">{user?.email || 'user@example.com'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border"></div>

                    {/* Step 2 - Terms and Conditions */}
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-4">
                            2. Đồng ý với điều khoản và điều kiện
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Vui lòng đọc và chấp nhận điều khoản sử dụng để tiếp tục.
                        </p>

                        {/* Terms Checkbox */}
                        <div className="bg-blue-50 dark:bg-darker rounded-lg p-6 mb-6">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <Checkbox
                                    checked={acceptedTerms}
                                    onChange={(checked) => setAcceptedTerms(checked)}
                                    className="mt-1"
                                />
                                <span className="text-muted-foreground leading-relaxed">
                                    Tôi đã đọc và đồng ý với{' '}
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00D9A6] hover:text-[#00F5B8] underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Điều khoản sử dụng
                                    </a>
                                    {' '}và{' '}
                                    <a
                                        href="/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00D9A6] hover:text-[#00F5B8] underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Chính sách bảo mật
                                    </a>
                                    {' '}của Fundelio. Tôi hiểu rằng tôi cần tuân thủ các quy định này khi tạo và quản lý dự án.
                                </span>
                            </label>
                        </div>

                        {/* Continue Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleBecomeFounder}
                                disabled={!acceptedTerms || loading}
                                variant="primary"
                                size="lg"
                                className={`px-12 py-3 rounded-lg font-semibold text-base transition-all ${acceptedTerms && !loading
                                    ? 'bg-[#00D9A6] hover:bg-[#00F5B8] text-white'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                    }`}
                            >
                                {loading ? 'ĐANG XỬ LÝ...' : 'TIẾP TỤC'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center text-muted-foreground text-sm">
                    <p>Bạn cần hỗ trợ? <a href="/contact" className="text-[#00D9A6] hover:text-[#00F5B8] underline">Liên hệ với chúng tôi</a></p>
                </div>
            </div>
        </div>
    );
}
