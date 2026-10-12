"use client";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ status: "", trackingLink: "" });

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("✅ অর্ডার আপডেট হয়েছে!");
      setEditing(null);
      fetchOrders();
    } else {
      setMessage("❌ আপডেট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">📦 Order Management</h1>

        {message && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4">{message}</div>
        )}

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">এখনো কোনো অর্ডার আসেনি।</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-black">
                  <p className="font-bold text-black">Order #{o.id.slice(-6)}</p>
                  <p className="text-sm text-gray-800">Total: ৳ {o.total}</p>
                  <p className="text-sm text-gray-800">Items: {o.items.length}</p>
                  <p className="text-sm text-gray-800">Email: {o.customerEmail || "N/A"}</p> {/* <-- নতুন লাইন */}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      o.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      o.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                      o.status === "SHIPPED" ? "bg-orange-100 text-orange-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {o.status}
                    </span>
                    <p className="text-sm text-gray-800 mt-2">{o.trackingLink || "No tracking link"}</p>
                  </div>
                </div>

                {editing === o.id ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full border p-2 rounded mb-2 text-gray-900 bg-white"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Tracking Link (যেমন: Pathao/Steadfast লিঙ্ক)"
                      value={form.trackingLink}
                      onChange={(e) => setForm({ ...form, trackingLink: e.target.value })}
                      className="w-full border p-2 rounded mb-2 text-gray-900 bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(o.id)}
                        className="bg-orange-500 text-white px-4 py-2 rounded font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="bg-gray-300 px-4 py-2 rounded font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(o.id);
                      setForm({ status: o.status, trackingLink: o.trackingLink || "" });
                    }}
                    className="text-orange-500 font-semibold hover:underline"
                  >
                    ✏️ Update Status & Tracking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}