import { NextRequest, NextResponse } from 'next/server';
import { generatePRD } from '@/actions/aiActions';

export const dynamic = 'force-dynamic';

/**
 * Mobile Bridge: PRD Generation
 */
export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    
    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const prd = await generatePRD(idea);

    const response = NextResponse.json(prd);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  } catch (error: any) {
    console.error("Bridge PRD Error:", error);
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
