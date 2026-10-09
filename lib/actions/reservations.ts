'use server';

/**
 * Riverè Cafe & Bakery - Reservations Server Actions
 * File: lib/actions/reservations.ts
 * Description: Server action handlers for table bookings with capacity validation and error handling.
 */

import { revalidatePath } from 'next/cache';
import { createReservation } from '../data/reservations';
import { ReservationInsertSchema, ReservationInsertInput } from '../validations/database';

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Helper to extract and format FormData into a raw object if passed from a native HTML form.
 */
function parseFormData(formData: FormData): Partial<ReservationInsertInput> {
  const partySizeRaw = formData.get('party_size');
  const tableIdRaw = formData.get('table_id');
  const specialRequestsRaw = formData.get('special_requests');

  return {
    customer_name: (formData.get('customer_name') as string) || '',
    customer_email: (formData.get('customer_email') as string) || '',
    customer_phone: (formData.get('customer_phone') as string) || '',
    reservation_date: (formData.get('reservation_date') as string) || '',
    reservation_time: (formData.get('reservation_time') as string) || '',
    party_size: partySizeRaw ? Number(partySizeRaw) : 1,
    table_id: tableIdRaw ? (tableIdRaw as string) : undefined,
    special_requests: specialRequestsRaw ? (specialRequestsRaw as string) : undefined,
    status: 'pending',
  };
}

/**
 * Server action to create a table reservation.
 * Accepts either a typed object or native FormData.
 */
export async function createReservationAction(
  input: ReservationInsertInput | FormData
): Promise<ActionResponse<unknown>> {
  try {
    const rawInput = input instanceof FormData ? parseFormData(input) : input;

    // Validate payload with Zod
    const validationResult = ReservationInsertSchema.safeParse(rawInput);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0] || 'Invalid reservation payload.';
      return {
        success: false,
        error: firstError,
        fieldErrors,
      };
    }

    // Call data access layer mutation (handles double booking and daily email rate-limit triggers)
    const { data, error, fieldErrors } = await createReservation(validationResult.data);

    if (error || !data) {
      return {
        success: false,
        error: error || 'Failed to submit reservation.',
        fieldErrors,
      };
    }

    // Trigger Next.js revalidation for reservation routes
    try {
      revalidatePath('/reservations');
      revalidatePath('/admin/reservations');
    } catch {
      // Revalidation silent fallback if outside RSC context
    }

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return {
      success: false,
      error: message,
    };
  }
}
