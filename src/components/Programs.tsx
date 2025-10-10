"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [learningSection, setLearningSection] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select("*")
        .order("order_position", { ascending: true });

      if (programsError) console.error("Error fetching programs:", programsError);

      const { data: learningData, error: learningError } = await supabase
        .from("learning_section")
        .select("*")
        .limit(1)
        .single();

      if (learningError) console.error("Error fetching learning section:", learningError);

      setPrograms(programsData || []);
      setLearningSection(learningData || null);
    };

    fetchData();
  }, []);

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          {programs.map((program) => {
            const items = program.description
              ? program.description.split(",").map((i: string) => i.trim())
              : [];

            return (
              <div
                key={program.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Background image section */}
                <div
                  className="relative h-32 flex items-center p-6"
                  style={{
                    backgroundImage: `url(${program.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="relative z-10 flex items-center space-x-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">
                      {program.name}
                    </h3>
                  </div>
                </div>

                {/* Description list */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {items.map((item: string, idx: number) => (
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

        {/* Learning Section */}
        {learningSection && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Text content */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {learningSection.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {learningSection.description}
                </p>

                {/* Tags */}
                {Array.isArray(learningSection.tags) && learningSection.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {learningSection.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Gambar dari Supabase (images: [{ image_url }]) */}
              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(learningSection.images) &&
                  learningSection.images.map(
                    (img: { image_url: string }, i: number) => (
                      <div
                        key={i}
                        className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
                        onClick={() => setSelectedImage(img.image_url)}
                      >
                        <img
                          src={img.image_url}
                          alt={`Kegiatan ${i + 1}`}
                          className="w-full h-48 object-cover group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Gambar */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
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
