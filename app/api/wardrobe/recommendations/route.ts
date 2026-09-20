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

    // Get user's wardrobe items
    const wardrobeItems = await prisma.wardrobeItem.findMany({
      where: { userId: session.user.id },
    });

    // Analyze wardrobe patterns
    const colors = wardrobeItems
      .map((item) => item.color)
      .filter((c): c is string => c !== null);
    const categories = wardrobeItems
      .map((item) => item.category)
      .filter((c): c is string => c !== null);

    // Get tags from all items
    const allTags: string[] = [];
    wardrobeItems.forEach((item) => {
      try {
        const tags = JSON.parse(item.tags);
        allTags.push(...tags);
      } catch {}
    });

    // Find most common tags
    const tagCounts: Record<string, number> = {};
    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    // Get recommendations based on wardrobe analysis
    // In a real implementation, this would use AI to suggest complementary items
    const recommendations = await prisma.product.findMany({
      where: {
        OR: [
          { color: { in: colors } },
          { category: { in: categories } },
        ],
      },
      take: 10,
    });

    return NextResponse.json({
      wardrobeStats: {
        totalItems: wardrobeItems.length,
        colors: [...new Set(colors)],
        categories: [...new Set(categories)],
        topTags,
      },
      recommendations,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

