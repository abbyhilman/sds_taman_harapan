// src/utils/formatDescription.ts
export type FormattedDescription = {
  intro: string;
  points: string[];
  conclusion: string;
};

/**
 * Format raw description menjadi objek konsisten:
 * { intro, points, conclusion }
 */
export function formatDescription(raw?: string | null): FormattedDescription {
  if (!raw || typeof raw !== "string") {
    return { intro: "", points: [], conclusion: "" };
  }

  // Normalisasi whitespace
  const text = raw.replace(/\s+/g, " ").trim();

  // Trigger untuk bagian daftar dan trigger untuk kalimat penutup
  const listTriggerRegex = /\b(Tujuan[^:]{0,100}:|Biasanya[^:]{0,100}:|Kegiatan[^:]{0,100}:|Acara[^:]{0,100}:|Peringatan[^:]{0,100}:)/i;
  const conclusionRegex = /(📌\s*|Jadi,|Kesimpulannya,|Tahun\s+\d{4}\s+akan\s+menjadi)/i;

  let intro = "";
  let points: string[] = [];
  let conclusion = "";

  const triggerMatch = listTriggerRegex.exec(text);

  if (triggerMatch && typeof triggerMatch.index === "number") {
    // intro = sebelum trigger
    intro = text.slice(0, triggerMatch.index).trim();

    // after = teks setelah trigger
    const after = text.slice(triggerMatch.index + triggerMatch[0].length).trim();

    // pisah bagian list dan conclusion (jika ada)
    const concMatch = conclusionRegex.exec(after);
    let listSection = after;
    if (concMatch && typeof concMatch.index === "number") {
      listSection = after.slice(0, concMatch.index).trim();
      conclusion = after.slice(concMatch.index).trim(); // menyertakan kata pemicu (mis. "Tahun 2025 akan menjadi...")
    }

    // 1) coba split berdasarkan angka "1. 2. 3."
    points = listSection.split(/\d+\.\s*/).map(s => s.trim()).filter(Boolean);

    // 2) kalau tidak cukup poin, coba pemisah umum (newline, bullet, koma, dash, titik koma)
    if (points.length <= 1) {
      const alt = listSection.split(/\n|•|-|;|, /).map(s => s.trim()).filter(Boolean);
      if (alt.length > 1) {
        points = alt;
      } else {
        // 3) fallback: coba ambil fragmen berdasarkan awal huruf kapital (heuristik)
        const caps = listSection.match(/[A-Z][^A-Z\.!?]*/g);
        if (caps && caps.length > 1) points = caps.map(s => s.trim()).filter(Boolean);
      }
    }
  } else {
    // Tidak ada trigger; coba cari daftar bernomor di mana saja
    const numbered = text.split(/\d+\.\s*/).map(s => s.trim()).filter(Boolean);
    if (numbered.length > 1) {
      intro = numbered[0];
      points = numbered.slice(1);
    } else {
      // benar-benar fallback: treat whole text as intro
      intro = text;
    }
  }

  return { intro, points, conclusion };
}
