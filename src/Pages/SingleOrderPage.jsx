import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { format } from "date-fns";
import { FaArrowLeft } from "react-icons/fa";
import useShoeStore from "../store/useShoeStore";

const SingleOrderPage = ({ orderId: propOrderId, isAdminView }) => {
  const params = useParams();
  const orderId = params.id || propOrderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shoeComponentsMap, setShoeComponentsMap] = useState({});

  const {fetchShoeById} = useShoeStore()

  //const isAdmin = user?.user?.role === 'admin';

  

  useEffect(() => {
    const fetchAndEnrichOrder = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/orders/${orderId}`);
        const enrichedOrder = await enrichOrderWithProductData(response.data);
        getShoeInfo(enrichedOrder)
        setOrder(enrichedOrder);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAndEnrichOrder();
    
  }, [orderId]);


  const enrichOrderWithProductData = async (order) => {
    if (!order?.items?.length) return { ...order, items: [] };
  
    try {
      const itemsWithDetails = await Promise.all(
        order.items.map(async (item) => {
          if (!item.product) return item;
  
          try {
            const endpoint = item.productType === 'shoe'
              ? `/shoes/${item.product.product}`
              : `/products/${item.product.product}`;
  
            const { data } = await axiosInstance.get(endpoint);
  
            return {
              ...item,
              product: {
                ...item.product,
                details: data,
              }
            };
          } catch (err) {
            console.error(`Failed to fetch product ${item.product}:`, err);
            return item; // Return item as-is if product fetch fails
          }
        })
      );
  
      return {
        ...order,
        items: itemsWithDetails
      };
    } catch (error) {
      console.error("Error enriching order:", error);
      return order;
    }
  };

  const getShoeInfo = async(order) =>{
    order?.items.forEach(async(item) => {
      if (item.product.productType === 'shoe') {
      const data = await fetchShoeById(item.product.product)
      setShoeComponentsMap(prev => ({
        ...prev,
        [item.product.product]: {
          name: data.name,
          soles: data.soleOptions,
          lasts: data.lastOptions,
          materials: data.materialOptions
        }
      }));
      }
    });
  }
  const getComponentName = (id, componentType, productId) => {
    

    if (!id || !shoeComponentsMap[productId]) return 'Not specified';


   
    const collection = shoeComponentsMap[productId][componentType];
    if(componentType === "name") return shoeComponentsMap[productId][componentType];
    if (!Array.isArray(collection)) return 'Unknown' 

    const component = collection.find(comp => comp._id === id || comp.id === id || comp.name);
    return component?.name || 'Unknown' ;
  };


  

  const getProductImage = (item) => {
    if (item.product.productType === 'magazine') {
      const coverImage = item.product?.details?.magazineData?.coverImage.url;
      return typeof coverImage === 'string' ? coverImage : coverImage?.url;
    }
    return item.product.variant.color.images[0].url || '/placeholder-product.jpg';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-b-transparent border-[#4B371C] rounded-full"></div>
      </div>
    );
  }

  

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-red-500 font-bold text-xl">{error}</h2>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-[#4B371C] text-white rounded">
          <FaArrowLeft className="inline-block mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isAdminView && (
        <div className="flex justify-between items-center py-4 gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex text-[#4B371C] items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      )}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
      </div>
      <div className="mb-6 flex justify-between items-center">
      <p className="text-sm text-gray-600">
          Placed on {format(new Date(order.createdAt), "dd MMM yyyy")}
        </p>
        </div>

      <div className="bg-gray-50 rounded-lg p-4 shadow mb-6">
        <h2 className="text-lg text-[#4B371C] font-semibold mb-2">Customer Info</h2>
        <p className="text-[#4B371C]"><strong>Name:</strong> {order.firstName} {order.lastName}</p>
        <p className="text-[#4B371C]"><strong>Email:</strong> {order.user.email}</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <h2 className="text-lg text-[#4B371C] font-semibold mb-4">Order Items</h2>
        {order.items.map(item => {
  const { product } = item;
  const { productType, details, variant } = product;

  return (
    <div key={item._id} className="flex items-center gap-4 mb-4 border-b pb-4">
      <img
        src={getProductImage(item)}
        alt={details?.name || 'Product image'}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        {/* Common Name */}
        <p className="font-medium text-[#4B371C]">
          {details?.name || getComponentName(item.product.product, 'name', item.product.product) }
          {productType === "magazine" && details?.magazineData?.issueNumber 
            ? ` – Issue #${details.magazineData.issueNumber}`
            : ""}
        </p>

        {/* Shoe-specific details */}
        {productType === "shoe" && variant && (
          <div className="text-sm text-[#4B371C] space-y-1">
            <p>Color: {variant.color?.name}</p>
            <p>Size: {variant.size}, Width: {variant.width}</p>
            <p>Last: {getComponentName(item.product.variant.last, 'lasts', item.product.product) || 'N/A'}</p>
            <p>Sole: {getComponentName(item.product.variant.sole, 'soles', item.product.product) || 'N/A'}</p>
            <p>Material: {getComponentName(item.product.variant.material, 'materials', item.product.product) || 'N/A'}</p>
          </div>
        )}

        {/* Common Quantity and Price */}
        <p className="text-sm text-[#4B371C] mt-2">Quantity: {item.quantity}</p>
        <p className="text-sm text-[#4B371C]">Price: ₦{item.price.toLocaleString()}</p>
      </div>
    </div>
  );
})}

      </div>

      {/* Add shipping, payment or status info if available */}
      {/* Example:
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <p>Payment: {order.isPaid ? "Paid" : "Not Paid"}</p>
        <p>Delivery: {order.isDelivered ? "Delivered" : "Pending"}</p>
      </div>
      */}
    </div>
  );
};

export default SingleOrderPage;
