export function WhatsAppFloatingButton() {
  const whatsappNumber = '21651747882'; // remplace par le vrai numéro (format international, sans +)

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-2xl hover:scale-105 transition-transform"
      aria-label="Contacter sur WhatsApp"
    >
      💬
    </a>
  );
}
