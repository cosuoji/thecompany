// context/CurrencyContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Initialize from localStorage or default to NGN
    return localStorage.getItem('currency') || 'NGN';
  });
  
  const [exchangeRates, setExchangeRates] = useState({
    NGN: 1,
    USD: 0.00067, // Fallback rates in case API fails
  });

  const currencySymbols = {
    NGN: '₦',
    USD: '$',
  };
  
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setIsLoadingRates(true);
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        setExchangeRates({
          NGN: 1,
          USD: data.rates.USD,
        });
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch exchange rates, using fallback:", error);
      } finally {
        setIsLoadingRates(false);
      }
    };

    // Fetch immediately and then every hour
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 3600000); // 1 hour
    
    return () => clearInterval(interval);
  }, []);

  // Update localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const formatPrice = (price) => {
    if (isLoadingRates) return 'Loading...';
  
    const rate = exchangeRates[currency] || 1;
    const convertedPrice = price * rate;
  
    const formattedNumber = new Intl.NumberFormat('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice);

    return `${currencySymbols[currency] || ''}${formattedNumber}`;

  };

  
  
  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        setCurrency, 
        formatPrice,
        exchangeRates,
        isLoadingRates,
        lastUpdated
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);