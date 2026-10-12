import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendTrackingLink } from "@/lib/mailer";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const order = await prisma.order.update({
      where: { id: id },
      data: {
        status: body.status,
        trackingLink: body.trackingLink,
      },
    });

    // যদি স্ট্যাটাস SHIPPED হয় এবং ট্র্যাকিং লিঙ্ক দেওয়া হয়, তবে কাস্টমারকে ইমেইল পাঠান
    if (body.trackingLink && body.status === "SHIPPED" && order.customerEmail) {
      try {
        await sendTrackingLink(
          order.customerEmail,
          order.id,
          body.trackingLink
        );
      } catch (err) {
        console.error("Tracking email failed:", err);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Error updating order" }, { status: 500 });
  }
}