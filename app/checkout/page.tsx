"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "",
  });

  // ইউজার লগইন থাকলে অটো-ফিল করা
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setForm({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              address: data.address || "",
              city: data.city || "",
            });
          }
        });
    }
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items: cart, total }),
      });

      if (res.ok) {
        setMessage("✅ অর্ডার সফল হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
        clearCart();
        setTimeout(() => router.push("/"), 3000);
      } else {
        setMessage("❌ অর্ডার করতে সমস্যা হয়েছে।");
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
        <Link href="/shop" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📦 Checkout</h1>

        {message && <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message}</div>}

        {/* অ্যাকাউন্ট থাকলে লগইন করার অপশন */}
        {status === "unauthenticated" && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 text-center">
            <p className="text-black mb-2">অ্যাকাউন্ট আছে? ডিটেইলস অটো-ফিল করতে লগইন করুন।</p>
            <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm inline-block">Login</Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-black">আপনার তথ্য দিন</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <input type="text" placeholder="আপনার নাম" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="email" placeholder="ইমেইল" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="tel" placeholder="মোবাইল নাম্বার" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="শহর (City)" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="w-full px-4 py-3 border rounded-lg" />
              <textarea placeholder="সম্পূর্ণ ডেলিভারি ঠিকানা" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required rows={3} className="w-full px-4 py-3 border rounded-lg" />
              
              <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400">
                {loading ? "অর্ডার প্রসেস হচ্ছে..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4 text-black">অর্ডার সামারি</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm text-black">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-semibold">৳ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center text-xl font-bold mt-4 text-black">
              <span>Total:</span>
              <span className="text-orange-500">৳ {total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}