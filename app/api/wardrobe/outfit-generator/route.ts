import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateOutfit } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { occasion, style } = await request.json();

    const wardrobeItems = await prisma.wardrobeItem.findMany({
      where: { userId: session.user.id },
    });

    if (wardrobeItems.length < 2) {
      return NextResponse.json(
        { error: 'Need at least 2 items in wardrobe' },
        { status: 400 }
      );
    }

    const outfitResult = await generateOutfit(wardrobeItems, occasion, style);

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
    console.error('Error generating outfit:', error);
    return NextResponse.json(
      { error: 'Failed to generate outfit' },
      { status: 500 }
    );
  }
}

