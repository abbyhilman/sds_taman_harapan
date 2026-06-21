import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  X,
  ChevronRight,
  Award,
} from "lucide-react";
import NewsShimmer from "./NewsShimeer";

interface Teacher {
  id: string;
  photo_url: string;
  full_name: string;
  nip: string;
  position: string;
  education: string;
  alma_mater: string;
  bio: string;
  is_active: boolean;
  display_order: number;
  subjects: string[];
  classrooms: string[];
  expertise: string[];
}

const positionLabels: Record<string, string> = {
  "Kepala Sekolah": "Kepala Sekolah",
  "Wakil Kepala Sekolah": "Wakil Kepala Sekolah",
  "Wali Kelas": "Wali Kelas",
  "Guru Mata Pelajaran": "Guru Mata Pelajaran",
  "Guru Pendamping": "Guru Pendamping",
};

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const { data: teachersData, error: teachersError } = await supabase
          .from("teachers")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .order("full_name", { ascending: true });

        if (teachersError) throw teachersError;

        const { data: subjectsData } = await supabase
          .from("teacher_subjects")
          .select("teacher_id, subjects(name)")
          .in(
            "teacher_id",
            (teachersData || []).map((t) => t.id)
          );

        const { data: classroomsData } = await supabase
          .from("teacher_classrooms")
          .select("teacher_id, classrooms(name)")
          .in(
            "teacher_id",
            (teachersData || []).map((t) => t.id)
          );

        const { data: expertiseData } = await supabase
          .from("teacher_expertise")
          .select("teacher_id, expertise")
          .in(
            "teacher_id",
            (teachersData || []).map((t) => t.id)
          );

        const mapped: Teacher[] = (teachersData || []).map((teacher) => ({
          ...teacher,
          subjects:
            subjectsData
              ?.filter((s) => s.teacher_id === teacher.id)
              .map((s) => (s as any).subjects?.name)
              .filter(Boolean) || [],
          classrooms:
            classroomsData
              ?.filter((c) => c.teacher_id === teacher.id)
              .map((c) => (c as any).classrooms?.name)
              .filter(Boolean) || [],
          expertise:
            expertiseData
              ?.filter((e) => e.teacher_id === teacher.id)
              .map((e) => e.expertise) || [],
        }));

        setTeachers(mapped);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
      setLoading(false);
    };

    fetchTeachers();
  }, []);

  const positions = ["Semua", ...Object.keys(positionLabels)].filter(
    (pos) => pos === "Semua" || teachers.some((t) => t.position === pos)
  );

  const filteredTeachers =
    activeFilter === "Semua"
      ? teachers
      : teachers.filter((t) => t.position === activeFilter);

  const getDefaultPhoto = (position: string) => {
    if (position.includes("Kepala")) return "/images/guru-laki.png";
    return "/images/guru-wanita.png";
  };

  const uniqueSubjects = Array.from(
    new Set(teachers.flatMap((t) => t.subjects))
  ).length;

  return (
    <section id="teachers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tim Pengajar
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tenaga pendidik profesional dan berdedikasi tinggi yang siap
            membimbing siswa meraih prestasi terbaik.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setActiveFilter(pos)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === pos
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 border border-gray-200"
              }`}
            >
              {positionLabels[pos] || pos}
            </button>
          ))}
        </div>

        {loading ? (
          <NewsShimmer />
        ) : (
          <>
            {/* Teacher Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <div className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={teacher.photo_url || getDefaultPhoto(teacher.position)}
                        alt={teacher.full_name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-cyan-100 group-hover:border-cyan-300 transition-colors"
                      />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                        {positionLabels[teacher.position] || teacher.position}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {teacher.full_name}
                    </h3>
                    {teacher.subjects.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-3">
                        {teacher.subjects.slice(0, 3).map((subject, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded-md"
                          >
                            <BookOpen className="h-3 w-3 mr-1" />
                            {subject}
                          </span>
                        ))}
                        {teacher.subjects.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{teacher.subjects.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    {teacher.classrooms.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {teacher.classrooms.slice(0, 2).map((cls, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-md"
                          >
                            <School className="h-3 w-3 mr-1" />
                            {cls}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-center text-cyan-600 text-sm font-medium group-hover:text-cyan-700">
                      Lihat Detail
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Belum ada data pengajar untuk kategori ini.
                </p>
              </div>
            )}

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-3xl font-bold text-cyan-600">
                  {teachers.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Pengajar</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-3xl font-bold text-orange-600">
                  {uniqueSubjects}
                </div>
                <div className="text-sm text-gray-600 mt-1">Mata Pelajaran</div>
              </div>
              <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 text-center shadow-md">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Bersertifikat</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-8 text-white rounded-t-2xl">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-6">
                <img
                  src={
                    selectedTeacher.photo_url ||
                    getDefaultPhoto(selectedTeacher.position)
                  }
                  alt={selectedTeacher.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
                />
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedTeacher.full_name}
                  </h3>
                  <p className="text-cyan-100 mt-1">
                    {positionLabels[selectedTeacher.position] ||
                      selectedTeacher.position}
                  </p>
                  {selectedTeacher.nip && (
                    <p className="text-cyan-200 text-sm mt-1">
                      NIP: {selectedTeacher.nip}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedTeacher.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Bio
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTeacher.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedTeacher.education && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-cyan-600 mb-1">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">
                        Pendidikan
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {selectedTeacher.education}
                    </p>
                  </div>
                )}
                {selectedTeacher.alma_mater && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-cyan-600 mb-1">
                      <School className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">
                        Asal Sekolah
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {selectedTeacher.alma_mater}
                    </p>
                  </div>
                )}
              </div>

              {selectedTeacher.subjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Mata Pelajaran
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 bg-cyan-50 text-cyan-700 text-sm rounded-lg"
                      >
                        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTeacher.classrooms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Wali Kelas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.classrooms.map((cls, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm rounded-lg"
                      >
                        <School className="h-3.5 w-3.5 mr-1.5" />
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTeacher.expertise.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Keahlian
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-lg"
                      >
                        <Award className="h-3.5 w-3.5 mr-1.5" />
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
