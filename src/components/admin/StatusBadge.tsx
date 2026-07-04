import type { ReservationStatus, MessageStatus } from '../../lib/database.types';

const reservationColors: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-gray-100 text-gray-700',
};

const messageColors: Record<MessageStatus, string> = {
  unread: 'bg-blue-100 text-blue-800',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-100 text-green-800',
};

const reservationLabels: Record<ReservationStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  no_show: 'No-show',
};

const messageLabels: Record<MessageStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  replied: 'Replied',
};

interface ReservationStatusBadgeProps {
  type: 'reservation';
  status: ReservationStatus;
}

interface MessageStatusBadgeProps {
  type: 'message';
  status: MessageStatus;
}

type StatusBadgeProps = ReservationStatusBadgeProps | MessageStatusBadgeProps;

export default function StatusBadge(props: StatusBadgeProps) {
  const colorClass =
    props.type === 'reservation'
      ? (reservationColors[props.status] ?? 'bg-gray-100 text-gray-700')
      : (messageColors[props.status] ?? 'bg-gray-100 text-gray-700');

  const label =
    props.type === 'reservation'
      ? (reservationLabels[props.status] ?? props.status)
      : (messageLabels[props.status] ?? props.status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
