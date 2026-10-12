import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/mailer";

// GET: সব অর্ডার দেখা
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}

// POST: নতুন অর্ডার তৈরি করা
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, total } = body;

    // ১. ডেটাবেসে অর্ডার সেভ করা
    const order = await prisma.order.create({
      data: {
        customerEmail: customer.email,
        total: parseFloat(total),
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // ২. কাস্টমারকে কনফার্মেশন ইমেইল পাঠানো
    try {
      await sendOrderConfirmation(customer.email, order.id, total, items);
      await sendAdminNotification(order.id, customer, total);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({ 
      message: "Order placed successfully", 
      orderId: order.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ message: "Error placing order" }, { status: 500 });
  }
}