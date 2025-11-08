import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Home, ShieldAlert, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';
import Button from '@/components/common/Button';

export default function ForbiddenPage() {
    const navigate = useNavigate();
    const shieldRef = useRef(null);
    const lockRef = useRef(null);
    const floatingRef = useRef([]);

    useEffect(() => {
        // Animate shield
        if (shieldRef.current) {
            gsap.fromTo(
                shieldRef.current,
                { scale: 0, rotation: -180, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'back.out(1.7)',
                }
            );

            // Pulse animation
            gsap.to(shieldRef.current, {
                scale: 1.05,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }

        // Animate lock icon
        if (lockRef.current) {
            gsap.fromTo(
                lockRef.current,
                { y: -50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'bounce.out',
                }
            );
        }

        // Floating animation for decorative elements
        floatingRef.current.forEach((el, index) => {
            if (el) {
                gsap.to(el, {
                    y: '+=15',
                    x: '+=10',
                    duration: 3 + index * 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }
        });
    }, []);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background-light-2 via-background to-background-light dark:from-darker dark:via-darker-2 dark:to-darker flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    ref={(el) => (floatingRef.current[0] = el)}
                    className="absolute top-20 left-10 w-20 h-20 rounded-full bg-destructive/10 blur-xl"
                />
                <div
                    ref={(el) => (floatingRef.current[1] = el)}
                    className="absolute top-40 right-20 w-32 h-32 rounded-full bg-amber-500/10 blur-xl"
                />
                <div
                    ref={(el) => (floatingRef.current[2] = el)}
                    className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-destructive/10 blur-xl"
                />
                <div
                    ref={(el) => (floatingRef.current[3] = el)}
                    className="absolute bottom-40 right-1/3 w-28 h-28 rounded-full bg-amber-500/10 blur-xl"
                />
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full text-center relative z-10"
            >
                {/* 403 Number with Shield Icon */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
                    <motion.span
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'backOut' }}
                        className="text-[100px] sm:text-[150px] md:text-[200px] font-black text-destructive drop-shadow-2xl leading-none"
                    >
                        4
                    </motion.span>

                    {/* Animated Shield */}
                    <div className="relative" ref={shieldRef}>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-destructive to-amber-500 flex items-center justify-center shadow-2xl">
                            <ShieldAlert className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
                        </div>
                        {/* Lock Icon on Shield */}
                        <motion.div
                            ref={lockRef}
                            className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-darker rounded-full flex items-center justify-center shadow-lg"
                            animate={{
                                rotate: [0, -10, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        >
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                        </motion.div>
                    </div>

                    <motion.span
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'backOut' }}
                        className="text-[100px] sm:text-[150px] md:text-[200px] font-black text-destructive drop-shadow-2xl leading-none"
                    >
                        3
                    </motion.span>
                </div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-8 space-y-4"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary dark:text-white">
                        Không có quyền truy cập
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền hạn của bạn
                        hoặc liên hệ với quản trị viên để được hỗ trợ.
                    </p>
                </motion.div>

                {/* Suggested Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="bg-white/50 dark:bg-darker/50 backdrop-blur-sm rounded-xl p-6 border border-border max-w-md mx-auto">
                        <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-3">
                            Bạn có thể thử:
                        </h3>
                        <div className="space-y-2 text-left">
                            <Link
                                to="/auth"
                                className="block px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                                → Đăng nhập lại
                            </Link>
                            <Link
                                to="/"
                                className="block px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                                → Về trang chủ
                            </Link>
                            <Link
                                to="/your-projects"
                                className="block px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                                → Xem dự án của bạn
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleGoBack}
                        className="flex items-center gap-2 min-w-[200px]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại</span>
                    </Button>
                    <Link to="/">
                        <Button
                            variant="gradient"
                            size="lg"
                            className="flex items-center gap-2 min-w-[200px]"
                        >
                            <Home className="w-5 h-5" />
                            <span>Về trang chủ</span>
                        </Button>
                    </Link>
                </motion.div>

                {/* Additional Help */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="mt-12"
                >
                    <p className="text-sm text-muted-foreground">
                        Cần hỗ trợ?{' '}
                        <a
                            href="mailto:support@fundelio.com"
                            className="text-primary hover:underline font-medium"
                        >
                            Liên hệ đội ngũ hỗ trợ
                        </a>
                        {' '}hoặc xem{' '}
                        <Link to="/help" className="text-primary hover:underline font-medium">
                            trang trợ giúp
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
