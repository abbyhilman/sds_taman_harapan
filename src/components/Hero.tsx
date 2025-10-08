import { ArrowRight, MapPin } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export default function Hero({ setActiveSection }: HeroProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <section id="home" className="pt-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/bg_tamhar.png"
          alt="Background"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-orange-100">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Warakas, Jakarta Utara</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              Membangun Generasi Cerdas, Berkarakter, dan Berakhlak Mulia
            </h1>

            <p className="text-lg text-white/95 leading-relaxed drop-shadow">
              Untuk masa depan Indonesia yang gemilang. SDS Taman Harapan berkomitmen memberikan pendidikan
              berkualitas dengan pendekatan holistik.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('about')}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/95 backdrop-blur-sm text-blue-700 font-semibold rounded-full border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md"
              >
                Hubungi Kami
              </button>
            </div>

            
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm overflow-hidden shadow-2xl border-4 border-white/20">
              <img
                src="src/assets/images/img_welcome_dua.png"
                alt="Siswa SDS Taman Harapan"
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="text-sm text-gray-600">Akreditasi</div>
              <div className="text-2xl font-bold text-orange-600">A</div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
