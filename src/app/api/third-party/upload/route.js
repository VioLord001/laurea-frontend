import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt');
    const orderId = formData.get('orderId') || `ORD-${Date.now()}`;
    const total = formData.get('total') || '0';
    const items = formData.get('items') || '';

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop();
    const filename = `receipt-${orderId}-${Date.now()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'receipts');
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, filename), buffer);

    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const dbPath = path.join(dataDir, 'pending-receipts.json');
    let receipts = [];
    try { receipts = JSON.parse(await fs.readFile(dbPath, 'utf8')); } catch {}
    receipts.push({ orderId, total, items, receiptFile: filename, receiptUrl: `/receipts/${filename}`, submittedAt: new Date().toISOString(), status: 'pending' });
    await fs.writeFile(dbPath, JSON.stringify(receipts, null, 2));

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Receipt upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
