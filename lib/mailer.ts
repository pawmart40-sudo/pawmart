import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// কাস্টমারকে অর্ডার কনফার্মেশন ইমেইল
export async function sendOrderConfirmation(
  to: string,
  orderId: string,
  total: number,
  items: any[]
) {
  const itemsList = items
    .map((i) => `<li>${i.name} × ${i.quantity} — ৳ ${i.price * i.quantity}</li>`)
    .join("");

  await transporter.sendMail({
    from: `"PawMart" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🐾 Order Confirmed — #${orderId.slice(-6)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #F97316;">🐾 PawMart</h2>
        <h3>Thank you for your order!</h3>
        <p>আপনার অর্ডারটি আমরা পেয়েছি। আমরা শীঘ্রই এটি প্রসেস করব।</p>
        <p><strong>Order ID:</strong> #${orderId.slice(-6)}</p>
        <p><strong>Total:</strong> ৳ ${total}</p>
        <h4>আপনার অর্ডারের আইটেমসমূহ:</h4>
        <ul>${itemsList}</ul>
        <p>প্রতিটি ধাপে আমরা আপনাকে ইমেইলে জানাব।</p>
        <p style="color: #888; font-size: 12px;">ধন্যবাদ, PawMart Team</p>
      </div>
    `,
  });
}

// আপনার কাছে (অ্যাডমিন) নতুন অর্ডারের নোটিফিকেশন
export async function sendAdminNotification(
  orderId: string,
  customer: any,
  total: number
) {
  await transporter.sendMail({
    from: `"PawMart Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🔔 New Order — #${orderId.slice(-6)}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #F97316;">🔔 নতুন অর্ডার এসেছে!</h2>
        <p><strong>Order ID:</strong> #${orderId.slice(-6)}</p>
        <p><strong>Customer:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Address:</strong> ${customer.address}</p>
        <p><strong>Total:</strong> ৳ ${total}</p>
      </div>
    `,
  });
}

// কাস্টমারকে ডেলিভারি ট্র্যাকিং লিঙ্ক পাঠানো
export async function sendTrackingLink(
  to: string,
  orderId: string,
  trackingLink: string
) {
  await transporter.sendMail({
    from: `"PawMart" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🚚 আপনার অর্ডার #${orderId.slice(-6)} পাঠানো হয়েছে`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #F97316;">🐾 PawMart</h2>
        <h3>আপনার অর্ডার পাঠানো হয়েছে! 🚚</h3>
        <p>Order ID: <strong>#${orderId.slice(-6)}</strong></p>
        <p>নিচের লিঙ্কে ক্লিক করে আপনার ডেলিভারি ট্র্যাক করতে পারবেন:</p>
        <p><a href="${trackingLink}" style="background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Track Delivery</a></p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">ধন্যবাদ, PawMart Team</p>
      </div>
    `,
  });
}
