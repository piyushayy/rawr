export const SkeletonCard = () => {
  return (
    <div className="group block relative animate-pulse">
      {/* Image Placeholder */}
      <div className="relative aspect-[3/4] overflow-hidden border-2 border-transparent bg-gray-200" />

      {/* Content Placeholder */}
      <div className="mt-3 flex justify-between items-start">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-5 bg-gray-200 w-3/4" />
          {/* Subtitle */}
          <div className="h-3 bg-gray-100 w-1/2" />
        </div>
        <div className="flex flex-col items-end space-y-1">
          {/* Price */}
          <div className="h-5 bg-gray-200 w-16" />
        </div>
      </div>
    </div>
  );
};
