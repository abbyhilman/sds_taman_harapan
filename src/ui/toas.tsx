import React, { useEffect, useState } from "react";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Toast akan hilang setelah 3 detik
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        variant === "destructive"
          ? "bg-red-600 text-white"
          : "bg-gray-800 text-white"
      }`}
    >
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};