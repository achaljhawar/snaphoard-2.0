import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendurl = process.env.NEXT_PUBLIC_BACKEND_URL as string;
    const response = await fetch(`${backendurl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const { token } = await response.json();
      cookies().set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NEXT_PUBLIC_NODE_ENV !== 'development'
      });
      return new NextResponse(null, { status: response.status });
    } else {
      const { error } = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}