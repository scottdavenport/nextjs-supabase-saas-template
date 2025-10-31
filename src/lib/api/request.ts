import { NextRequest } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

export async function parseJsonBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  const body = await req.json();
  return schema.parse(body);
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

