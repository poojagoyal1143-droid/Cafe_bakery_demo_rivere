/**
 * Riverè Cafe & Bakery - Supabase Client Factories
 * File: lib/supabaseClient.ts
 * Description: Production client initialization with fail-safe environment variable checks and strict typing.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Validates and retrieves required Supabase environment variables.
 * Throws explicit descriptive errors at runtime if configuration is incomplete.
 */
function getEnvCredentials() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.trim() === '' || supabaseUrl === 'YOUR_SUPABASE_URL') {
    throw new Error(
      '[Riverè Database Error]: Missing required environment variable "NEXT_PUBLIC_SUPABASE_URL". Please verify your .env file.'
    );
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    throw new Error(
      '[Riverè Database Error]: Missing required environment variable "NEXT_PUBLIC_SUPABASE_ANON_KEY". Please verify your .env file.'
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Retrieves the Supabase Service Role Key for server-side admin operations.
 * Throws an error if used in client context or if key is missing.
 */
function getServiceRoleKey(): string {
  if (typeof window !== 'undefined') {
    throw new Error(
      '[Riverè Security Violation]: SUPABASE_SERVICE_ROLE_KEY must NEVER be accessed on the client-side browser bundle!'
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey.trim() === '' || serviceRoleKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
    throw new Error(
      '[Riverè Database Error]: Missing required environment variable "SUPABASE_SERVICE_ROLE_KEY" for administrative server context.'
    );
  }

  return serviceRoleKey;
}

// Singleton reference for browser client to avoid redundant instantiations
let browserClientInstance: SupabaseClient<Database> | null = null;

/**
 * Creates or reuses a typed Supabase client for browser (client-side) execution.
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    // Server context rendering falling back to public credentials
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
 * Creates a typed Supabase client for standard public server-side queries (RSC / Server Actions / API routes).
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
 * Creates an administrative typed Supabase client using the Service Role Key (bypasses RLS).
 * MUST ONLY be called within secure server contexts (Server Actions, Webhooks, API Routes).
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
