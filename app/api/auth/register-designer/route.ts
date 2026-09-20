import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialization: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address, specialization } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if designer with this email already exists
    const existingDesigner = await prisma.designer.findUnique({
      where: { email },
    });

    if (existingDesigner) {
      return NextResponse.json(
        { error: 'Designer with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'designer',
      },
    });

    // Then create designer linked to the user
    try {
      await prisma.designer.create({
        data: {
          userId: user.id,
          name: name,
          email: email,
          phone: phone || null,
          address: address || null,
          specialization: specialization || null,
          isAvailable: true,
        },
      });
    } catch (designerError: any) {
      // If designer creation fails, delete the user to maintain consistency
      await prisma.user.delete({
        where: { id: user.id },
      });
      console.error('Error creating designer:', designerError);
      throw designerError;
    }

    return NextResponse.json(
      { 
        message: 'Designer account created successfully', 
        userId: user.id 
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`) 
        },
        { status: 400 }
      );
    }
    
    console.error('Error creating designer account:', error);
    
    // Provide more specific error messages
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists. Please use a different email.' },
        { status: 400 }
      );
    }
    
    if (error.message?.includes('userId')) {
      return NextResponse.json(
        { error: 'Failed to link designer to user account. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
