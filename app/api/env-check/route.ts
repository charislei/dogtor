import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasCohere: !!process.env.COHERE_API_KEY,
    hasModelId: !!process.env.MODEL_ID,
    cohereKeyLength: process.env.COHERE_API_KEY ? process.env.COHERE_API_KEY.length : 0,
    modelIdLength: process.env.MODEL_ID ? process.env.MODEL_ID.length : 0,
  })
}

