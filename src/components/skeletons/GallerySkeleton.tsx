const GallerySkeleton = () => (
  <div className="pt-20 min-h-screen bg-[#FFF8DC]" role="status" aria-label="Loading gallery…">
    <div className="container-custom py-12">
      <div className="skeleton h-12 w-80 rounded mx-auto mb-12" aria-hidden="true" />

      {/* Filter pills */}
      <div className="flex justify-center gap-4 mb-8" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-full" />
        ))}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="skeleton h-64 w-full" />
            <div className="p-4">
              <div className="skeleton h-4 w-3/5 rounded mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default GallerySkeleton;
