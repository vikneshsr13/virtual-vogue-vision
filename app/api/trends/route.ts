import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeTrends } from '@/lib/gemini';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';
    
    // Check if we have recent trends (less than 24 hours old) unless refresh is requested
    let trends = [];
    
    if (!refresh) {
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);
      
      trends = await prisma.trend.findMany({
        where: {
          createdAt: {
            gte: oneDayAgo,
          },
        },
        orderBy: { popularity: 'desc' },
        take: 15,
      });
    }

    // If no recent trends or refresh requested, generate new ones
    if (trends.length === 0 || refresh) {
      console.log('Generating new trends from web data...');
      const aiTrends = await analyzeTrends();
      
      // Clear old trends and save new ones
      await prisma.trend.deleteMany({});
      
      // Save to database
      for (const trend of aiTrends) {
        try {
          await prisma.trend.create({
            data: {
              title: trend.title || 'Trend',
              description: trend.description || '',
              category: trend.category || 'general',
              colorPalette: JSON.stringify(trend.colorPalette || []),
              season: trend.season || 'all',
              popularity: trend.popularity || 50,
            },
          });
        } catch (error) {
          console.error('Error saving trend:', error);
        }
      }

      // Fetch the newly created trends
      trends = await prisma.trend.findMany({
        orderBy: { popularity: 'desc' },
        take: 15,
      });
    }

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    // Return fallback trends even on error
    return NextResponse.json([
      {
        id: 'fallback-1',
        title: 'Sustainable Fashion',
        description: 'Eco-friendly and sustainable fashion choices are trending',
        category: 'Sustainability',
        colorPalette: JSON.stringify(['Green', 'Beige', 'Natural tones']),
        season: 'All',
        popularity: 85,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fallback-2',
        title: 'Minimalist Elegance',
        description: 'Clean lines and simple designs are in style',
        category: 'Style',
        colorPalette: JSON.stringify(['Black', 'White', 'Navy']),
        season: 'All',
        popularity: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}
