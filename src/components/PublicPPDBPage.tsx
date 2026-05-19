import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  School,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PublicPPDBForm = {
  student_name: string;
  nickname: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  religion: string;
  previous_school: string;
  desired_grade: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  address: string;
  notes: string;
  website: string;
};

type Notice = {
  title: string;
  description: string;
  type: "success" | "error";
};

const initialForm: PublicPPDBForm = {
  student_name: "",
  nickname: "",
  gender: "Laki-laki",
  birth_place: "",
  birth_date: "",
  religion: "Islam",
  previous_school: "",
  desired_grade: "Kelas 1",
  parent_name: "",
  parent_phone: "",
  parent_email: "",
  address: "",
  notes: "",
  website: "",
};

const generateRegistrationNumber = () =>
  `PPDB-2026-${Date.now().toString().slice(-7)}`;

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Pendaftaran belum bisa dikirim. Silakan coba lagi.";

export default function PublicPPDBPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNumber, setSubmittedNumber] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const updateForm = (key: keyof PublicPPDBForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (form.website.trim()) return false;

    const requiredFields = [
      form.student_name,
      form.gender,
      form.birth_date,
      form.desired_grade,
      form.parent_name,
      form.parent_phone,
      form.address,
    ];

    return requiredFields.every((value) => value.trim().length > 0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!validateForm()) {
      setNotice({
        title: "Data belum lengkap",
        description:
          "Mohon lengkapi nama siswa, tanggal lahir, kelas, data wali, dan alamat.",
        type: "error",
      });
      return;
    }

    const registrationNumber = generateRegistrationNumber();
    const timestamp = new Date().toISOString();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("ppdb_registrations").insert([
        {
          registration_number: registrationNumber,
          student_name: form.student_name.trim(),
          nickname: form.nickname.trim(),
          gender: form.gender,
          birth_place: form.birth_place.trim(),
          birth_date: form.birth_date,
          religion: form.religion.trim(),
          previous_school: form.previous_school.trim(),
          desired_grade: form.desired_grade,
          parent_name: form.parent_name.trim(),
          parent_phone: form.parent_phone.trim(),
          parent_email: form.parent_email.trim(),
          address: form.address.trim(),
          status: "baru",
          notes: form.notes.trim(),
          submitted_at: timestamp,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ]);

      if (error) throw error;

      setSubmittedNumber(registrationNumber);
      setForm(initialForm);
      setNotice({
        title: "Pendaftaran terkirim",
        description: "Data PPDB berhasil dikirim ke admin sekolah.",
        type: "success",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setNotice({
        title: "Gagal mengirim pendaftaran",
        description: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedNumber) {
    return (
      <main className="min-h-screen bg-[#eefbff] px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-2xl items-center">
          <section className="w-full rounded-2xl bg-white p-6 text-center shadow-xl shadow-cyan-100/80 sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-5 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-700">
              PPDB {currentYear}
            </p>
            <h1 className="mt-4 text-2xl font-bold text-gray-950 sm:text-3xl">
              Pendaftaran berhasil dikirim
            </h1>
            <p className="mt-3 text-gray-600">Nomor pendaftaran Anda adalah:</p>
            <p className="mt-3 rounded-xl bg-gray-100 px-4 py-3 font-mono text-lg font-bold text-gray-950">
              {submittedNumber}
            </p>
            <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-left text-sm text-cyan-900">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <p>
                  Admin SDS Taman Harapan akan melakukan verifikasi dan
                  menghubungi orang tua/wali melalui nomor WhatsApp yang
                  didaftarkan.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  setSubmittedNumber("");
                  setNotice(null);
                }}
                className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
              >
                Daftar Siswa Lain
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eefbff] px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="flex flex-col justify-between rounded-2xl bg-cyan-500 p-6 text-white shadow-xl shadow-cyan-100 sm:p-8">
          <div>
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-700">
              PPDB 2026
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              Formulir Penerimaan Peserta Didik Baru
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base">
              Daftarkan putra-putri Anda ke SDS Taman Harapan. Isi data dengan
              benar agar admin dapat memverifikasi pendaftaran lebih cepat.
            </p>
          </div>

          <div className="my-8 flex justify-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-white p-4 shadow-2xl">
              <img
                src="/images/logo_tamhar.png"
                alt="Logo SDS Taman Harapan"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <InfoPill icon={<School className="h-4 w-4" />} title="Jenjang SD" description="Kelas 1 sampai 6" />
            <InfoPill icon={<Sparkles className="h-4 w-4" />} title="Respons Cepat" description="Admin cek data masuk" />
            <InfoPill icon={<ShieldCheck className="h-4 w-4" />} title="Data Aman" description="Hanya admin yang membaca" />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-xl shadow-cyan-100/80 sm:p-7">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">
              Data Calon Peserta Didik
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Field bertanda wajib perlu dilengkapi sebelum formulir dikirim.
            </p>
          </div>

          {notice && (
            <div
              className={`mt-5 rounded-xl border p-4 text-sm ${
                notice.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">{notice.title}</p>
                  <p className="mt-1">{notice.description}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => updateForm("website", event.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama Lengkap Siswa *" id="student_name">
                <TextInput
                  id="student_name"
                  value={form.student_name}
                  onChange={(value) => updateForm("student_name", value)}
                  placeholder="Nama sesuai akta"
                  required
                />
              </Field>
              <Field label="Nama Panggilan" id="nickname">
                <TextInput
                  id="nickname"
                  value={form.nickname}
                  onChange={(value) => updateForm("nickname", value)}
                  placeholder="Opsional"
                />
              </Field>
              <Field label="Jenis Kelamin *" id="gender">
                <SelectInput
                  id="gender"
                  value={form.gender}
                  onChange={(value) => updateForm("gender", value)}
                  options={["Laki-laki", "Perempuan"]}
                />
              </Field>
              <Field label="Tanggal Lahir *" id="birth_date">
                <TextInput
                  id="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={(value) => updateForm("birth_date", value)}
                  required
                />
              </Field>
              <Field label="Tempat Lahir" id="birth_place">
                <TextInput
                  id="birth_place"
                  value={form.birth_place}
                  onChange={(value) => updateForm("birth_place", value)}
                  placeholder="Kota kelahiran"
                />
              </Field>
              <Field label="Agama" id="religion">
                <TextInput
                  id="religion"
                  value={form.religion}
                  onChange={(value) => updateForm("religion", value)}
                />
              </Field>
              <Field label="Rencana Kelas *" id="desired_grade">
                <SelectInput
                  id="desired_grade"
                  value={form.desired_grade}
                  onChange={(value) => updateForm("desired_grade", value)}
                  options={["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"]}
                />
              </Field>
              <Field label="Asal Sekolah" id="previous_school">
                <TextInput
                  id="previous_school"
                  value={form.previous_school}
                  onChange={(value) => updateForm("previous_school", value)}
                  placeholder="TK/SD asal"
                />
              </Field>
              <Field label="Nama Orang Tua/Wali *" id="parent_name">
                <TextInput
                  id="parent_name"
                  value={form.parent_name}
                  onChange={(value) => updateForm("parent_name", value)}
                  required
                />
              </Field>
              <Field label="Nomor WhatsApp *" id="parent_phone">
                <TextInput
                  id="parent_phone"
                  value={form.parent_phone}
                  onChange={(value) => updateForm("parent_phone", value)}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </Field>
              <Field label="Email Orang Tua/Wali" id="parent_email" className="sm:col-span-2">
                <TextInput
                  id="parent_email"
                  type="email"
                  value={form.parent_email}
                  onChange={(value) => updateForm("parent_email", value)}
                  placeholder="nama@email.com"
                />
              </Field>
              <Field label="Alamat Domisili *" id="address" className="sm:col-span-2">
                <TextareaInput
                  id="address"
                  value={form.address}
                  onChange={(value) => updateForm("address", value)}
                  required
                />
              </Field>
              <Field label="Catatan Tambahan" id="notes" className="sm:col-span-2">
                <TextareaInput
                  id="notes"
                  value={form.notes}
                  onChange={(value) => updateForm("notes", value)}
                  placeholder="Kebutuhan khusus, pertanyaan, atau catatan untuk admin"
                />
              </Field>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-900">
              Pastikan nomor WhatsApp aktif karena informasi verifikasi dan
              tindak lanjut pendaftaran akan dikirim melalui nomor yang
              dicantumkan.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-6 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              Kirim Pendaftaran
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  id,
  children,
  className,
}: {
  label: string;
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-gray-800">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
    />
  );
}

function TextareaInput({
  id,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      rows={3}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
    />
  );
}

function SelectInput({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function InfoPill({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white/15 p-4 backdrop-blur">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-cyan-700">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  );
}
