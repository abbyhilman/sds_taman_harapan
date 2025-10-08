"use client";
import { useState } from "react";
import { BookOpen, Trophy, Heart, MapPin, X } from "lucide-react";

export default function Programs() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const programs = [
    {
      icon: BookOpen,
      title: "Akademik Unggulan",
      color: "from-blue-500 to-blue-600",
      items: [
        "Kurikulum Merdeka",
        "Pembelajaran Digital",
        "Kelas Maksimal 30 Siswa",
        "Metode Pembelajaran Interaktif",
      ],
    },
    {
      icon: Trophy,
      title: "Ekstrakurikuler",
      color: "from-green-500 to-green-600",
      items: [
        "Pramuka",
        "Tari Tradisional",
        "Pencak Silat",
        "Melukis",
        "Renang",
        "Olahraga",
      ],
    },
    {
      icon: Heart,
      title: "Pengembangan Karakter",
      color: "from-red-500 to-red-600",
      items: [
        "Pendidikan Karakter",
        "Leadership Training",
        "Community Service",
        "Pembiasaan Akhlak Mulia",
      ],
    },
    {
      icon: MapPin,
      title: "Study Tour & Field Trip",
      color: "from-orange-500 to-orange-600",
      items: [
        "Menghubungkan Teori dengan Praktik",
        "Menambah Wawasan Siswa",
        "Melatih Kemandirian",
        "Pengalaman Belajar Nyata",
      ],
    },
  ];

  return (
    <section
      id="programs"
      className="py-20 bg-gradient-to-br from-gray-50 to-orange-50 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Program Unggulan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kami menawarkan beragam program untuk mengembangkan potensi akademik,
            keterampilan, dan karakter siswa secara menyeluruh.
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-r ${program.color} p-6`}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {program.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {program.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="bg-orange-100 rounded-full p-1 mt-0.5">
                          <svg
                            className="h-3 w-3 text-orange-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gambar Tambahan */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Pembelajaran yang Menyenangkan dan Bermakna
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Setiap program dirancang untuk memberikan pengalaman belajar
                yang tidak hanya meningkatkan pengetahuan akademik, tetapi juga
                mengembangkan keterampilan sosial, kepemimpinan, dan karakter
                yang kuat.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  Kurikulum Merdeka
                </span>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  Pembelajaran Digital
                </span>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Pendidikan Karakter
                </span>
              </div>
            </div>

            {/* Dua Gambar Klikable */}
            <div className="grid grid-cols-2 gap-4">
              {[
                "images/img_ekstrakulikuler_satu.jpeg",
                "images/img_ekstrakulikuler_dua.jpeg",
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(src)}
                >
                  <img
                    src={src}
                    alt={`Kegiatan ${i + 1}`}
                    className="w-full h-48 object-cover group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup / Modal Gambar */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:bg-white transition"
            >
              <X className="h-5 w-5 text-gray-800" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
