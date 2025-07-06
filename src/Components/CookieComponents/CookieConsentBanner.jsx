// components/CookieConsentBanner.jsx
import { useEffect, useState } from "react";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem("cookieConsent", choice);
    setVisible(false);
    window.dispatchEvent(new Event("cookieConsentUpdated")); // Used by analytics loader
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-[#1a1a1a] text-white p-4 z-50 shadow-md">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-sm">
          We use cookies to enhance your experience and analyze traffic. You can manage your preferences anytime.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleConsent("accepted")}
            className="bg-white text-black px-3 py-1 rounded text-sm"
          >
            Accept
          </button>
          <button
            onClick={() => handleConsent("rejected")}
            className="bg-transparent border border-white px-3 py-1 rounded text-sm"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
