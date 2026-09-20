import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateOutfit, calculateCompatibility } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { occasion, style } = await request.json();

    // Get user's wardrobe items
    const wardrobeItems = await prisma.wardrobeItem.findMany({
      where: { userId: session.user.id },
    });

    if (wardrobeItems.length < 2) {
      return NextResponse.json(
        { error: 'Need at least 2 items in wardrobe to generate outfit' },
        { status: 400 }
      );
    }

    // Generate outfit using AI
    const outfitResult = await generateOutfit(wardrobeItems, occasion, style);

    // Get matching products from store
    const matchingProducts = await prisma.product.findMany({
      where: {
        OR: [
          { category: { in: wardrobeItems.map(item => item.category).filter(Boolean) } },
          { color: { in: wardrobeItems.map(item => item.color).filter(Boolean) } },
        ],
      },
      take: 5,
    });

    return NextResponse.json({
      outfit: outfitResult.outfit,
      description: outfitResult.description,
      compatibilityScore: outfitResult.compatibilityScore,
      matchingProducts,
    });
  } catch (error) {
    console.error('Error matching outfit:', error);
    return NextResponse.json(
      { error: 'Failed to generate outfit match' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const item1Id = searchParams.get('item1');
    const item2Id = searchParams.get('item2');

    if (!item1Id || !item2Id) {
      return NextResponse.json(
        { error: 'Both item IDs required' },
        { status: 400 }
      );
    }

    const [item1, item2] = await Promise.all([
      prisma.wardrobeItem.findUnique({ where: { id: item1Id } }),
      prisma.wardrobeItem.findUnique({ where: { id: item2Id } }),
    ]);

    if (!item1 || !item2 || item1.userId !== session.user.id || item2.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Items not found' },
        { status: 404 }
      );
    }

    const compatibility = await calculateCompatibility(item1, item2);

    return NextResponse.json({ compatibility });
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    return NextResponse.json(
      { error: 'Failed to calculate compatibility' },
      { status: 500 }
    );
  }
}

