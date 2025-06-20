import { useState, useEffect } from "react";

export const ImageKitDebugger = () => {
    const [authResponse, setAuthResponse] = useState(null);
    const [error, setError] = useState(null);
  
    const testAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/imagekit`);
        const text = await response.text();
        
        try {
          const data = JSON.parse(text);
          setAuthResponse(data);
          setError(null);
        } catch (e) {
          setError(`JSON Parse Error: ${e.message}`);
          setAuthResponse(text);
        }
      } catch (err) {
        setError(err.message);
      }
    };
  
    useEffect(() => {
      testAuth();
    }, []);
  
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg max-w-xs text-xs">
        <h3 className="font-bold mb-2">ImageKit Debug</h3>
        <button 
          onClick={testAuth}
          className="mb-2 px-2 py-1 bg-blue-100 text-blue-800 rounded"
        >
          Test Auth Endpoint
        </button>
        
        {error && (
          <div className="text-red-600 mb-2">
            Error: {error}
          </div>
        )}
        
        <div className="max-h-40 overflow-auto">
          <pre className="text-xs">
            {JSON.stringify(authResponse, null, 2)}
          </pre>
        </div>
      </div>
    );
  };