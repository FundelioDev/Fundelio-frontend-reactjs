import {
  FileText,
  Clock,
  Check,
  X,
  Loader,
  TrendingUp,
  TrendingDown,
  Ban,
  PauseCircle,
} from 'lucide-react';

export const CAMPAIGN_STATUS_BADGE_CONFIG = {
  DRAFT: {
    label: 'Bản nháp',
    icon: FileText,
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  },
  PENDING: {
    label: 'Chờ duyệt',
    icon: Clock,
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100',
  },
  APPROVED: {
    label: 'Đã duyệt',
    icon: Check,
    className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-100',
  },
  REJECTED: {
    label: 'Từ chối',
    icon: X,
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-100',
  },
  ACTIVE: {
    label: 'Đang gây quỹ',
    icon: Loader,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-100',
  },
  SUCCESSFUL: {
    label: 'Thành công',
    icon: TrendingUp,
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100',
  },
  FAILED: {
    label: 'Thất bại',
    icon: TrendingDown,
    className: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-100',
  },
  ENDED: {
    label: 'Kết thúc',
    icon: Ban,
    className: 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100',
  },
  PAUSED: {
    label: 'Tạm dừng',
    icon: PauseCircle,
    className: 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-100',
  },
};

export const getCampaignStatusConfig = (status) => {
  if (!status) return CAMPAIGN_STATUS_BADGE_CONFIG.PENDING;
  return (
    CAMPAIGN_STATUS_BADGE_CONFIG[status] ||
    CAMPAIGN_STATUS_BADGE_CONFIG.PENDING
  );
};

