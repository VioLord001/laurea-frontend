import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { orderId, action } = await request.json();
    if (!orderId || !['approve','reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const dbPath = path.join(process.cwd(), 'data', 'pending-receipts.json');
    let receipts = [];
    try { receipts = JSON.parse(await fs.readFile(dbPath, 'utf8')); } catch {}
    receipts = receipts.map(r => r.orderId === orderId ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', decidedAt: new Date().toISOString() } : r);
    await fs.writeFile(dbPath, JSON.stringify(receipts, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update receipt' }, { status: 500 });
  }
}
