"use client";
import { useState, useEffect } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });
  const [gallery, setGallery] = useState<string[]>([]); // সব আপলোড করা ছবি
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // একটি ছবি আপলোড হ্যান্ডলার
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const newGallery = [...gallery, data.url];
        setGallery(newGallery);
        // প্রথম ছবিটি Main Image হবে
        if (newGallery.length === 1) {
          setForm((prev) => ({ ...prev, image: data.url }));
        }
        setMessage("✅ ছবি আপলোড সফল!");
      } else {
        setMessage("❌ ছবি আপলোড ব্যর্থ হয়েছে");
      }
    } catch (err) {
      setMessage("❌ ছবি আপলোডে সমস্যা হয়েছে");
    } finally {
      setUploading(false);
      e.target.value = ""; // একই ফাইল আবার সিলেক্ট করার সুযোগ
    }
  };

  // গ্যালারি থেকে ছবি মুছে ফেলা
  const removeFromGallery = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);
    // যদি মেইন ছবি মুছে যায়, তবে নতুন প্রথম ছবিটি মেইন হবে
    if (form.image === gallery[index]) {
      setForm((prev) => ({ ...prev, image: newGallery[0] || "" }));
    }
  };

  // মেইন ছবি সেট করা
  const setAsMainImage = (url: string) => {
    setForm((prev) => ({ ...prev, image: url }));
    setMessage("✅ মেইন ছবি সেট হয়েছে!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (gallery.length === 0) {
      setMessage("❌ অন্তত একটি ছবি আপলোড করুন");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("✅ প্রোডাক্ট সফলভাবে অ্যাড হয়েছে!");
      setForm({ name: "", description: "", price: "", image: "", category: "", stock: "" });
      setGallery([]);
      fetchProducts();
    } else {
      setMessage("❌ প্রোডাক্ট অ্যাড করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">🐾 PawMart Admin Panel</h1>

        {message && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4">{message}</div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4 text-black">নতুন প্রোডাক্ট অ্যাড করুন</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-black">
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border p-3 rounded-lg col-span-2 bg-white"
            />
            <input
              placeholder="Price (৳)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="border p-3 rounded-lg bg-white"
            />
            <input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="border p-3 rounded-lg bg-white"
            />
            <input
              placeholder="Category (Food, Toys, Beds)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="border p-3 rounded-lg col-span-2 bg-white"
            />

            {/* ইমেজ গ্যালারি সেকশন */}
            <div className="col-span-2">
              <label className="font-semibold text-sm mb-3 block">
                📷 প্রোডাক্টের ছবি ({gallery.length}টি আপলোড হয়েছে)
              </label>

              <div className="flex flex-wrap gap-4">
                {/* আপলোড হওয়া ছবিগুলো */}
                {gallery.map((url, index) => (
                  <div 
                    key={index} 
                    className={`relative w-32 h-32 rounded-lg overflow-hidden border-4 ${
                      form.image === url ? "border-orange-500" : "border-gray-200"
                    }`}
                  >
                    <img 
                      src={url} 
                      alt={`Product ${index}`} 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setAsMainImage(url)}
                    />
                    
                    {/* Remove বাটন */}
                    <button
                      type="button"
                      onClick={() => removeFromGallery(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold hover:bg-red-600"
                    >
                      ✕
                    </button>

                    {/* Main Image লেবেল */}
                    {form.image === url && (
                      <span className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-xs text-center py-1">
                        MAIN
                      </span>
                    )}
                  </div>
                ))}

                {/* Plus Icon (নতুন ছবি যোগ করার জন্য) */}
                <label className="cursor-pointer w-32 h-32 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <span className="text-2xl text-orange-500 font-bold">+</span>
                  </div>
                  <p className="text-xs text-gray-600">Add Photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploading && <p className="text-blue-500 mt-3 font-semibold">⏳ আপলোড হচ্ছে...</p>}
              {gallery.length > 0 && (
                <p className="text-xs text-gray-500 mt-3">
                  💡 যেকোনো ছবিতে ক্লিক করলে সেটি <strong>Main Image</strong> হিসেবে সেট হবে (কমলা বর্ডার দেখাবে)।
                </p>
              )}
            </div>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="border p-3 rounded-lg col-span-2 bg-white"
              rows={3}
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition col-span-2 disabled:bg-gray-400"
            >
              {uploading ? "অপেক্ষা করুন..." : "Add Product"}
            </button>
          </form>
        </div>

        <h2 className="text-xl font-bold mb-4 text-black">বর্তমান প্রোডাক্টসমূহ ({products.length})</h2>
        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm text-black">
              <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-2" />
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-orange-500 font-semibold">৳ {p.price}</p>
              <p className="text-sm text-gray-500">Stock: {p.stock}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}