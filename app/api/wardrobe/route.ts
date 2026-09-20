import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateTags } from '@/lib/gemini';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.wardrobeItem.findMany({
      where: { userId: session.user.id },
      orderBy: { datePurchased: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching wardrobe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wardrobe' },
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

    const { title, description, color, brand, category, imageUrl } = await request.json();

    // Generate AI tags using Gemini
    const descriptionText = description || title;
    const tags = await generateTags(descriptionText, imageUrl);

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: session.user.id,
        title,
        description,
        color,
        brand,
        category,
        imageUrl,
        tags: JSON.stringify(tags),
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error adding wardrobe item:', error);
    return NextResponse.json(
      { error: 'Failed to add wardrobe item' },
      { status: 500 }
    );
  }
}

