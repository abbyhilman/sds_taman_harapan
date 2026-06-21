import { useEffect, useState } from "react";
import { Target, Compass, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Skeleton } from "../ui/Skeleton";

export default function About() {
  const [about, setAbout] = useState<any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: aboutData, error: aboutError } = await supabase
          .from("about_us")
          .select("*")
          .single();
        if (!aboutError && aboutData) setAbout(aboutData);

        const { data: photoData, error: photoError } = await supabase
          .from("tentang_kami_photos")
          .select("image_url")
          .order("order_position", { ascending: true })
          .limit(1)
          .maybeSingle();
        if (!photoError && photoData?.image_url) setPhoto(photoData.image_url);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 py-12">
            <p>Konten tentang kami sedang disiapkan.</p>
          </div>
        </div>
      </section>
    );
  }

  const missionPoints = about.mission
    ? about.mission
        .split(/,\s+(?=[A-Z])/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    : [];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tentang Sekolah Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {about.description ||
              "SDS Taman Harapan berkomitmen memberikan pendidikan berkualitas dengan pendekatan holistik."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <img
                src={photo || "/images/img_guru_wanita.jpeg"}
                alt="Foto Sekolah"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg flex-shrink-0">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Kepala Sekolah</h3>
                  <p className="text-gray-700 font-medium">
                    {about.principal_name || "Sri Hendrawati, S.Pd"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Memimpin dengan dedikasi untuk mewujudkan visi sekolah dalam mencetak generasi unggul.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Visi Kami</h3>
                  <p className="text-white/90 leading-relaxed">
                    {about.vision ||
                      "Terwujudnya sekolah berkualitas dalam mencetak generasi berkarakter."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {missionPoints.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl">
                <Compass className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Misi Sekolah</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {missionPoints.map((point: string, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}