"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data) setForm(data);
        });
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("✅ প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } else {
      setMessage("❌ আপডেট করতে সমস্যা হয়েছে");
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">👤 My Profile</h1>
        
        {message && <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border p-3 rounded-lg" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email (পরিবর্তন করা যাবে না)</label>
            <input type="email" value={form.email} disabled className="w-full border p-3 rounded-lg bg-gray-100 text-gray-500" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input type="tel" value={form.phone || ""} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="017XXXXXXXX" className="w-full border p-3 rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold mb-1">City</label>
            <input type="text" value={form.city || ""} onChange={(e) => setForm({...form, city: e.target.value})} placeholder="Dhaka, Chittagong, ..." className="w-full border p-3 rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Full Address</label>
            <textarea value={form.address || ""} onChange={(e) => setForm({...form, address: e.target.value})} rows={3} placeholder="House, Road, Area..." className="w-full border p-3 rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-orange-500 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}