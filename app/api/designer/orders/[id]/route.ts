import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { status, trackingNumber, estimatedCompletion } = await request.json();

    const order = await prisma.customizationOrder.update({
      where: { id: params.id },
      data: {
        status,
        designerId: user.designer.id,
        ...(trackingNumber && { trackingNumber }),
        ...(estimatedCompletion && { estimatedCompletion: new Date(estimatedCompletion) }),
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

