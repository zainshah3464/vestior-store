export type ExportType = 'orders' | 'payments' | 'emails' | 'users' | 'audit'

export interface ExportConfig {
  type: ExportType
  label: string
  description: string
  icon: string
  color: string
  filters: {
    date: boolean
    status: boolean
    provider: boolean
  }
}

export const EXPORT_CONFIGS: ExportConfig[] = [
  {
    type: 'orders',
    label: 'Orders',
    description: 'All orders with customer, items count, totals, and shipping info',
    icon: 'Package',
    color: 'border-l-indigo-500',
    filters: { date: true, status: true, provider: true },
  },
  {
    type: 'payments',
    label: 'Payments',
    description: 'Payment transactions with provider, amount, status',
    icon: 'CreditCard',
    color: 'border-l-emerald-500',
    filters: { date: true, status: true, provider: true },
  },
  {
    type: 'emails',
    label: 'Emails',
    description: 'Email delivery logs with template and status',
    icon: 'Mail',
    color: 'border-l-amber-500',
    filters: { date: true, status: true, provider: false },
  },
  {
    type: 'users',
    label: 'Users',
    description: 'Customer and admin profiles with contact info',
    icon: 'Users',
    color: 'border-l-purple-500',
    filters: { date: false, status: false, provider: false },
  },
  {
    type: 'audit',
    label: 'Audit Logs',
    description: 'Every admin action with timestamp and target',
    icon: 'ShieldCheck',
    color: 'border-l-rose-500',
    filters: { date: true, status: false, provider: false },
  },
]