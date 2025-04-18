import { syncBlocksAndTxs } from '@/lib/syncBlocks';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await syncBlocksAndTxs();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
}
