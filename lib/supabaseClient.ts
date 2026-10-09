/**
 * Riverè Cafe & Bakery - Supabase Client Factories
 * File: lib/supabaseClient.ts
 * Description: Production client initialization with fail-safe environment variable checks and fallback handling.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Validates and retrieves Supabase environment variables.
 * Provides safe fallback values in development when database keys are unconfigured.
 */
function getEnvCredentials() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL'
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : 'https://placeholder.supabase.co';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : 'placeholder-anon-key';

  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Retrieves the Supabase Service Role Key for server-side admin operations.
 */
function getServiceRoleKey(): string {
  if (typeof window !== 'undefined') {
    throw new Error(
      '[Riverè Security Violation]: SUPABASE_SERVICE_ROLE_KEY must NEVER be accessed on the client-side browser bundle!'
    );
  }

  return process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';
}

// Singleton reference for browser client to avoid redundant instantiations
let browserClientInstance: SupabaseClient<Database> | null = null;

/**
 * Creates or reuses a typed Supabase client for browser (client-side) execution.
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    const { supabaseUrl, supabaseAnonKey } = getEnvCredentials();
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  if (!browserClientInstance) {
    const { supabaseUrl, supabaseAnonKey } = getEnvCredentials();
    browserClientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return browserClientInstance;
}

/**
 * Creates a typed Supabase client for standard public server-side queries.
 */
export function createServerClient(): SupabaseClient<Database> {
  const { supabaseUrl, supabaseAnonKey } = getEnvCredentials();
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates an administrative typed Supabase client using the Service Role Key.
 */
export function createAdminServerClient(): SupabaseClient<Database> {
  const { supabaseUrl } = getEnvCredentials();
  const serviceRoleKey = getServiceRoleKey();

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Default export: Browser client instance factory
export const supabase = createBrowserClient();
