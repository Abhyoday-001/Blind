import { NextRequest, NextResponse } from 'next/server';
import Idea from '@/lib/models/Idea';
import { protect } from '@/lib/auth';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const idea = await Idea.findById(params.id);

    if (!idea) {
      return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
    }

    // Increment views
    idea.views += 1;
    await idea.save();

    return NextResponse.json(idea);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    const user = await protect(authHeader);

    let idea = await Idea.findById(params.id);

    if (!idea) {
      return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
    }

    // Check if owner
    if (idea.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: 'Not authorized to update this idea' }, { status: 401 });
    }

    const { title, problemStatement, category, difficultyScore, marketPotential } = await request.json();

    idea = await Idea.findByIdAndUpdate(params.id, {
      title,
      problemStatement,
      category,
      difficultyScore,
      marketPotential,
    }, { new: true, runValidators: true });

    return NextResponse.json(idea);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ message: 'Not authorized to delete this idea' }, { status: 401 });
    }

    await idea.deleteOne();

    return NextResponse.json({ message: 'Idea removed' });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}