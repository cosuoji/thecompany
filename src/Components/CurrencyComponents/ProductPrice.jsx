import { useCurrency } from "../../context/CurrencyContext";


export const ProductPrice = ({ price }) => {
    const { 
      currency, 
      formatPrice, 
      exchangeRates,
      isLoadingRates 
    } = useCurrency();
    
    if (isLoadingRates) {
      return <div className="price-loading">Loading price...</div>;
    }
  
    return (
      <div className="product-price" data-currency={currency}>
        <div className="current-price">
          {formatPrice(price)}
        </div>
        {currency !== 'NGN' && (
          <div className="original-price">
            (~₦{price.toLocaleString('en-NG')})
          </div>
        )}
      </div>
    );
  };
  