/**
 * Riverè Cafe & Bakery - Table Reservation Data Access Layer & Mutations
 * File: lib/data/reservations.ts
 * Description: Production reservation booking mutation with client/server validation, rate-limiting & conflict handling.
 */

import { createServerClient } from '../supabaseClient';
import { ReservationInsertSchema, ReservationInsertInput } from '../validations/database';
import type { TableLayout } from '../database.types';

export interface ReservationDataResponse<T> {
  data: T | null;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export interface CreatedReservationConfirmation {
  id: string;
  customer_name: string;
  customer_email: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: string;
  message: string;
}

/**
 * Fetches all active dining tables from `tables_layout`.
 * Used for table selection or seating plan display.
 */
export async function getActiveTables(): Promise<ReservationDataResponse<TableLayout[]>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('tables_layout')
      .select('*')
      .eq('is_active', true)
      .order('table_number', { ascending: true });

    if (error) {
      console.error('[Riverè Tables Query Error]:', error.message);
      return { data: null, error: `Failed to retrieve active tables: ${error.message}` };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network exception.';
    return { data: null, error: message };
  }
}

/**
 * Creates a new reservation with double-booking checks & daily email rate-limiting.
 *
 * 1. Pre-validates all fields against PostgreSQL constraints via Zod `ReservationInsertSchema`.
 * 2. Attempts DB insertion which triggers database-level checks:
 *    - `prevent_overbooking()` trigger (table capacity & 90-minute slot collision check).
 *    - `check_reservation_rate_limit()` RLS security barrier (max 3 reservations per email/day).
 * 3. Formats Postgres exception messages into human-friendly user feedback.
 */
export async function createReservation(
  rawInput: ReservationInsertInput
): Promise<ReservationDataResponse<CreatedReservationConfirmation>> {
  // Step 1: Client/Server Zod Schema Validation
  const validationResult = ReservationInsertSchema.safeParse(rawInput);

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.flatten().fieldErrors;
    const firstErrorMessage =
      Object.values(formattedErrors)[0]?.[0] || 'Invalid reservation submission data.';

    return {
      data: null,
      error: firstErrorMessage,
      fieldErrors: formattedErrors,
    };
  }

  const validatedData = validationResult.data;

  try {
    const supabase = createServerClient();

    // Step 2: Insert into `public.reservations`
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        customer_name: validatedData.customer_name,
        customer_email: validatedData.customer_email,
        customer_phone: validatedData.customer_phone,
        reservation_date: validatedData.reservation_date,
        reservation_time: validatedData.reservation_time,
        party_size: validatedData.party_size,
        table_id: validatedData.table_id ?? null,
        special_requests: validatedData.special_requests ?? null,
        status: 'pending',
      })
      .select('id, customer_name, customer_email, reservation_date, reservation_time, party_size, status')
      .single();

    if (error) {
      console.error('[Riverè Reservation Mutation Error]:', error.code, error.message, error.details);

      // Handle specific database trigger & constraint error codes
      if (error.message.includes('rate limit') || error.code === '42501') {
        return {
          data: null,
          error: 'Rate limit exceeded: A maximum of 3 reservations per email address per day is allowed.',
        };
      }

      if (error.message.includes('Double-booking conflict') || error.message.includes('Fully booked')) {
        return {
          data: null,
          error: error.message || 'The selected table or time slot is no longer available. Please choose another time.',
        };
      }

      if (error.message.includes('Table capacity exceeded')) {
        return {
          data: null,
          error: error.message || 'Selected table does not fit your party size.',
        };
      }

      return {
        data: null,
        error: error.message || 'Unable to complete reservation. Please try again or call the cafe directly.',
      };
    }

    if (!data) {
      return {
        data: null,
        error: 'Reservation submission succeeded but returned no response payload.',
      };
    }

    return {
      data: {
        id: data.id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        reservation_date: data.reservation_date,
        reservation_time: data.reservation_time,
        party_size: data.party_size,
        status: data.status,
        message: 'Your table reservation request has been successfully received and recorded.',
      },
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred while processing your reservation.';
    console.error('[Riverè Reservation Exception]:', message);
    return { data: null, error: message };
  }
}
