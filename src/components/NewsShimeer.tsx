export default function NewsShimmer() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-gray-300 mx-auto rounded mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 mx-auto rounded"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-200 w-full rounded"></div>
                <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
                <div className="h-10 bg-gray-300 w-40 rounded-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
