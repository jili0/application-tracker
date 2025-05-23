import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';
import { sortApplications } from '@/lib/utils';
import { authOptions } from '@/lib/auth';

// Helper to get the current user's ID from session
const getUserId = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Not authenticated');
  }
  
  if (!(session.user as any).id) {
    throw new Error('User ID not found in session');
  }
  
  return (session.user as any).id;
};

export const GET = async () => {
  try {
    const userId = await getUserId();
    await dbConnect();
    
    // Only get applications for the current user
    const applications = await Application.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(sortApplications(applications));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    console.error('GET applications error:', error);
    
    if (errorMessage === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Error retrieving applications',
      details: errorMessage 
    }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const userId = await getUserId();
    await dbConnect();
    
    const body = await request.json();
    
    // Create the application with the userId included
    const applicationData = {
      date: body.date || '',
      company: body.company || '',
      position: body.position || '',
      status: body.status || 'no-answer',
      remarks: body.remarks || '',
      userId: userId
    };
    
    console.log('Creating application with data:', applicationData);
    
    const application = await Application.create(applicationData);
    
    return NextResponse.json(application, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating application:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    if (errorMessage === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    if (errorMessage === 'User ID not found in session') {
      return NextResponse.json({ 
        error: 'Error creating application', 
        details: 'Invalid user session' 
      }, { status: 500 });
    }
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Error creating application', 
        details: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Error creating application',
      details: errorMessage 
    }, { status: 500 });
  }
};

export const DELETE = async () => {
  try {
    const userId = await getUserId();
    await dbConnect();
    
    // Only delete applications for the current user
    await Application.deleteMany({ userId });
    return NextResponse.json({ message: 'All applications deleted' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    console.error('DELETE applications error:', error);
    
    if (errorMessage === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Error deleting applications',
      details: errorMessage 
    }, { status: 500 });
  }
};