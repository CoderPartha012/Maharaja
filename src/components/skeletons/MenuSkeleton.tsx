const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden" aria-hidden="true">
    <div className="skeleton h-48 w-full" />
    <div className="p-6 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-2/3 rounded" />
        <div className="skeleton h-5 w-12 rounded" />
      </div>
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
      <div className="flex justify-between items-center pt-1">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-9 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

const SectionSkeleton = () => (
  <div className="mb-12">
    <div className="skeleton h-8 w-56 rounded mb-6" aria-hidden="true" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const MenuSkeleton = () => (
  <div className="pt-20 min-h-screen bg-[#FFF8DC]" role="status" aria-label="Loading menu…">
    <div className="container-custom py-12">
      <div className="skeleton h-12 w-48 rounded mx-auto mb-12" aria-hidden="true" />
      <div className="flex flex-wrap gap-4 mb-8 justify-center" aria-hidden="true">
        <div className="skeleton h-10 w-36 rounded-full" />
        <div className="skeleton h-10 w-40 rounded-full" />
      </div>
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  </div>
);

export default MenuSkeleton;
