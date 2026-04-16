import { decomposeTaskWithAI } from '../src/actions/aiActions';

async function testDecompose() {
  try {
    console.log("Testing AI Decomposition...");
    const result = await decomposeTaskWithAI("Finish the blog post about AI");

    console.log("Success!", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

testDecompose();
