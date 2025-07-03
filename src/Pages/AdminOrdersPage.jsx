import { useEffect, useState } from "react";
import AdminTable from "../Components/AdminTable";
import axiosInstance from "../lib/axios";
import SingleOrderModal from "../Components/SingleOrderModal";
import toast from "react-hot-toast";



const STATUS_FLOW = ["pending", "shipped", "delivered"];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const perPage = 10;

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get("/orders");
      const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
      setOrders(data);
      setFiltered(data);
    })();
  }, [refreshToggle]);

  useEffect(() => {
    let result = [...orders];

    if (search) {
      result = result.filter(o => 
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) result = result.filter(o => o.status === statusFilter);
    if (startDate) result = result.filter(o => new Date(o.createdAt) >= new Date(startDate));
    if (endDate) result = result.filter(o => new Date(o.createdAt) <= new Date(endDate));

    setFiltered(result);
    setPage(1);
  }, [search, statusFilter, startDate, endDate, orders]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const cycleStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1) return current;
    return STATUS_FLOW[(idx + 1) % STATUS_FLOW.length];
  };

  const handleRowAction = async (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;
    const nextStatus = cycleStatus(order.status);
    try {
       await axiosInstance.put(`/orders/${orderId}/status-cycle`);
      console.log(`Send email: Order ${orderId} marked ${nextStatus}`);
      setRefreshToggle(t => !t);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleToggleCancel = async (order) => {
    try {
      if (order.isCancelled) {
        // Restore logic — you may need a dedicated backend route, or re-enable status cycling
        await axiosInstance.put(`/orders/${order._id}/cancel`);
      } else {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        await axiosInstance.put(`/orders/${order._id}/cancel`);
      }
      setRefreshToggle(t => !t);
    } catch (err) {
        console.log(err)
      console.error("Failed to update order", err);
      toast(err?.response?.data || "Something went wrong");
    }
  };

  
const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderModal(true);
  };

  const columns = [
    { key: "orderNumber", label: "Order #" },
    { key: "user.email", label: "Customer" },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Date",
      render: o => new Date(o.createdAt).toLocaleDateString("en-GB"),
    },
    {
      key: "total",
      label: "Total (₦)",
      render: o => `₦${o.total.toLocaleString()}`,
    },
    {
        key: "actions",
        label: "Actions",
        render: (o) => (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleViewDetails(o._id)}
              className="text-sm text-blue-600 hover:underline"
            >
              View Details
            </button>
      
            {!o.isCancelled && (
              <button
                className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                onClick={() => handleRowAction(o._id)}
              >
                {o.status === "delivered" ? "Reset to Pending" : `Mark ${cycleStatus(o.status)}`}
              </button>
            )}
      
            <button
              className={`px-2 py-1 text-xs rounded ${
                o.status === "cancelled" ? "bg-yellow-500 text-white" : "bg-red-600 text-white"
              }`}
              onClick={() => handleToggleCancel(o)}
            >
              {o.isCancelled  ? "Restore" : "Cancel"}
            </button>
          </div>
        ),
      }
      
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Search order#/email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_FLOW.concat("cancelled").map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="border px-3 py-2 rounded" value={startDate} onChange={e=>setStartDate(e.target.value)} />
        <input type="date" className="border px-3 py-2 rounded" value={endDate} onChange={e=>setEndDate(e.target.value)} />
      </div>

      <AdminTable columns={columns} data={paginated} onViewDetails={handleViewDetails}/>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i+1 ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

        {showOrderModal && selectedOrderId && (
        <SingleOrderModal
            orderId={selectedOrderId}
            onClose={() => setShowOrderModal(false)}
        />
        )}

    </div>
  );
};

export default AdminOrdersPage;
