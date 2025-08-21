import { Link } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import SEO from '../SEO';


const OrdersPage = () => {
  const {orders, loading } = useUserStore();

  if (loading) return <div className="text-[#B6B09F]">Loading orders...</div>;


  return (
    <div>
            <SEO 
              title="My Orders"
              description="My Orders"
              url="https://yourdomain.com/blog"
            />
      <h1 className="text-2xl font-bold text-[#EAE4D5] mb-6">Order History</h1>

      {loading ? (
        <p className="text-[#B6B09F]">Loading orders...</p>
      ) : orders?.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-[#B6B09F]/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#EAE4D5]">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-[#B6B09F]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#EAE4D5] font-medium">
                    ₦{order?.total?.toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    order.status === 'delivered' ? 'text-green-500' : 
                    order.status === 'cancelled' ? 'text-red-500' : 
                    'text-[#B6B09F]'
                  }`}>
                    {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to={`/account/orders/${order._id}`}
                  className="text-sm text-[#4B371C] hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#B6B09F]">
          <p>You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="mt-2 inline-block text-[#4B371C] hover:underline"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
