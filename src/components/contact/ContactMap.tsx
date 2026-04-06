import React from "react";

export const ContactMap: React.FC = () => {
  return (
    <div className="bg-zinc-200 rounded-2xl min-h-[400px] flex flex-col overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.682983!2d3.7047!3d43.4981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b6b0c5e63f4e4d%3A0x0!2s7%20Rue%20Andr%C3%A9%20Marie%20Amp%C3%A8re%2C%2034770%20Gigean!5e0!3m2!1sfr!2sfr!4v1709500000000"
        width="100%"
        height="350"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-t-2xl"
      />
      <div className="bg-white p-4 text-center">
        <h3 className="text-lg font-black text-brand-red mb-1">YASSAUTO MKLF</h3>
        <p className="text-zinc-600 text-sm">
          7 rue André Marie Ampère, 34770 Gigean
        </p>
        <a
          href="https://maps.app.goo.gl/79vPS7FCQyuf3Pge6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-5 py-2 rounded-lg bg-brand-red text-white font-bold hover:bg-red-700 transition"
        >
          Voir sur Google Maps
        </a>
      </div>
    </div>
  );
};
