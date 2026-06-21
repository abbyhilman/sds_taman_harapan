import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  School,
  Award,
  Mail,
  Phone,
} from "lucide-react";
import AppLoadingScreen from "../ui/AppLoadingScreen";

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
  "Guru Ekstrakurikuler": "Guru Ekstrakurikuler",
};

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("*")
          .eq("id", id)
          .single();

        if (teacherError) throw teacherError;
        if (!teacherData) {
          navigate("/");
          return;
        }

        // Fetch relations
        const { data: subjectsData } = await supabase
          .from("teacher_subjects")
          .select("teacher_id, subjects(name)")
          .eq("teacher_id", teacherData.id);

        const { data: classroomsData } = await supabase
          .from("teacher_classrooms")
          .select("teacher_id, classrooms(name)")
          .eq("teacher_id", teacherData.id);

        const { data: expertiseData } = await supabase
          .from("teacher_expertise")
          .select("teacher_id, expertise")
          .eq("teacher_id", teacherData.id);

        const mapped: Teacher = {
          ...teacherData,
          subjects:
            subjectsData
              ?.map((s) => (s as any).subjects?.name)
              .filter(Boolean) || [],
          classrooms:
            classroomsData
              ?.map((c) => (c as any).classrooms?.name)
              .filter(Boolean) || [],
          expertise: expertiseData?.map((e) => e.expertise) || [],
        };

        setTeacher(mapped);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        navigate("/");
      }
      setLoading(false);
    };

    fetchTeacher();
  }, [id, navigate]);

  if (loading) {
    return <AppLoadingScreen label="Memuat data pengajar..." />;
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Pengajar tidak ditemukan.</p>
      </div>
    );
  }

  const getDefaultPhoto = (position: string) => {
    if (position.includes("Kepala")) return "/images/guru-laki.png";
    return "/images/guru-wanita.png";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <img
                src={teacher.photo_url || getDefaultPhoto(teacher.position)}
                alt={teacher.full_name}
                className="w-40 h-40 rounded-full object-cover border-4 border-white/30 shadow-2xl"
              />
              <div className="text-center sm:text-left text-white">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {teacher.full_name}
                </h1>
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                  {positionLabels[teacher.position] || teacher.position}
                </span>
                {teacher.nip && (
                  <p className="text-cyan-100 text-sm">NIP: {teacher.nip}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            {teacher.bio && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-cyan-600" />
                  Bio
                </h3>
                <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
              </div>
            )}

            {/* Pendidikan & Asal Sekolah */}
            <div className="grid grid-cols-2 gap-4">
              {teacher.education && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center gap-2 text-cyan-600 mb-2">
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase">
                      Pendidikan
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{teacher.education}</p>
                </div>
              )}
              {teacher.alma_mater && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center gap-2 text-cyan-600 mb-2">
                    <School className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase">
                      Asal Sekolah
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{teacher.alma_mater}</p>
                </div>
              )}
            </div>

            {/* Mata Pelajaran */}
            {teacher.subjects.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-cyan-600" />
                  Mata Pelajaran
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 bg-cyan-50 text-cyan-700 text-sm rounded-xl font-medium"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Wali Kelas */}
            {teacher.classrooms.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <School className="h-5 w-5 text-cyan-600" />
                  Wali Kelas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.classrooms.map((cls, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-700 text-sm rounded-xl font-medium"
                    >
                      <School className="h-4 w-4 mr-2" />
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keahlian */}
            {teacher.expertise.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-cyan-600" />
                  Keahlian
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 text-sm rounded-xl font-medium"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Informasi Singkat
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400">Jabatan</span>
                  <p className="font-medium text-gray-900">
                    {positionLabels[teacher.position] || teacher.position}
                  </p>
                </div>
                {teacher.education && (
                  <div>
                    <span className="text-xs text-gray-400">Pendidikan</span>
                    <p className="font-medium text-gray-900">{teacher.education}</p>
                  </div>
                )}
                {teacher.alma_mater && (
                  <div>
                    <span className="text-xs text-gray-400">Asal Sekolah</span>
                    <p className="font-medium text-gray-900">{teacher.alma_mater}</p>
                  </div>
                )}
                {teacher.subjects.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-400">Mengajar</span>
                    <p className="font-medium text-gray-900">
                      {teacher.subjects.join(", ")}
                    </p>
                  </div>
                )}
                {teacher.classrooms.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-400">Wali Kelas</span>
                    <p className="font-medium text-gray-900">
                      {teacher.classrooms.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-md">
              <h3 className="font-bold mb-4">Hubungi Sekolah</h3>
              <div className="space-y-3">
                <a
                  href="tel:+6287789164894"
                  className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-sm">(+62) 87789164894</span>
                </a>
                <a
                  href="mailto:sdstamanharapan_jakut@yahoo.com"
                  className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">sdstamanharapan_jakut@yahoo.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
