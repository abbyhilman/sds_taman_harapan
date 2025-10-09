import { Calendar, ArrowRight, Users, Flag } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function News() {
  const news = [
    {
      title: 'Masa Pengenalan Lingkungan Sekolah (MPLS)',
      date: 'Juli 2024',
      category: 'Kegiatan Sekolah',
      description: 'Kegiatan MPLS untuk siswa baru tahun ajaran 2024/2025 berlangsung meriah. Siswa baru diperkenalkan dengan lingkungan sekolah, tata tertib, dan berbagai kegiatan positif untuk membangun semangat belajar.',
      image: 'https://images.pexels.com/photos/8466664/pexels-photo-8466664.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'HUT Republik Indonesia Ke-80',
      date: 'Agustus 2024',
      category: 'Peringatan Nasional',
      description: 'Perayaan HUT RI ke-80 di SDS Taman Harapan diisi dengan berbagai lomba, upacara bendera, dan kegiatan yang menumbuhkan semangat nasionalisme dan cinta tanah air kepada seluruh siswa.',
      image: 'images/img_welcome_dua.png',
      icon: Flag,
      color: 'from-red-500 to-red-600'
    }
  ];

    const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSeeAllNews = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/all-news');
      setIsLoading(false);
    }, 1000); // Simulate loading delay for shimmer effect
  };

  return (
    <section id="news" className="py-20 bg-gradient-to-br from-orange-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Berita Terbaru
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ikuti perkembangan dan aktivitas terkini di SDS Taman Harapan.
            Kami selalu aktif dalam berbagai kegiatan edukatif dan pembentukan karakter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {news.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-40`}></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">{item.date}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
                  <button className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group">
                    Baca Selengkapnya
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button onClick={handleSeeAllNews} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl">
            Lihat Semua Berita
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
