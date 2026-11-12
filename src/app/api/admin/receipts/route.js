import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'pending-receipts.json');
    let receipts = [];
    try { receipts = JSON.parse(await fs.readFile(dbPath, 'utf8')); } catch {}
    return NextResponse.json({ receipts });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load receipts' }, { status: 500 });
  }
}
