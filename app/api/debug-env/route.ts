import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const dbUrl = process.env.DATABASE_URL || "";
  const mockAuth = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH || "";

  let supabaseClientStatus = "not tried";
  let supabaseClientError = null;
  try {
    const supabase = await createClient();
    supabaseClientStatus = "initialized successfully";
  } catch (err: any) {
    supabaseClientStatus = "failed to initialize";
    supabaseClientError = {
      message: err.message,
      name: err.name,
      stack: err.stack ? err.stack.split("\n").slice(0, 3) : null
    };
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: {
        defined: !!url,
        length: url.length,
        prefix: url ? url.substring(0, 8) : "",
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        defined: !!anonKey,
        length: anonKey.length,
        prefix: anonKey ? anonKey.substring(0, 8) : "",
      },
      DATABASE_URL: {
        defined: !!dbUrl,
        length: dbUrl.length,
      },
      NEXT_PUBLIC_ENABLE_MOCK_AUTH: {
        value: mockAuth,
      },
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    supabaseClientStatus,
    supabaseClientError,
  });
}
