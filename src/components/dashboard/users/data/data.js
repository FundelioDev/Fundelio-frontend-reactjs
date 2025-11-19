import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'

export const useCallTypes = () => {
  return new Map([
    ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
    ['inactive', 'bg-neutral-300/40 border-neutral-300'],
    ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
    [
      'suspended',
      'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
    ],
  ])
}

export const useUserTypes = () => {
  return [
    {
      label: 'Quản trị viên cấp cao',
      value: 'superadmin',
      icon: IconShield,
    },
    {
      label: 'Quản trị viên',
      value: 'admin',
      icon: IconUserShield,
    },
    {
      label: 'Người quản lý',
      value: 'manager',
      icon: IconUsersGroup,
    },
    {
      label: 'Thu ngân',
      value: 'cashier',
      icon: IconCash,
    },
  ]
}

