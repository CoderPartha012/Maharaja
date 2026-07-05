import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, MessageSquare } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const HCAPTCHA_SITE_KEY =
  (import.meta.env.VITE_HCAPTCHA_SITE_KEY as string | undefined) ??
  '10000000-ffff-ffff-ffff-000000000001'; // hCaptcha test key

const todayIso = () => new Date().toISOString().split('T')[0]!;

const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Enter at least 10 digits')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  date: z
    .string()
    .min(1, 'Please select a date')
    .refine((val) => val >= todayIso(), 'Date must be today or in the future'),
  time: z.string().min(1, 'Please select a time slot'),
  guests: z.coerce.number().int().min(1).max(8),
  specialRequests: z.string().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

const LUNCH_SLOTS = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
const DINNER_SLOTS = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

const formatTimeSlot = (t: string): string => {
  const parts = t.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
};

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="field-error" role="alert">
      {message}
    </p>
  ) : null;

interface ReservationPageProps {
  onSuccess?: (data: ReservationFormData) => void;
}

const ReservationPage = ({ onSuccess }: ReservationPageProps = {}) => {
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const pendingData = useRef<ReservationFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: { guests: 2 },
  });

  const submitData = async (data: ReservationFormData, captchaToken: string) => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (onSuccess) {
      await onSuccess(data);
      setIsSubmitting(false);
      return;
    }

    const { data: result, error } = await supabase.functions.invoke<{ id: string }>(
      'submit-reservation',
      {
        body: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          date: data.date,
          time: data.time,
          party_size: data.guests,
          special_requests: data.specialRequests || null,
          captchaToken,
        },
      }
    );

    setIsSubmitting(false);

    if (error || !result?.id) {
      setSubmitError('Unable to complete your reservation. Please try again or call us directly.');
      captchaRef.current?.resetCaptcha();
      setTimeout(() => errorRef.current?.focus(), 50);
      return;
    }

    navigate('/reservations/confirmation', {
      state: {
        id: result.id,
        name: data.name,
        date: data.date,
        time: data.time,
        guests: data.guests,
        email: data.email || null,
      },
    });
  };

  const onCaptchaVerify = (token: string) => {
    const data = pendingData.current;
    if (data) {
      pendingData.current = null;
      void submitData(data, token);
    }
  };

  const onSubmit = (data: ReservationFormData) => {
    if (onSuccess) {
      void submitData(data, '');
      return;
    }
    pendingData.current = data;
    captchaRef.current?.execute();
  };

  const retry = () => {
    setSubmitError(null);
    void handleSubmit(onSubmit)();
  };

  return (
    <>
      <SEO
        title="Reserve a Table"
        description="Book a table at Maharaja. Choose your date, time, and party size for an unforgettable authentic Indian dining experience in Delhi."
        canonicalPath="/reservations"
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC]">
        <div className="container-custom py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Reserve Your Table</h1>

          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            {submitError && (
              <div
                ref={errorRef}
                role="alert"
                tabIndex={-1}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg focus:outline-none"
              >
                <p className="text-red-700 text-sm">{submitError}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-2 text-sm text-red-700 font-medium underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="res-name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    autoComplete="name"
                    aria-required="true"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                    {...register('name')}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                <div>
                  <label
                    htmlFor="res-phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    autoComplete="tel"
                    aria-required="true"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                    {...register('phone')}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>
              </div>

              <div>
                <label htmlFor="res-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email{' '}
                  <span className="text-gray-400 font-normal text-xs">
                    (confirmation sent here)
                  </span>
                </label>
                <input
                  id="res-email"
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                  {...register('email')}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="res-date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
                    Date <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    min={todayIso()}
                    aria-required="true"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                    {...register('date')}
                  />
                  <FieldError message={errors.date?.message} />
                </div>

                <div>
                  <label
                    htmlFor="res-time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Clock className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
                    Time <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="res-time"
                    aria-required="true"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                    {...register('time')}
                  >
                    <option value="">Select a time slot</option>
                    <optgroup label="Lunch (12:00 PM – 2:30 PM)">
                      {LUNCH_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {formatTimeSlot(t)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Dinner (7:00 PM – 9:30 PM)">
                      {DINNER_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {formatTimeSlot(t)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <FieldError message={errors.time?.message} />
                </div>
              </div>

              <div>
                <label
                  htmlFor="res-guests"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Users className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
                  Number of Guests <span aria-hidden="true">*</span>
                </label>
                <select
                  id="res-guests"
                  aria-required="true"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                  {...register('guests')}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="res-special"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <MessageSquare className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
                  Special Requests
                </label>
                <textarea
                  id="res-special"
                  rows={4}
                  placeholder="Any special requirements or preferences?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                  {...register('specialRequests')}
                />
              </div>

              <HCaptcha
                sitekey={HCAPTCHA_SITE_KEY}
                size="invisible"
                ref={captchaRef}
                onVerify={onCaptchaVerify}
                onError={() => setSubmitError('CAPTCHA verification failed. Please try again.')}
              />

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span
                    className="w-4 h-4 border-2 border-[#1A1000]/30 border-t-[#1A1000] rounded-full animate-spin"
                    aria-hidden="true"
                  />
                )}
                {isSubmitting ? 'Confirming…' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationPage;
