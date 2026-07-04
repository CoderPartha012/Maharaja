import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, MessageSquare, LogOut, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const navItems = [
  { to: '/admin/reservations', icon: Clock, label: "Today's Reservations" },
  { to: '/admin/upcoming', icon: CalendarDays, label: 'Upcoming' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex flex-col h-full ${mobile ? '' : 'w-64'}`}>
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <UtensilsCrossed className="w-6 h-6 text-[#D4AF37]" aria-hidden="true" />
        <span className="text-white font-bold text-lg">Maharaja Admin</span>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-3 py-2 text-xs text-gray-500 truncate mb-1">{user?.email}</div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 flex flex-col w-64 h-full bg-gray-900 border-r border-gray-800">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white rounded"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white font-semibold">Maharaja Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-950">{children}</main>
      </div>
    </div>
  );
}
