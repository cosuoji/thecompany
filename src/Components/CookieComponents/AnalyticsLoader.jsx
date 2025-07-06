// components/AnalyticsLoader.jsx
import { useEffect } from "react";

const AnalyticsLoader = () => {
  useEffect(() => {
    const loadAnalytics = () => {
      const consent = localStorage.getItem("cookieConsent");
      if (consent === "accepted" && !window.gtag) {
        const script1 = document.createElement("script");
        script1.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
        script1.async = true;
        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXX');
        `;
        document.head.appendChild(script2);
      }
    };

    loadAnalytics();
    window.addEventListener("cookieConsentUpdated", loadAnalytics);
    return () => {
      window.removeEventListener("cookieConsentUpdated", loadAnalytics);
    };
  }, []);

  return null;
};

export default AnalyticsLoader;

//🔁 Replace G-XXXXXXX with your GA ID