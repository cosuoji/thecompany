// Components/CurrencyComponents/CurrencySwitcher.js
import { useCurrency } from "../../context/CurrencyContext";

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  
  return (
    <div className="relative group">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="appearance-none bg-transparent border-none pl-2 pr-6 py-1 text-[#E6DACD] focus:outline-none focus:ring-0 cursor-pointer"
      >
        <option value="NGN" className="bg-[#4B371C] text-[#E6DACD]">₦</option>
        <option value="USD" className="bg-[#4B371C] text-[#E6DACD]">$</option>
        <option value="GBP" className="bg-[#4B371C] text-[#E6DACD]">£</option>
      </select>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#E6DACD]">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </div>
      
      {/* Currency symbol indicator */}
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#E6DACD]">
        {/* {currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : '£'} */}
      </span>
    </div>
  );
};

export default CurrencySwitcher;