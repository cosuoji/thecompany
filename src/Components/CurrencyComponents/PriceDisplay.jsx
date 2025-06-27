import { useCurrency } from "../../context/CurrencyContext";


// components/PriceDisplay.js
export  const PriceDisplay = ({ price, discountedPrice, className = '' }) => {
  const { currency, formatPrice } = useCurrency();

  return (
    <div className={`${className} flex items-center`}>
      {discountedPrice ? (
        <>
          <span className="text-current">
            {formatPrice(discountedPrice)}
          </span>
          <span className="ml-2 text-sm text-gray-500 line-through">
            {formatPrice(price)}
          </span>
        </>
      ) : (
        <span className="text-current">
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};
  
  export default PriceDisplay;