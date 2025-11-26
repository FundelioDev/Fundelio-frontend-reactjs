import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ACCENTS = {
  primary: {
    iconBg: 'bg-white/10 text-white dark:bg-white/10 dark:text-white',
    badgeText: 'text-sky-300',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 text-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200',
    badgeText: 'text-emerald-300',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-200 dark:bg-amber-500/10 dark:text-amber-200',
    badgeText: 'text-amber-300',
  },
  violet: {
    iconBg: 'bg-violet-500/10 text-violet-200 dark:bg-violet-500/10 dark:text-violet-200',
    badgeText: 'text-fuchsia-300',
  },
  slate: {
    iconBg: 'bg-slate-500/10 text-slate-200 dark:bg-slate-500/10 dark:text-slate-200',
    badgeText: 'text-slate-300',
  },
};

export const StatCard = ({ title, value, icon: Icon, trend, trendValue = 0, helper, accent = 'primary' }) => {
  const accentTheme = ACCENTS[accent] || ACCENTS.primary;

  return (
    <Card className='border border-gray-200/40 dark:border-white/5 bg-white/60 dark:bg-gray-950/50 backdrop-blur-md shadow-lg p-4'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-2 text-left'>
          <p className='text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300'>
            {title}
          </p>
          <p className='text-3xl font-semibold text-gray-900 dark:text-white'>
            {value}
          </p>
          {helper && (
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {helper}
            </p>
          )}
          {trend && (
            <div className='flex items-center gap-2 pt-1'>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${trend === 'up'
                  ? 'text-emerald-300'
                  : 'text-rose-300'
                  } bg-white/5`}
              >
                {trend === 'up' ? (
                  <ArrowUpRight className='w-4 h-4' />
                ) : (
                  <ArrowDownRight className='w-4 h-4' />
                )}
                {trendValue}%
              </span>
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                so với tháng trước
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`rounded-xl p-3 ${accentTheme.iconBg}`}>
            <Icon className='w-6 h-6' />
          </div>
        )}
      </div>
    </Card>
  );
};
