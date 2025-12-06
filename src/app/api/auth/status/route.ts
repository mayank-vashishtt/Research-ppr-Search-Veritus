import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('veritus-user');

  return NextResponse.json({ 
    authenticated: !!userCookie,
    userId: userCookie?.value 
  });
}
