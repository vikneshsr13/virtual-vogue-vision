import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { chatWithAssistant } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required', response: 'Please enter a message to chat with me!' },
        { status: 400 }
      );
    }

    // Get user context for better recommendations
    const wardrobeItems = await prisma.wardrobeItem.findMany({
      where: { userId: session.user.id },
      take: 10,
    });

    const recentOrders = await prisma.order.findMany({
      where: { userId: session.user.id },
      take: 5,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Get available products for context
    const availableProducts = await prisma.product.findMany({
      take: 10,
      select: {
        title: true,
        description: true,
        price: true,
        category: true,
      },
    });

    const context = {
      wardrobeCount: wardrobeItems.length,
      recentPurchases: recentOrders
        .flatMap((order) => order.items.map((item) => item.product.title))
        .slice(0, 5),
      stylePreferences: wardrobeItems
        .map((item) => item.category)
        .filter((c): c is string => c !== null)
        .slice(0, 3),
      availableProducts: availableProducts,
    };

    const response = await chatWithAssistant(message.trim(), context);

    if (!response) {
      return NextResponse.json(
        { error: 'No response generated', response: 'I apologize, but I could not generate a response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Error in AI chat:', error);
    const errorMessage = error.message || 'Failed to get AI response';
    return NextResponse.json(
      { 
        error: errorMessage, 
        response: 'I apologize, but I encountered an error. Please check your Gemini API key configuration and try again. If the problem persists, please contact support.' 
      },
      { status: 500 }
    );
  }
}
