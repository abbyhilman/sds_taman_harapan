import {
  AirVent,
  Monitor,
  BookOpen,
  Dumbbell,
  Projector,
  Heart,
} from "lucide-react";

export default function Facilities() {
  const facilities = [
    {
      icon: AirVent,
      title: "Ruang Kelas Ber-AC",
      description:
        "Kelas nyaman dengan pendingin udara untuk mendukung konsentrasi belajar siswa",
      image:
        "https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=800",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Monitor,
      title: "Lab Komputer",
      description:
        "Laboratorium komputer modern untuk pembelajaran teknologi dan digital",
      image:
        "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Projector,
      title: "Ruang Kelas Terpasang Proyektor",
      description:
        "Setiap kelas dilengkapi proyektor untuk pembelajaran interaktif dan multimedia",
      image:
        "https://images.pexels.com/photos/8466664/pexels-photo-8466664.jpeg?auto=compress&cs=tinysrgb&w=800",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: BookOpen,
      title: "Perpustakaan",
      description:
        "Perpustakaan dengan koleksi buku lengkap untuk menumbuhkan minat baca",
      image:
        "https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=800",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Dumbbell,
      title: "Lapangan Olahraga",
      description:
        "Area olahraga luas untuk aktivitas fisik dan ekstrakurikuler",
      image: "images/img_lapangan.jpeg",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Heart,
      title: "Unit Kesehatan Sekolah (UKS)",
      description:
        "Fasilitas kesehatan dengan peralatan medis untuk keamanan dan kesehatan siswa",
      image:
        "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
      color: "from-red-500 to-pink-600",
    },
  ];

  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Fasilitas Lengkap
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kami menyediakan fasilitas modern dan lengkap untuk mendukung proses
            pembelajaran yang optimal dan kenyamanan seluruh siswa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${facility.color} opacity-60 group-hover:opacity-50 transition-opacity`}
                  ></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 sm:p-8 lg:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Lingkungan Belajar yang Nyaman dan Aman
            </h3>
            <p className="text-gray-700 leading-relaxed mb-8 text-sm sm:text-base">
              Semua fasilitas kami dirancang dan dirawat dengan baik untuk
              menciptakan lingkungan belajar yang kondusif, aman, dan
              menyenangkan bagi seluruh siswa.
            </p>

            {/* Responsif grid section */}
            <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-6 sm:space-y-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Terawat</div>
              </div>

              {/* Divider hanya muncul di layar menengah ke atas */}
              <div className="hidden sm:block h-12 w-px bg-gray-300"></div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">Aman</div>
                <div className="text-sm text-gray-600 mt-1">Terjamin</div>
              </div>

              <div className="hidden sm:block h-12 w-px bg-gray-300"></div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">Modern</div>
                <div className="text-sm text-gray-600 mt-1">Terkini</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
