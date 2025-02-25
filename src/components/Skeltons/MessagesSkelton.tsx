
export const SkeletonCard = () => {
    return (
      <div className="p-4 mb-3 h-auto bg-gray-200 animate-pulse rounded-2xl">
        <div className="flex items-start gap-3">
          {/* Profile Image Skeleton */}
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          
          <div className="flex-1">
            {/* Subject & Time Skeleton */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="w-40 h-4 bg-gray-300 rounded"></div>
              <div className="w-20 h-3 bg-gray-300 rounded"></div>
            </div>
  
            {/* Status Badge Skeleton */}
            <div className="w-20 h-4 bg-gray-300 rounded-2xl"></div>
  
            {/* Description Skeleton */}
            <div className="mt-2 space-y-1">
              <div className="w-full h-3 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
  
          {/* Notification Badge Skeleton */}
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  };