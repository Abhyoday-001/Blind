import { NextRequest, NextResponse } from 'next/server';
import Idea from '@/lib/models/Idea';
import { protect } from '@/lib/auth';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Toggle upvote
    if (idea.upvotedBy.includes(user._id)) {
      idea.upvotedBy = idea.upvotedBy.filter(id => id.toString() !== user._id.toString());
      idea.upvotes -= 1;
    } else {
      idea.upvotedBy.push(user._id);
      idea.upvotes += 1;
    }

    await idea.save();

    return NextResponse.json({ upvotes: idea.upvotes });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}