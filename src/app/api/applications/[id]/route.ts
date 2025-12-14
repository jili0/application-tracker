import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';

// Helper to get the current user's ID from session
const getUserId = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Not authenticated');
  }
  return (session.user as any).id;
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const userId = await getUserId();
    await dbConnect();
    const { id } = await params;
    
    // Only allow access to the user's own applications
    const application = await Application.findOne({ _id: id, userId });
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json(application);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    console.error('GET application error:', error);
    
    if (errorMessage === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Error retrieving application',
      details: errorMessage 
    }, { status: 500 });
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const userId = await getUserId();
    const body = await request.json();
    await dbConnect();
    const { id } = await params;
    
    // Only allow updates to the user's own applications
    const application = await Application.findOneAndUpdate(
      { _id: id, userId },
      {
        date: body.date,
        company: body.company,
        position: body.position,
        status: body.status,
        remarks: body.remarks,
      },
      { new: true, runValidators: true }
    );
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json(application);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    console.error('PUT application error:', error);
    
    if (errorMessage === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Error updating application',
      details: errorMessage 
    }, { status: 500 });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const userId = await getUserId();
    await dbConnect();
    const { id } = await params;
    
    // Only allow deletion of the user's own applications
    const application = await Application.findOneAndDelete({ _id: id, userId });
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Application deleted' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    console.error('DELETE application error:', error);
    
    if (errorMessage === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Error deleting application',
      details: errorMessage 
    }, { status: 500 });
  }
};