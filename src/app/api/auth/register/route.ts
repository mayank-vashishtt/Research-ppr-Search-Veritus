import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

// List of known academic domains (extend this list as needed)
const ACADEMIC_DOMAINS = [
  '.edu',
  '.ac.in',
  '.ac.uk',
  '.ac.jp',
  '.edu.au',
  '.edu.cn',
  '.edu.sg',
  'iit.ac.in',
  'nit.ac.in',
  'iiit.ac.in'
];

function isAcademicEmail(email: string): boolean {
  const lowerEmail = email.toLowerCase();
  return ACADEMIC_DOMAINS.some(domain => lowerEmail.endsWith(domain));
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const domain = email.split('@')[1] || '';
    const isAcademic = isAcademicEmail(email);

    // Upsert user (create if new, update lastSeenAt if exists)
    const user = await User.findOneAndUpdate(
      { email },
      { 
        email,
        domain,
        isAcademic,
        lastSeenAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Create a response with a cookie to track the user securely
    const response = NextResponse.json({ success: true, isAcademic: user.isAcademic });
    
    // Set a long-lived HTTP-only cookie
    response.cookies.set('veritus-user', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
