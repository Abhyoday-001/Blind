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

export async function GET() {
  try {
    await connectDB();
    await archiveExpiredIdeas();
    const ideas = await Idea.find({ visibilityStatus: 'active', isArchived: false }).sort({ createdAt: -1 });
    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    const user = await protect(authHeader);

    const { title, problemStatement, category, difficultyScore, marketPotential, expiryHours } = await request.json();

    let expiryTime;
    if (expiryHours !== undefined && expiryHours !== null && expiryHours !== '') {
      expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(expiryHours, 10));
    }

    const idea = await Idea.create({
      title,
      problemStatement,
      category,
      difficultyScore,
      marketPotential,
      expiryTime,
      userId: user._id,
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}