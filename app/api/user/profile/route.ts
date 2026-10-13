import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET: ইউজারের প্রোফাইল ডেটা আনা
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, phone: true, address: true, city: true } as any,
  });

  return NextResponse.json(user);
}

// PUT: ইউজারের প্রোফাইল আপডেট করা
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: body.name,
      phone: body.phone,
      address: body.address,
      city: body.city,
    } as any, // TypeScript error এড়ানোর জন্য
  });

  return NextResponse.json(updatedUser);
}