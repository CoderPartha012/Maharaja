import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import StatusBadge from './StatusBadge';
import type { Reservation, ReservationStatus } from '../../lib/database.types';

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
  onUpdated: (updated: Reservation) => void;
}

const editSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().or(z.literal('')).optional().default(''),
  date: z.string().min(1),
  time: z.string().min(1),
  party_size: z.coerce.number().int().min(1).max(8),
  special_requests: z.string().optional().default(''),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'no_show']),
});

type EditFormData = z.infer<typeof editSchema>;

const STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No-show' },
];

const TIME_SLOTS = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
];

export default function ReservationDetailDrawer({ reservation, onClose, onUpdated }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditFormData>({ resolver: zodResolver(editSchema) });

  useEffect(() => {
    if (reservation) {
      reset({
        name: reservation.name,
        phone: reservation.phone,
        email: reservation.email ?? '',
        date: reservation.date,
        time: reservation.time,
        party_size: reservation.party_size,
        special_requests: reservation.special_requests ?? '',
        status: reservation.status,
      });
      setSaveError(null);
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [reservation, reset]);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!reservation) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [reservation, onClose]);

  const onSubmit = async (data: EditFormData) => {
    if (!reservation) return;
    setSaveError(null);

    const { data: updated, error } = await supabase
      .from('reservations')
      .update({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        date: data.date,
        time: data.time,
        party_size: data.party_size,
        special_requests: data.special_requests || null,
        status: data.status,
      })
      .eq('id', reservation.id)
      .select()
      .single();

    if (error || !updated) {
      setSaveError('Failed to save changes. Please try again.');
      return;
    }

    onUpdated(updated);
    onClose();
  };

  if (!reservation) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-30" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Reservation details"
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-900 border-l border-gray-700 z-40 flex flex-col shadow-2xl"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">{reservation.name}</h2>
            <div className="mt-1">
              <StatusBadge type="reservation" status={reservation.status} />
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          {saveError && (
            <p
              role="alert"
              className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-lg px-4 py-2"
            >
              {saveError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
              <input
                {...register('name')}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Phone</label>
              <input
                {...register('phone')}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
              <input
                {...register('date')}
                type="date"
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Time</label>
              <select
                {...register('time')}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Party size</label>
              <select
                {...register('party_size')}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Special requests</label>
            <textarea
              {...register('special_requests')}
              rows={3}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
            />
          </div>

          <div className="text-xs text-gray-500 space-y-0.5 pt-2 border-t border-gray-800">
            <p>
              Reference:{' '}
              <span className="font-mono">{reservation.id.split('-')[0]?.toUpperCase()}</span>
            </p>
            <p>Booked: {new Date(reservation.created_at).toLocaleString('en-IN')}</p>
          </div>
        </form>

        <footer className="px-6 py-4 border-t border-gray-700 shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isDirty}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-[#D4AF37] text-[#1A1000] rounded-lg hover:bg-[#c4a030] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              Save changes
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
