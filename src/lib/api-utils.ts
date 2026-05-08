import { z } from "zod";

export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

export function errorJson(
  status: number,
  message: string,
  extra?: Record<string, unknown>,
): Response {
  return json({ status, message, ...extra }, { status });
}

export function methodNotAllowed(allowed: readonly string[]): Response {
  return new Response(null, {
    status: 405,
    headers: { allow: allowed.join(", ") },
  });
}

export const uuidSchema = z
  .string()
  .uuid()
  .or(z.string().regex(/^[a-f0-9]{32}$/i, "Invalid id"));
