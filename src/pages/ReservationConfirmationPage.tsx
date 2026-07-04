import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users, Hash, CalendarPlus, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

interface ConfirmationState {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  email: string | null;
}

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const ReservationConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const state = location.state as ConfirmationState | null;

  useEffect(() => {
    if (!state?.id) {
      navigate('/reservations', { replace: true });
      return;
    }
    headingRef.current?.focus();
  }, [state, navigate]);

  if (!state?.id) return null;

  const shortRef = state.id.split('-')[0]?.toUpperCase() ?? state.id.slice(0, 8).toUpperCase();

  return (
    <>
      <SEO
        title="Reservation Confirmed"
        description="Your table at Maharaja has been reserved. See your booking details and reference number."
        canonicalPath="/reservations/confirmation"
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl font-bold text-[#7A5C00] mb-2 focus:outline-none"
            >
              Reservation Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you, {state.name}.
              {state.email ? ' A confirmation will be sent to your email.' : ''}
            </p>
          </div>

          <div className="bg-[#FFF8DC] rounded-lg p-6 space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-[#7A5C00] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Reference ID</p>
                <p className="font-mono font-semibold text-[#7A5C00]">{shortRef}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#7A5C00] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                <p className="font-medium">{formatDate(state.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#7A5C00] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                <p className="font-medium">{state.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#7A5C00] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Party Size</p>
                <p className="font-medium">
                  {state.guests} {state.guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mb-6">
            Please quote your reference ID when contacting us. To modify or cancel, call{' '}
            <a href="tel:+919876543210" className="text-[#7A5C00] underline">
              +91 98765 43210
            </a>
            .
          </p>

          {/* Quick-action links */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dinner+at+Maharaja&dates=${state.date.replace(/-/g, '')}T${state.time.replace(':', '')}00%2F${state.date.replace(/-/g, '')}T${state.time.replace(':', '')}00&details=Reservation+ref:+${shortRef}&location=456+Spice+Avenue,+Delhi+110001`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#D4AF37] text-[#7A5C00] rounded-full text-sm font-semibold hover:bg-[#D4AF37] hover:text-[#1A1000] transition-all"
            >
              <CalendarPlus className="w-4 h-4" aria-hidden="true" />
              Add to Calendar
            </a>
            <a
              href="https://maps.google.com/?q=456+Spice+Avenue+Delhi+110001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#D4AF37] text-[#7A5C00] rounded-full text-sm font-semibold hover:bg-[#D4AF37] hover:text-[#1A1000] transition-all"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Get Directions
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/reservations')} className="flex-1 btn-primary">
              Make Another Reservation
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationConfirmationPage;
