import { NextRequest, NextResponse } from 'next/server';
import { generatePRD } from '@/actions/aiActions';

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

    return NextResponse.json(prd);
  } catch (error: any) {
    console.error("Bridge PRD Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
