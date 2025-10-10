"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsappButtonProps {
  phoneNumber: string;
  message?: string;
}

const FloatingWhatsappButton: React.FC<FloatingWhatsappButtonProps> = ({
  phoneNumber,
  message = "Halo! Saya ingin bertanya lebih lanjut.",
}) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center 
                 w-14 h-14 bg-green-500 rounded-full shadow-lg hover:scale-110 
                 transition-transform duration-300 md:w-16 md:h-16"
    >
      <MessageCircle className="text-white w-7 h-7 md:w-8 md:h-8" />
    </a>
  );
};

export default FloatingWhatsappButton;
