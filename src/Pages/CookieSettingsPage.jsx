// pages/CookieSettingsPage.jsx
import toast from "react-hot-toast";
const CookieSettingsPage = () => {
    let consent = localStorage.getItem("cookieConsent");
  
    const handleUpdate = (choice) => {
      localStorage.setItem("cookieConsent", choice);
      window.dispatchEvent(new Event("cookieConsentUpdated"));
      toast.success(`Your preferences have been updated: ${choice}`);
    };

    consent = consent[0].toUpperCase() + consent.slice(1)
  
    
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Cookie Preferences</h1>
        <p className="mb-4">You previously selected: <strong>{consent || "no choice"}</strong></p>
        <div className="flex gap-4">
          <button onClick={() => handleUpdate("Accepted")} className="bg-black text-white px-4 py-2 rounded">
            Accept Cookies
          </button>
          <button onClick={() => handleUpdate("Rejected")} className="bg-gray-300 px-4 py-2 rounded">
            Reject Cookies
          </button>
        </div>
      </div>
    );
  };
  
  export default CookieSettingsPage;
  