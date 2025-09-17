import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import ZKLib from 'zkteco-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ip } = body;

    if (!ip) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
    }

    const [host, portStr] = ip.split(':');
    const port = Number.parseInt(portStr || '4370');

    const zk = new ZKLib(host, port, 10000, 4000);

    await zk.createSocket();

    const users = await zk.getUsers();

    await zk.disconnect();

    return NextResponse.json({
      message: 'Successfully connected to device',
      users,
    });
  } catch (error: any) {
    console.error('ZKTeco connection error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to connect to ZKTeco device',
    }, { status: 500 });
  }
}
