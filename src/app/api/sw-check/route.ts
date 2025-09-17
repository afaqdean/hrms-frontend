import type { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // Check if sw.js exists in the public directory
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    const swExists = fs.existsSync(swPath);

    // Check if the required icon files exist
    const icon192Path = path.join(process.cwd(), 'public', 'android-chrome-192x192.png');
    const icon512Path = path.join(process.cwd(), 'public', 'android-chrome-512x512.png');

    const icon192Exists = fs.existsSync(icon192Path);
    const icon512Exists = fs.existsSync(icon512Path);

    return NextResponse.json({
      success: true,
      swExists,
      icon192Exists,
      icon512Exists,
      publicDir: fs.readdirSync(path.join(process.cwd(), 'public')).slice(0, 10), // List first 10 files in public
    });
  } catch (error) {
    console.error('Error checking service worker:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    }, { status: 500 });
  }
}
