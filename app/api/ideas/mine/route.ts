import { NextRequest, NextResponse } from 'next/server';
import Idea from '@/lib/models/Idea';
import { protect } from '@/lib/auth';
import connectDB from '@/lib/db';

async function archiveExpiredIdeas() {
  const now = new Date();
  await Idea.updateMany(
    { expiryTime: { $lte: now }, isArchived: false },
    { isArchived: true },
  );
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    const user = await protect(authHeader);

    await archiveExpiredIdeas();
    const ideas = await Idea.find({ userId: user._id, isArchived: false }).sort({ createdAt: -1 });
    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}