import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateStyleProfile } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers } = await request.json();

    const result = await generateStyleProfile(answers);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating style quiz:', error);
    return NextResponse.json(
      { error: 'Failed to calculate style profile' },
      { status: 500 }
    );
  }
}

