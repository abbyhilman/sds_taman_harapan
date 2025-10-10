import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState, FormEvent } from "react";
import { supabase } from "../lib/supabase"; // ✅ tambahkan ini

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      setSubmitMessage(
        "Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda."
      );
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error(error);
      setSubmitMessage("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => setSubmitMessage(""), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      content: "Jl. Warakas V Gg. 2 No.141, RT.6/RW.8",
      subcontent: "Jakarta Utara, 14340",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Phone,
      title: "Telepon",
      content: "(021) 4357611",
      subcontent: "Senin - Jumat: 07:00 - 15:00 WIB",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Mail,
      title: "Email",
      // ✅ dua email, hanya satu bisa diklik
      content: (
        <>
          <a
            href="mailto:sdstamanharapan.jakut@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            sdstamanharapan.jakut@gmail.com
          </a>
          <br />
          <span className="text-gray-600">sdstamanharapan.info@gmail.com</span>
        </>
      ),
      subcontent: "Kami akan membalas dalam 1x24 jam",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      content: "Senin - Jumat",
      subcontent: "07:00 - 15:00 WIB",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ada pertanyaan tentang pendaftaran atau ingin mengetahui lebih
            lanjut? Jangan ragu untuk menghubungi kami. Kami siap membantu Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`bg-gradient-to-r ${info.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-700 font-medium text-sm">
                  {info.content}
                </p>
                <p className="text-gray-500 text-xs mt-1">{info.subcontent}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 lg:p-10 text-white">
            <h3 className="text-2xl font-bold mb-4">Kirim Pesan</h3>
            <p className="text-white/90 mb-8">
              Isi formulir di bawah ini dan kami akan menghubungi Anda sesegera
              mungkin.
            </p>

            {submitMessage && (
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 mb-6">
                <p className="text-white text-sm">{submitMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="08xx xxxx xxxx"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Pesan *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                  placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-orange-600 font-semibold py-4 rounded-lg hover:bg-orange-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>KIRIM</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7934.080615546756!2d106.8822884278641!3d-6.125278190588009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1fdb644f7325%3A0x2395a8e01a13e94f!2sSDS%20Taman%20Harapan!5e0!3m2!1sen!2sid!4v1759938720644!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Kunjungi Sekolah Kami
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Kami mengundang Anda untuk mengunjungi sekolah kami dan melihat
                langsung fasilitas serta lingkungan belajar yang kami tawarkan.
                Tim kami siap memberikan tur sekolah dan menjawab semua
                pertanyaan Anda.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-600 rounded-full p-1 mt-1">
                    <svg
                      className="h-3 w-3 text-white"
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
                  <span className="text-gray-700">
                    Tur sekolah gratis dengan perjanjian
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-600 rounded-full p-1 mt-1">
                    <svg
                      className="h-3 w-3 text-white"
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
                  <span className="text-gray-700">
                    Konsultasi pendidikan dengan kepala sekolah
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-600 rounded-full p-1 mt-1">
                    <svg
                      className="h-3 w-3 text-white"
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
                  <span className="text-gray-700">
                    Informasi lengkap biaya pendidikan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
