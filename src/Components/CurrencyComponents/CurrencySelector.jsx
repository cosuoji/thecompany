import { useCurrency } from "../../context/CurrencyContext";


export const CurrencySelector = () => {
    const { currency, setCurrency, isLoadingRates, lastUpdated } = useCurrency();
    
    return (
      <div className="currency-selector-container">
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          disabled={isLoadingRates}
          className="currency-selector"
        >
          <option value="NGN">₦ NGN</option>
          <option value="USD">$ USD</option>
        </select>
        
        {isLoadingRates && (
          <span className="loading-indicator">Updating rates...</span>
        )}
        
        {lastUpdated && !isLoadingRates && (
          <span className="rate-update-time">
            Rates updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
    );
  };