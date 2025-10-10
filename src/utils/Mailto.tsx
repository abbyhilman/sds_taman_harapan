"use client";
import React from "react";

interface MailtoProps {
  email: string;
  subject?: string;
  body?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Komponen Mailto:
 * Membuka aplikasi email default dengan isi prefilled.
 * Aman dari XSS (escape encode otomatis).
 *
 * Contoh penggunaan:
 * <Mailto
 *   email="admin@tamhar.sch.id"
 *   subject="Pertanyaan tentang Pendaftaran"
 *   body="Halo Admin, saya ingin menanyakan..."
 * >
 *   <button className="btn-primary">Hubungi Kami</button>
 * </Mailto>
 */

const Mailto: React.FC<MailtoProps> = ({
  email,
  subject = "",
  body = "",
  children,
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Escape special characters
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const mailtoUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;

    window.location.href = mailtoUrl;
  };

  return (
    <span
      onClick={handleClick}
      className={`cursor-pointer hover:underline ${className || ""}`}
    >
      {children}
    </span>
  );
};

export default Mailto;
