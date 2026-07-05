import { useCallback, useEffect, useState } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Users, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import ReservationDetailDrawer from '../../components/admin/ReservationDetailDrawer';
import type { Reservation, ReservationStatus } from '../../lib/database.types';

const PAGE_SIZE = 20;
const todayIso = () => new Date().toISOString().split('T')[0]!;

const STATUS_OPTIONS: { value: ReservationStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No-show' },
];

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

export default function AdminUpcomingPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [page, setPage] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [dateFrom, setDateFrom] = useState(todayIso());
  const [dateTo, setDateTo] = useState('');

  const fetchReservations = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('reservations')
      .select('*', { count: 'exact' })
      .gte('date', dateFrom || todayIso())
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (dateTo) query = query.lte('date', dateTo);
    if (statusFilter) query = query.eq('status', statusFilter);
    if (search.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`);
    }

    const { data, count } = await query;
    setReservations(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, search, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    void fetchReservations();
  }, [fetchReservations]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, dateFrom, dateTo]);

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

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Upcoming Reservations</h1>
          <button
            onClick={() => void fetchReservations()}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder-gray-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | '')}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            aria-label="From date"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            aria-label="To date"
          />
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin" aria-hidden="true" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No reservations match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Guest
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Party
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
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
                      <td className="px-4 py-3 text-gray-300">{r.date}</td>
                      <td className="px-4 py-3 font-mono text-white">{r.time}</td>
                      <td className="px-4 py-3 text-white">{r.name}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-300">
                          <Users className="w-3.5 h-3.5" aria-hidden="true" /> {r.party_size}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${r.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-gray-300 hover:text-white text-xs"
                        >
                          <Phone className="w-3 h-3" aria-hidden="true" /> {r.phone}
                        </a>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ReservationDetailDrawer
        reservation={selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />
    </AdminLayout>
  );
}
