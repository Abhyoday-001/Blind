import { NextResponse } from 'next/server';
import Idea from '@/lib/models/Idea';
import connectDB from '@/lib/db';

async function archiveExpiredIdeas() {
  const now = new Date();
  await Idea.updateMany(
    { expiryTime: { $lte: now }, isArchived: false },
    { isArchived: true },
  );
}

export async function GET() {
  try {
    await connectDB();
    await archiveExpiredIdeas();
    const ideas = await Idea.find({ visibilityStatus: 'active', isArchived: false });

    // Sort by virtual ideaScore
    const trending = ideas.sort((a, b) => b.ideaScore - a.ideaScore);

    return NextResponse.json(trending);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}