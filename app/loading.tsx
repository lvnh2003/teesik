export default function Loading() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-6"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
