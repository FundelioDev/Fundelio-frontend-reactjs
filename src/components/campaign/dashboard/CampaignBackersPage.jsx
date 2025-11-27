import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pledgeApi } from '@/api/pledgeApi';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import {
    Mail,
    MapPin,
    ArrowLeft,
    User,
    Package,
    Calendar,
    DollarSign,
    Users,
    TrendingUp,
    Search,
    Download,
    Filter
} from 'lucide-react';

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

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatShortDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
};

export default function CampaignBackersPage() {
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pledges, setPledges] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBackers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await pledgeApi.getPledgeByCampaign(campaignId);
                const content = response?.data?.data?.content || [];
                setPledges(content);
            } catch (err) {
                console.error('Error loading campaign backers:', err);
                setError('Không thể tải danh sách người ủng hộ');
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchBackers();
        }
    }, [campaignId]);

    const totalPledged = pledges.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    const avgPledge = pledges.length > 0 ? totalPledged / pledges.length : 0;

    const filteredPledges = pledges.filter((pledge) => {
        if (!searchTerm) return true;
        const backer = pledge.backerInfo || {};
        const searchLower = searchTerm.toLowerCase();
        return (
            backer.firstName?.toLowerCase().includes(searchLower) ||
            backer.lastName?.toLowerCase().includes(searchLower) ||
            backer.email?.toLowerCase().includes(searchLower) ||
            backer.city?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="min-h-screen flex flex-col bg-background-light-2 dark:bg-darker">
            <Header variant="light" />

            <main className="flex-1 pt-24 pb-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-md mt-1"
                                    onClick={() => navigate(`/campaigns/${campaignId}/statistics`)}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white">
                                                Danh sách người ủng hộ
                                            </h1>
                                            <p className="text-sm text-muted-foreground">
                                                Quản lý thông tin backer để chuẩn bị gửi phần thưởng
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {/* <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 rounded-md"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Xuất Excel</span>
                                </Button>
                            </div> */}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {!loading && pledges.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                            <div className="rounded-lg bg-white dark:bg-darker-2 border border-border/50 p-4 shadow-card">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-text-primary dark:text-white">
                                            {pledges.length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Tổng backer</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-white dark:bg-darker-2 border border-border/50 p-4 shadow-card">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatShortCurrency(totalPledged)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Tổng cam kết</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-white dark:bg-darker-2 border border-border/50 p-4 shadow-card">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatShortCurrency(avgPledge)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Trung bình/người</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg bg-white dark:bg-darker-2 border border-border/50 p-4 shadow-card">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {pledges.length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Cần gửi rewards</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search & Filter Bar */}
                    {!loading && pledges.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên, email, địa chỉ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg shadow-card border border-border/50 bg-white dark:bg-darker-2 text-sm text-text-primary dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>
                            {/* <Button
                                variant="outline"
                                className="gap-2 rounded-lg"
                            >
                                <Filter className="w-4 h-4" />
                                Bộ lọc
                            </Button> */}
                        </div>
                    )}

                    {/* Content */}
                    {loading && (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-lg bg-white dark:bg-darker-2 border border-border/50 p-5 animate-pulse">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-muted" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 w-40 bg-muted rounded" />
                                            <div className="h-4 w-60 bg-muted rounded" />
                                        </div>
                                        <div className="h-8 w-24 bg-muted rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                            <p className="text-sm text-destructive">{error}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => window.location.reload()}
                            >
                                Thử lại
                            </Button>
                        </div>
                    )}

                    {!loading && !error && pledges.length === 0 && (
                        <div className="rounded-lg border border-border bg-white dark:bg-darker-2 p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
                                Chưa có người ủng hộ
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Danh sách backer sẽ hiển thị khi chiến dịch nhận được pledge đầu tiên.
                            </p>
                        </div>
                    )}

                    {!loading && !error && filteredPledges.length > 0 && (
                        <div className="rounded-lg bg-white dark:bg-darker-2 border border-border/50 shadow-card overflow-hidden">
                            {/* Table Header */}
                            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-3 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                <div className="col-span-1">STT</div>
                                <div className="col-span-4">Thông tin backer</div>
                                <div className="col-span-3">Liên hệ & Địa chỉ</div>
                                <div className="col-span-2 text-right">Số tiền</div>
                                <div className="col-span-2 text-right">Thời gian</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-border/30">
                                {filteredPledges.map((pledge, index) => {
                                    const backer = pledge.backerInfo || {};
                                    return (
                                        <div
                                            key={pledge.pledgeId}
                                            className="group hover:bg-muted/20 transition-colors"
                                        >
                                            {/* Desktop View */}
                                            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-4 items-center">
                                                {/* Rank */}
                                                <div className="col-span-1">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                        index === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400' :
                                                            index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                                                                'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                </div>

                                                {/* Backer Info */}
                                                <div className="col-span-4 flex items-center gap-1.5">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 ring-2 ring-border/30">
                                                        {backer.avatarUrl ? (
                                                            <img
                                                                src={backer.avatarUrl}
                                                                alt={`${backer.firstName || ''} ${backer.lastName || ''}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-semibold">
                                                                {backer.firstName?.[0] || backer.lastName?.[0] || '?'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-text-primary dark:text-white truncate">
                                                            {backer.firstName} {backer.lastName}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Contact & Location */}
                                                <div className="col-span-3 space-y-1">
                                                    {backer.email && (
                                                        <p className="text-sm flex items-center gap-2 text-text-primary dark:text-white">
                                                            <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                                            <span className="truncate">{backer.email}</span>
                                                        </p>
                                                    )}
                                                    {(backer.city || backer.nationality) && (
                                                        <p className="text-sm flex items-center gap-2 text-muted-foreground">
                                                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                                            {[backer.city, backer.nationality].filter(Boolean).join(', ')}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Amount */}
                                                <div className="col-span-2 text-right">
                                                    <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(pledge.totalAmount)}
                                                    </p>
                                                    {pledge.bonusAmount > 0 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            +{formatShortCurrency(pledge.bonusAmount)} bonus
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Date */}
                                                <div className="col-span-2 text-right">
                                                    <p className="text-sm text-text-primary dark:text-white">
                                                        {formatShortDate(pledge.createdAt)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(pledge.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Mobile View */}
                                            <div className="lg:hidden p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                        index === 1 ? 'bg-slate-100 text-slate-600' :
                                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                        {backer.avatarUrl ? (
                                                            <img
                                                                src={backer.avatarUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-semibold text-sm">
                                                                {backer.firstName?.[0] || '?'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-sm font-semibold text-text-primary dark:text-white truncate">
                                                                {backer.firstName} {backer.lastName}
                                                            </p>
                                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                                {formatShortCurrency(pledge.totalAmount)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                                                            {backer.email && (
                                                                <p className="flex items-center gap-1.5 truncate">
                                                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                                                    {backer.email}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-1.5">
                                                                {(backer.city || backer.nationality) && (
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {backer.city || backer.nationality}
                                                                    </span>
                                                                )}
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {formatShortDate(pledge.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            {filteredPledges.length < pledges.length && (
                                <div className="px-5 py-3 bg-muted/20 border-t border-border/50 text-center text-sm text-muted-foreground">
                                    Hiển thị {filteredPledges.length} / {pledges.length} kết quả
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && !error && pledges.length > 0 && filteredPledges.length === 0 && (
                        <div className="rounded-lg border border-border bg-white dark:bg-darker-2 p-8 text-center">
                            <Search className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">
                                Không tìm thấy kết quả phù hợp với "{searchTerm}"
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
