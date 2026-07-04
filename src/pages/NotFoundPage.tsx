import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."
        canonicalPath="/404"
      />
      <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <p className="text-8xl font-bold text-[#D4AF37] mb-4">404</p>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't find the page you're looking for. Perhaps you'd like to explore our menu or
            make a reservation?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
            <Link
              to="/menu"
              className="px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
            >
              View Menu
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
