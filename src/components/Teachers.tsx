import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  Users,
  GraduationCap,
  BookOpen,
  School,
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
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
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
                  onClick={() => navigate(`/teachers/${teacher.id}`)}
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

        {/* Organizational Chart Section */}
        {!loading && teachers.length > 0 && (
              <div className="mt-16">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Struktur Organisasi Pengajar
                  </h3>
                  <p className="text-gray-600">
                    Hierarki dan pembagian tugas tenaga pengajar SDS Taman Harapan
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="space-y-6">
                    {/* Kepala Sekolah */}
                    {teachers.filter((t) => t.position === "Kepala Sekolah").length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                          Kepala Sekolah
                        </h4>
                        <div className="flex flex-wrap justify-center gap-4">
                          {teachers
                            .filter((t) => t.position === "Kepala Sekolah")
                            .map((teacher) => (
                              <OrgChartCard
                                key={teacher.id}
                                teacher={teacher}
                                color="from-red-500 to-orange-500"
                                onClick={() => navigate(`/teachers/${teacher.id}`)}
                              />
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Wakil Kepala Sekolah */}
                    {teachers.filter((t) => t.position === "Wakil Kepala Sekolah").length > 0 && (
                      <>
                        <div className="flex justify-center">
                          <div className="w-0.5 h-6 bg-gray-300"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                            Wakil Kepala Sekolah
                          </h4>
                          <div className="flex flex-wrap justify-center gap-4">
                            {teachers
                              .filter((t) => t.position === "Wakil Kepala Sekolah")
                              .map((teacher) => (
                                <OrgChartCard
                                  key={teacher.id}
                                  teacher={teacher}
                                  color="from-orange-500 to-amber-500"
                                  onClick={() => navigate(`/teachers/${teacher.id}`)}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Wali Kelas */}
                    {teachers.filter((t) => t.position === "Wali Kelas").length > 0 && (
                      <>
                        <div className="flex justify-center">
                          <div className="w-0.5 h-6 bg-gray-300"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                            Wali Kelas
                          </h4>
                          <div className="flex flex-wrap justify-center gap-4">
                            {teachers
                              .filter((t) => t.position === "Wali Kelas")
                              .map((teacher) => (
                                <OrgChartCard
                                  key={teacher.id}
                                  teacher={teacher}
                                  color="from-cyan-500 to-blue-500"
                                  onClick={() => navigate(`/teachers/${teacher.id}`)}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Guru Mata Pelajaran */}
                    {teachers.filter((t) => t.position === "Guru Mata Pelajaran").length > 0 && (
                      <>
                        <div className="flex justify-center">
                          <div className="w-0.5 h-6 bg-gray-300"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                            Guru Mata Pelajaran
                          </h4>
                          <div className="flex flex-wrap justify-center gap-4">
                            {teachers
                              .filter((t) => t.position === "Guru Mata Pelajaran")
                              .map((teacher) => (
                                <OrgChartCard
                                  key={teacher.id}
                                  teacher={teacher}
                                  color="from-green-500 to-teal-500"
                                  onClick={() => navigate(`/teachers/${teacher.id}`)}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Guru Pendamping */}
                    {teachers.filter((t) => t.position === "Guru Pendamping").length > 0 && (
                      <>
                        <div className="flex justify-center">
                          <div className="w-0.5 h-6 bg-gray-300"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                            Guru Pendamping
                          </h4>
                          <div className="flex flex-wrap justify-center gap-4">
                            {teachers
                              .filter((t) => t.position === "Guru Pendamping")
                              .map((teacher) => (
                                <OrgChartCard
                                  key={teacher.id}
                                  teacher={teacher}
                                  color="from-purple-500 to-pink-500"
                                  onClick={() => navigate(`/teachers/${teacher.id}`)}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface OrgChartCardProps {
  teacher: Teacher;
  color: string;
  onClick: () => void;
}

function OrgChartCard({ teacher, color, onClick }: OrgChartCardProps) {
  const getDefaultPhoto = (position: string) => {
    if (position.includes("Kepala")) return "/images/guru-laki.png";
    return "/images/guru-wanita.png";
  };

  return (
    <button
      onClick={onClick}
      className="group bg-white border-2 border-gray-200 hover:border-cyan-400 rounded-xl p-4 text-center transition-all duration-300 hover:shadow-lg cursor-pointer max-w-[200px]"
    >
      <img
        src={teacher.photo_url || getDefaultPhoto(teacher.position)}
        alt={teacher.full_name}
        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-cyan-300 mx-auto mb-2 transition-colors"
      />
      <h5 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
        {teacher.full_name}
      </h5>
      <span
        className={`inline-block text-xs text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${color}`}
      >
        {positionLabels[teacher.position] || teacher.position}
      </span>
      {teacher.classrooms.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {teacher.classrooms.slice(0, 2).join(", ")}
        </p>
      )}
    </button>
  );
}
