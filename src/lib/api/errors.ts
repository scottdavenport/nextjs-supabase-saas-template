import { NextResponse } from 'next/server';

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function errorResponse(
  code: string,
  message: string,
  options?: { details?: unknown; status?: number; requestId?: string }
) {
  const body = {
    error: {
      code,
      message,
      details: options?.details,
    } satisfies ApiError,
    timestamp: new Date().toISOString(),
    request_id: options?.requestId || '',
  };
  return NextResponse.json(body, { status: options?.status ?? 400 });
}

export function okResponse<T>(data: T, init?: { status?: number }) {
  return NextResponse.json({ ...data, timestamp: new Date().toISOString() }, { status: init?.status ?? 200 });
}

