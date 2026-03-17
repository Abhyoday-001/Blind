import { NextRequest, NextResponse } from 'next/server';
import Idea from '@/lib/models/Idea';
import { protect } from '@/lib/auth';
import connectDB from '@/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    const user = await protect(authHeader);

    const idea = await Idea.findById(params.id);

    if (!idea) {
      return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
    }

    // Check if owner
    if (idea.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    idea.visibilityStatus = idea.visibilityStatus === 'active' ? 'hidden' : 'active';
    await idea.save();

    return NextResponse.json(idea);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}