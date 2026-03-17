import { NextRequest, NextResponse } from 'next/server';
import { protect } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    await protect(authHeader);
    // Since JWT is stateless, logout is handled client-side
    return NextResponse.json({ message: 'User logged out successfully' });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 401 });
  }
}