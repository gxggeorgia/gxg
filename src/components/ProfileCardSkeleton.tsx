export default function ProfileCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Image Skeleton */}
            <div className="aspect-[3/4] bg-gray-200 relative">
                <div className="absolute top-2 left-2 w-16 h-5 bg-gray-300 rounded-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-3 space-y-2">
                {/* Name and Age */}
                <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 rounded w-8" />
                </div>

                {/* Location */}
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>

                {/* Badges */}
                <div className="flex gap-1 pt-1">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
            </div>
        </div>
    );
}
