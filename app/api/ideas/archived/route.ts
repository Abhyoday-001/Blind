import { NextResponse } from 'next/server';
import Idea from '@/lib/models/Idea';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const ideas = await Idea.find({ isArchived: true }).sort({ createdAt: -1 });
    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}