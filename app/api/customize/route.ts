import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.customizationOrder.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching customization orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, requirements, measurements } = await request.json();

    // Find available designer (simplified - in production, use location-based matching)
    const designer = await prisma.designer.findFirst({
      where: { isAvailable: true },
    });

    const order = await prisma.customizationOrder.create({
      data: {
        userId: session.user.id,
        productId,
        designerId: designer?.id,
        requirements,
        measurements: measurements ? JSON.stringify(measurements) : null,
        status: designer ? 'assigned' : 'pending',
      },
      include: { product: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating customization order:', error);
    return NextResponse.json(
      { error: 'Failed to create customization order' },
      { status: 500 }
    );
  }
}

