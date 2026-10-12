"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: cart,
          total: total,
        }),
      });

      if (res.ok) {
        setMessage("✅ অর্ডার সফল হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।");
        clearCart();
        setTimeout(() => router.push("/"), 3000); // ৩ সেকেন্ড পর হোম পেজে চলে যাবে
      } else {
        setMessage("❌ অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      setMessage("❌ সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !message) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">🛒 আপনার কার্ট খালি</h1>
        <Link href="/shop" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">📦 Checkout</h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">আপনার তথ্য দিন</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="আপনার নাম"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500"
              />
              <input
                type="email"
                placeholder="ইমেইল ঠিকানা"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500"
              />
              <input
                type="tel"
                placeholder="মোবাইল নাম্বার (যেমন: 017XXXXXXXX)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500"
              />
              <textarea
                placeholder="সম্পূর্ণ ডেলিভারি ঠিকানা"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
              >
                {loading ? "অর্ডার প্রসেস হচ্ছে..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">অর্ডার সামারি</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-semibold">৳ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center text-xl font-bold mt-4">
              <span>Total:</span>
              <span className="text-orange-500">৳ {total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}