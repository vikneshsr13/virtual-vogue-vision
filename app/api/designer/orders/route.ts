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

    // Check if user is a designer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { designer: true },
    });

    if (!user || user.role !== 'designer' || !user.designer) {
      return NextResponse.json({ error: 'Not a designer' }, { status: 403 });
    }

    // Get all customization orders (both assigned and unassigned)
    const orders = await prisma.customizationOrder.findMany({
      include: {
        product: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching designer orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

