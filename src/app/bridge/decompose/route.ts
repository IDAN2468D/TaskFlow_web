import { NextRequest, NextResponse } from 'next/server';
import { decomposeTaskWithAI } from '@/actions/aiActions';

/**
 * Mobile Bridge: Task Decomposition
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log("[Bridge] Decompose Request for prompt:", prompt);

    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const task = await decomposeTaskWithAI(prompt);

    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Bridge Decompose Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
