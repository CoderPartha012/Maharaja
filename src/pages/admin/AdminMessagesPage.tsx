import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import type { ContactMessage, MessageStatus } from '../../lib/database.types';

const STATUS_ACTIONS: { status: MessageStatus; label: string }[] = [
  { status: 'read', label: 'Mark read' },
  { status: 'replied', label: 'Mark replied' },
  { status: 'unread', label: 'Mark unread' },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id: string, status: MessageStatus) => {
    const { data: updated, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (!error && updated) {
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Messages
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                  {unreadCount} unread
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Contact form submissions</p>
          </div>
          <button
            onClick={() => void fetchMessages()}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin" aria-hidden="true" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No messages yet.</div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`bg-gray-900 border rounded-xl overflow-hidden transition-colors ${
                  m.status === 'unread' ? 'border-blue-700/50' : 'border-gray-800'
                }`}
              >
                {/* Message header */}
                <button
                  onClick={() => setExpanded((e) => (e === m.id ? null : m.id))}
                  className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-800/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{m.name}</span>
                      <StatusBadge type="message" status={m.status} />
                    </div>
                    <p className="text-sm font-medium text-gray-200 truncate">{m.subject}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Mail className="w-3 h-3" aria-hidden="true" />
                      <a
                        href={`mailto:${m.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-gray-300 transition-colors"
                      >
                        {m.email}
                      </a>
                      <span className="mx-1">·</span>
                      <span>{new Date(m.created_at).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  {expanded === m.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" aria-hidden="true" />
                  ) : (
                    <ChevronDown
                      className="w-4 h-4 text-gray-400 shrink-0 mt-1"
                      aria-hidden="true"
                    />
                  )}
                </button>

                {/* Expanded body */}
                {expanded === m.id && (
                  <div className="px-5 pb-4 border-t border-gray-800">
                    <p className="text-sm text-gray-300 mt-3 whitespace-pre-wrap">{m.message}</p>

                    <div className="flex items-center gap-2 mt-4">
                      {STATUS_ACTIONS.filter((a) => a.status !== m.status).map(
                        ({ status, label }) => (
                          <button
                            key={status}
                            onClick={() => void updateStatus(m.id, status)}
                            className="px-3 py-1.5 text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                          >
                            {label}
                          </button>
                        )
                      )}
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#D4AF37] text-[#1A1000] rounded-lg hover:bg-[#c4a030] transition-colors"
                        onClick={() => void updateStatus(m.id, 'replied')}
                      >
                        <Mail className="w-3 h-3" aria-hidden="true" />
                        Reply via email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
