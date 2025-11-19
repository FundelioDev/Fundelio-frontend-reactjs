import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ACCENTS = {
  primary: {
    gradient: 'from-primary/15 via-primary/5 to-transparent',
    iconBg: 'bg-primary/15 text-primary',
    badgeText: 'text-primary',
  },
  emerald: {
    gradient: 'from-emerald-200/40 via-emerald-50 to-transparent',
    iconBg: 'bg-emerald-100 text-emerald-600',
    badgeText: 'text-emerald-600',
  },
  amber: {
    gradient: 'from-amber-200/50 via-amber-50 to-transparent',
    iconBg: 'bg-amber-100 text-amber-600',
    badgeText: 'text-amber-600',
  },
  violet: {
    gradient: 'from-violet-200/50 via-violet-50 to-transparent',
    iconBg: 'bg-violet-100 text-violet-600',
    badgeText: 'text-violet-600',
  },
  slate: {
    gradient: 'from-slate-200/50 via-slate-50 to-transparent',
    iconBg: 'bg-slate-100 text-slate-600',
    badgeText: 'text-slate-600',
  },
};

export const StatCard = ({ title, value, icon: Icon, trend, trendValue = 0, helper, accent = 'primary' }) => {
  const accentTheme = ACCENTS[accent] || ACCENTS.primary;

  return (
    <Card className="relative overflow-hidden border border-border/60 shadow-card p-3">
      <div className={`absolute inset-0 opacity-70 bg-gradient-to-br ${accentTheme.gradient}`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {value}
          </p>
          {helper && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {helper}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${accentTheme.badgeText}`}>
                {trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {trendValue}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                so với tháng trước
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${accentTheme.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};
