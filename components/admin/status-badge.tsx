import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/lib/booking/api'

const STYLES: Record<BookingStatus, string> = {
  pending: 'bg-gold/25 text-coffee-deep border-gilt/40',
  confirmed: 'bg-sage/25 text-[#3d4a32] border-sage/40',
  declined: 'bg-burgundy/10 text-burgundy border-burgundy/25',
  cancelled: 'bg-coffee/10 text-coffee border-coffee/20',
  completed: 'bg-paper-deep text-shadow border-coffee/15',
  no_show: 'bg-shadow/10 text-shadow border-shadow/20',
}

const LABELS: Record<BookingStatus, string> = {
  pending: 'Waiting',
  confirmed: 'Confirmed',
  declined: 'Declined',
  cancelled: 'Cancelled',
  completed: 'Completed',
  no_show: 'No-show',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 font-ui text-[0.62rem] tracking-[0.14em] uppercase', STYLES[status])}>
      {LABELS[status]}
    </span>
  )
}
