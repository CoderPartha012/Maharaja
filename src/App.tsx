import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/SkipLink';
import MenuSkeleton from './components/skeletons/MenuSkeleton';
import GallerySkeleton from './components/skeletons/GallerySkeleton';
import AuthGuard from './components/admin/AuthGuard';
import CartDrawer from './components/CartDrawer';
import { AuthProvider } from './lib/auth';
import { CartProvider } from './lib/cart';

// Public pages — route-level code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const ReservationPage = lazy(() => import('./pages/ReservationPage'));
const ReservationConfirmationPage = lazy(() => import('./pages/ReservationConfirmationPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));

// Admin pages — separate chunk group
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminReservationsPage = lazy(() => import('./pages/admin/AdminReservationsPage'));
const AdminUpcomingPage = lazy(() => import('./pages/admin/AdminUpcomingPage'));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'));

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

const RouteProgressBar = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    NProgress.start();
    window.scrollTo(0, 0);
    NProgress.done();
  }, [pathname]);

  return null;
};

const PageFallback = () => (
  <div
    className="pt-20 min-h-screen bg-[#FFF8DC] flex items-center justify-center"
    aria-busy="true"
  >
    <div className="text-center">
      <div
        className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"
        aria-hidden="true"
      />
      <p className="text-gray-600 sr-only">Loading page…</p>
    </div>
  </div>
);

const AdminFallback = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center" aria-busy="true">
    <div
      className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"
      aria-hidden="true"
    />
  </div>
);

function App() {
  return (
    <Router>
      <CartProvider>
        <AuthProvider>
          <RouteProgressBar />
          <Routes>
            {/* ── Admin routes (dark theme, no public Navbar/Footer) ── */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLoginPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/reservations"
              element={
                <AuthGuard>
                  <Suspense fallback={<AdminFallback />}>
                    <AdminReservationsPage />
                  </Suspense>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/upcoming"
              element={
                <AuthGuard>
                  <Suspense fallback={<AdminFallback />}>
                    <AdminUpcomingPage />
                  </Suspense>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <AuthGuard>
                  <Suspense fallback={<AdminFallback />}>
                    <AdminMessagesPage />
                  </Suspense>
                </AuthGuard>
              }
            />

            {/* ── Public routes (with Navbar + Footer) ── */}
            <Route
              path="*"
              element={
                <ErrorBoundary>
                  <SkipLink />
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <CartDrawer />
                    <main id="main-content" className="flex-grow" tabIndex={-1}>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <HomePage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/menu"
                          element={
                            <Suspense fallback={<MenuSkeleton />}>
                              <MenuPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/reservations"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <ReservationPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/reservations/confirmation"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <ReservationConfirmationPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/gallery"
                          element={
                            <Suspense fallback={<GallerySkeleton />}>
                              <GalleryPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/contact"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <ContactPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/order/checkout"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <CheckoutPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/order/confirmation"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <OrderConfirmationPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="/help"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <HelpPage />
                            </Suspense>
                          }
                        />
                        <Route
                          path="*"
                          element={
                            <Suspense fallback={<PageFallback />}>
                              <NotFoundPage />
                            </Suspense>
                          }
                        />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </ErrorBoundary>
              }
            />
          </Routes>
        </AuthProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
