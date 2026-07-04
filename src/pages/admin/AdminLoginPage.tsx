import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UtensilsCrossed, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/admin/reservations';

  useEffect(() => {
    if (session) navigate(from, { replace: true });
  }, [session, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) setSubmitError(error);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 bg-[#D4AF37]/10 rounded-2xl mb-4">
            <UtensilsCrossed className="w-7 h-7 text-[#D4AF37]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white">Maharaja Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage reservations</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {submitError && (
            <div
              role="alert"
              className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-lg px-4 py-2"
            >
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                aria-required="true"
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder-gray-500"
                placeholder="admin@maharajarestaurant.in"
                {...register('email')}
              />
              {errors.email && (
                <p role="alert" className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                aria-required="true"
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                {...register('password')}
              />
              {errors.password && (
                <p role="alert" className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#D4AF37] text-[#1A1000] font-semibold rounded-lg hover:bg-[#c4a030] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500">
            Forgot password?{' '}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline"
            >
              Reset via Supabase Dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
