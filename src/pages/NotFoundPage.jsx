import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Button';

export default function NotFoundPage() {
    const navigate = useNavigate();
    const numberRef = useRef(null);
    const floatingRef = useRef([]);

    useEffect(() => {
        // Animate 404 numbers
        if (numberRef.current) {
            gsap.fromTo(
                numberRef.current.children,
                { y: -100, opacity: 0, rotation: -180 },
                {
                    y: 0,
                    opacity: 1,
                    rotation: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'bounce.out',
                }
            );
        }

        // Floating animation for decorative elements
        floatingRef.current.forEach((el, index) => {
            if (el) {
                gsap.to(el, {
                    y: '+=20',
                    duration: 2 + index * 0.5,
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
                    className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"
                />
                <div
                    ref={(el) => (floatingRef.current[1] = el)}
                    className="absolute top-40 right-20 w-32 h-32 rounded-full bg-secondary/10 blur-xl"
                />
                <div
                    ref={(el) => (floatingRef.current[2] = el)}
                    className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-primary/10 blur-xl"
                />
                <div
                    ref={(el) => (floatingRef.current[3] = el)}
                    className="absolute bottom-40 right-1/3 w-28 h-28 rounded-full bg-secondary/10 blur-xl"
                />
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full text-center relative z-10"
            >
                {/* 404 Number */}
                <div
                    ref={numberRef}
                    className="flex items-center justify-center gap-4 mb-8"
                >
                    <span className="text-[120px] sm:text-[180px] md:text-[220px] font-black text-primary drop-shadow-2xl leading-none">
                        4
                    </span>
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="relative"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-8 border-primary/30 flex items-center justify-center">
                            <Search className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary" />
                        </div>
                    </motion.div>
                    <span className="text-[120px] sm:text-[180px] md:text-[220px] font-black text-primary drop-shadow-2xl leading-none">
                        4
                    </span>
                </div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-8 space-y-4"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary dark:text-white">
                        Trang không tìm thấy
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                        Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
                    </p>
                </motion.div>

                {/* Search Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="bg-white/50 dark:bg-darker/50 backdrop-blur-sm rounded-xl p-6 border border-border max-w-md mx-auto">
                        <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-3">
                            Có thể bạn đang tìm:
                        </h3>
                        <div className="space-y-2 text-left">
                            <Link
                                to="/"
                                className="block px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                                → Trang chủ
                            </Link>
                            <Link
                                to="/campaigns/create"
                                className="block px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                                → Tạo chiến dịch mới
                            </Link>
                            <Link
                                to="/your-projects"
                                className="block px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                                → Dự án của bạn
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
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
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-12"
                >
                    <p className="text-sm text-muted-foreground">
                        Nếu bạn cho rằng đây là lỗi, vui lòng{' '}
                        <a
                            href="mailto:support@fundelio.com"
                            className="text-primary hover:underline font-medium"
                        >
                            liên hệ với chúng tôi
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
