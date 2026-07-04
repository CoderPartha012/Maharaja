import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Phone, Mail, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import ReservationDetailDrawer from '../../components/admin/ReservationDetailDrawer';
import type { Reservation, ReservationStatus } from '../../lib/database.types';

const STATUS_ACTIONS: { status: ReservationStatus; label: string; className: string }[] = [
  {
    status: 'confirmed',
    label: 'Confirm',
    className: 'text-green-400 hover:text-green-300 hover:bg-green-900/30',
  },
  {
    status: 'no_show',
    label: 'No-show',
    className: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
  },
  {
    status: 'cancelled',
    label: 'Cancel',
    className: 'text-red-400 hover:text-red-300 hover:bg-red-900/30',
  },
];

const todayIso = () => new Date().toISOString().split('T')[0]!;

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchToday = useCallback(async () => {
    const today = todayIso();
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', today)
      .order('time', { ascending: true });

    setReservations(data ?? []);
    setLastRefreshed(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchToday();
    const interval = setInterval(() => void fetchToday(), 60_000);
    return () => clearInterval(interval);
  }, [fetchToday]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    const { data: updated, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (!error && updated) {
      setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  };

  const handleUpdated = (updated: Reservation) => {
    setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const summary = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    covers: reservations
      .filter((r) => r.status !== 'cancelled' && r.status !== 'no_show')
      .reduce((s, r) => s + r.party_size, 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Today's Reservations</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={() => void fetchToday()}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: summary.total, color: 'text-white' },
            { label: 'Confirmed', value: summary.confirmed, color: 'text-green-400' },
            { label: 'Pending', value: summary.pending, color: 'text-yellow-400' },
            { label: 'Covers', value: summary.covers, color: 'text-[#D4AF37]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin" aria-hidden="true" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No reservations for today.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Time
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Guest
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Party
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {reservations.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => setSelected(r)}
                    >
                      <td className="px-4 py-3 font-mono text-white font-medium">{r.time}</td>
                      <td className="px-4 py-3 text-white">{r.name}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-300">
                          <Users className="w-3.5 h-3.5" aria-hidden="true" /> {r.party_size}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <a
                            href={`tel:${r.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-gray-300 hover:text-white text-xs"
                          >
                            <Phone className="w-3 h-3" aria-hidden="true" /> {r.phone}
                          </a>
                          {r.email && (
                            <span className="flex items-center gap-1 text-gray-500 text-xs">
                              <Mail className="w-3 h-3" aria-hidden="true" /> {r.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge type="reservation" status={r.status} />
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {STATUS_ACTIONS.filter((a) => a.status !== r.status).map(
                            ({ status, label, className }) => (
                              <button
                                key={status}
                                onClick={() => void updateStatus(r.id, status)}
                                className={`px-2 py-1 text-xs rounded transition-colors ${className}`}
                              >
                                {label}
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-600 text-right">
          Last refreshed {lastRefreshed.toLocaleTimeString('en-IN')} · auto-refreshes every 60s
        </p>
      </div>

      <ReservationDetailDrawer
        reservation={selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />
    </AdminLayout>
  );
}
