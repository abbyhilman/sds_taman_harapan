import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const news: NewsItem[] = [
  {
    title: "Masa Pengenalan Lingkungan Sekolah (MPLS)",
    date: "Juli 2024",
    category: "Kegiatan Sekolah",
    description:
      "Kegiatan ini dilaksanakan pada awal tahun ajaran baru dan biasanya ditujukan untuk peserta didik baru. Tujuan MPLS antara lain: 1. Membantu siswa beradaptasi dengan lingkungan sekolah baru, baik dari sisi akademik, budaya sekolah, maupun pergaulan. 2. Menumbuhkan motivasi, semangat, dan cara belajar yang efektif untuk sukses di jenjang pendidikan baru. 3. Mengenali potensi diri siswa baru, sehingga guru dapat memberikan pembinaan yang tepat. 4. Mengenalkan aturan, tata tertib, hak, dan kewajiban siswa, termasuk nilai-nilai karakter dan budaya sekolah. 5. Menumbuhkan sikap positif seperti disiplin, tanggung jawab, kerja sama, dan kepedulian sosial. Jadi, MPLS bukan sekadar pengenalan gedung sekolah, tapi juga upaya membentuk karakter, kedisiplinan, dan semangat belajar sejak hari pertama.",
    image:
      "https://images.pexels.com/photos/8466664/pexels-photo-8466664.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: () => <></>,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "HUT Republik Indonesia Ke-80",
    date: "17 Agustus 2025",
    category: "Peringatan Nasional",
    description:
      "Pada 17 Agustus 2025 Indonesia merayakan 80 tahun kemerdekaan, sejak diproklamasikan oleh Ir. Soekarno dan Drs. Mohammad Hatta pada 17 Agustus 1945. Biasanya, peringatan HUT RI diramaikan dengan: Upacara bendera di sekolah, Perlombaan. Tahun 2025 akan menjadi momentum spesial, karena angka 80 tahun melambangkan perjalanan panjang bangsa dalam mempertahankan kemerdekaan dan membangun Indonesia maju.",
    image: "/images/img_lapangan.jpeg",
    icon: () => <></>,
    color: "",
  },
  {
    title: "Peringatan Hari Guru Nasional",
    date: "November 2024",
    category: "Peringatan Nasional",
    description:
      "Kegiatan peringatan Hari Guru Nasional dengan berbagai penghargaan untuk guru berprestasi dan acara apresiasi di SDS Taman Harapan.",
    image:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: () => <></>,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Lomba Lari Estafet Antar Kelas",
    date: "September 2024",
    category: "Kegiatan Sekolah",
    description:
      "Lomba lari estafet antar kelas yang diikuti oleh siswa dengan semangat tinggi untuk memeriahkan hari olahraga sekolah.",
    image:
      "https://images.pexels.com/photos/416322/pexels-photo-416322.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: () => <></>,
    color: "from-green-500 to-green-600",
  },
];

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const newsItem = news[parseInt(id || "0", 10)];

  if (!newsItem) {
    return <div>Berita tidak ditemukan</div>;
  }

  // Fungsi untuk merender deskripsi dengan format yang rapi
  const renderDescription = (description: string, title: string) => {
    if (title === "Masa Pengenalan Lingkungan Sekolah (MPLS)") {
      const [intro, goals, note] = description.split(
        "Tujuan MPLS antara lain: ",
        2
      );
      const [goalsList, summary] = goals.split(
        "Jadi, MPLS bukan sekadar pengenalan gedung sekolah",
        2
      );
      const goalsArray = goalsList
        .split(/(\d+\.\s)/)
        .filter((item) => !item.match(/\d+\.\s/))
        .filter((item) => item.trim() !== "");

      return (
        <>
          <p className="mb-4">{intro}</p>
          <p className="font-semibold mb-2">Tujuan MPLS antara lain:</p>
          <ul className="list-decimal list-inside mb-4 space-y-2">
            {goalsArray.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
          <p>
            Jadi, MPLS bukan sekadar pengenalan gedung sekolah{summary}
          </p>
        </>
      );
    } else if (title === "HUT Republik Indonesia Ke-80") {
      const [intro, activities, note] = description.split(
        "Biasanya, peringatan HUT RI diramaikan dengan: ",
        2
      );
      const [activitiesList, summary] = activities.split(
        "Tahun 2025 akan menjadi momentum spesial",
        2
      );
      const activitiesArray = activitiesList
        .split(", ")
        .filter((item) => item.trim() !== "");

      return (
        <>
          <p className="mb-4">{intro}</p>
          <p className="font-semibold mb-2">
            Biasanya, peringatan HUT RI diramaikan dengan:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            {activitiesArray.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          <p>Tahun 2025 akan menjadi momentum spesial{summary}</p>
        </>
      );
    }
    return <p className="text-gray-600 leading-relaxed">{description}</p>;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-orange-600 font-medium hover:text-orange-700"
        >
          Kembali
        </button>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 overflow-hidden">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${newsItem.color} opacity-40`}
            ></div>
            <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 inline mr-1" />
              {newsItem.date}
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {newsItem.title}
            </h1>
            <div className="text-gray-600 leading-relaxed mb-6">
              {renderDescription(newsItem.description, newsItem.title)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsDetail;