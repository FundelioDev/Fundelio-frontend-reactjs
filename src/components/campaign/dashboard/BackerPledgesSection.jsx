import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pledgeApi } from '@/api/pledgeApi';
import Button from '@/components/common/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, MapPin, Package, ChevronRight, Users, TrendingUp } from 'lucide-react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount || 0);

const formatShortCurrency = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount?.toLocaleString('vi-VN') || '0';
};

export default function BackerPledgesSection({ campaignId }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pledges, setPledges] = useState([]);

    useEffect(() => {
        const fetchPledges = async () => {
            if (!campaignId) return;
            try {
                setLoading(true);
                setError(null);
                const response = await pledgeApi.getPledgeByCampaign(campaignId);
                const content = response?.data?.data?.content || [];
                setPledges(content);
            } catch (err) {
                console.error('Error loading pledges:', err);
                setError('Không thể tải thông tin người ủng hộ');
            } finally {
                setLoading(false);
            }
        };

        fetchPledges();
    }, [campaignId]);

    const totalPledged = pledges.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

    return (
        <section className="mt-6">
            {/* Header with gradient accent */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary dark:text-white">
                            Người ủng hộ & Fulfillment
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Quản lý thông tin backer để gửi phần thưởng
                        </p>
                    </div>
                </div>
                {pledges.length > 0 && (
                    <div
                        size="sm"
                        variant="ghost"
                        className="flex items-center text-xs text-primary hover:text-blue-700 cusor-pointer gap-1"
                        onClick={() => navigate(`/campaigns/${campaignId}/backers`)}
                    >
                        Xem tất cả
                        <ChevronRight className="w-4 h-4" />
                    </div>
                )}
            </div>

            <div className="rounded-lg bg-white dark:bg-darker-2 shadow-card border border-border/50 overflow-hidden">
                {/* Summary Stats Bar */}
                {!loading && pledges.length > 0 && (
                    <div className="grid grid-cols-2 divide-x divide-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
                        <div className="px-4 py-3 flex items-center gap-1.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-text-primary dark:text-white">
                                    {pledges.length}
                                </p>
                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Người ủng hộ
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-3 flex items-center gap-1.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatShortCurrency(totalPledged)}
                                </p>
                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                    Tổng cam kết
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-4">
                    {loading && (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-1.5 animate-pulse">
                                    <div className="w-10 h-10 rounded-lg bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-muted rounded" />
                                        <div className="h-3 w-48 bg-muted rounded" />
                                    </div>
                                    <div className="h-6 w-20 bg-muted rounded" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <p className="text-sm text-destructive py-2">{error}</p>
                    )}

                    {!loading && !error && pledges.length === 0 && (
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                <Users className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Chưa có người ủng hộ nào
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                Danh sách backer sẽ hiển thị khi có pledge đầu tiên
                            </p>
                        </div>
                    )}

                    {!loading && !error && pledges.length > 0 && (
                        <div className="space-y-1">
                            {pledges.slice(0, 5).map((pledge, index) => {
                                const backer = pledge.backerInfo || {};
                                const isLast = index === Math.min(pledges.length - 1, 4);

                                return (
                                    <div
                                        key={pledge.pledgeId}
                                        className={`group flex items-center gap-1.5 py-3 px-2 -mx-2 rounded-md hover:bg-muted/30 transition-colors ${!isLast ? 'border-b border-border/30' : ''}`}
                                    >
                                        {/* Rank indicator */}
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                            index === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400' :
                                                index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                                                    'bg-muted text-muted-foreground'
                                            }`}>
                                            {index + 1}
                                        </div>

                                        {/* Avatar */}
                                        <Avatar className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-border/50">
                                            {backer.avatarUrl ? (
                                                <AvatarImage
                                                    src={backer.avatarUrl}
                                                    alt={`${backer.firstName || ''} ${backer.lastName || ''}`}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <AvatarFallback className="text-xs rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                                                    {backer.firstName?.[0] || backer.lastName?.[0] || '?'}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary dark:text-white truncate">
                                                {backer.firstName} {backer.lastName}
                                            </p>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                                                {backer.email && (
                                                    <span className="inline-flex items-center gap-1 truncate max-w-[140px]">
                                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                                        {backer.email}
                                                    </span>
                                                )}
                                                {(backer.city || backer.nationality) && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        {backer.city || backer.nationality}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Amount Badge */}
                                        <div className="text-right flex-shrink-0">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                {formatShortCurrency(pledge.totalAmount)}
                                            </span>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {new Date(pledge.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                {!loading && !error && pledges.length > 0 && (
                    <div className="px-4 py-3 bg-muted/20 border-t border-border/50">
                        <Button
                            variant="ghost"
                            className="w-full text-sm text-primary hover:bg-primary/10 rounded-md gap-2"
                            onClick={() => navigate(`/campaigns/${campaignId}/backers`)}
                        >
                            <Package className="w-4 h-4" />
                            Quản lý danh sách & gửi phần thưởng
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
