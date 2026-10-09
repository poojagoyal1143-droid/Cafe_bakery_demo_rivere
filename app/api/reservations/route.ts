/**
 * Riverè Cafe & Bakery - REST Route Handler: Reservations
 * File: app/api/reservations/route.ts
 * Description: POST /api/reservations (Create reservation) & GET /api/reservations (Query with date range & auth)
 */

import { NextRequest, NextResponse } from 'next/server';
import { ReservationInsertSchema } from '@/lib/validations/database';
import { createReservation } from '@/lib/data/reservations';
import { createAdminServerClient, createServerClient } from '@/lib/supabaseClient';

/**
 * POST /api/reservations
 * Validates request payload against Zod schema, invokes database layer, handles error states gracefully.
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    // Validate request payload with Zod schema
    const validationResult = ReservationInsertSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors)[0]?.[0] || 'Invalid reservation submission data.';

      return NextResponse.json(
        {
          success: false,
          error: firstErrorMessage,
          fieldErrors,
        },
        { status: 400 }
      );
    }

    // Invoke DB access layer mutation
    const { data, error, fieldErrors } = await createReservation(validationResult.data);

    if (error || !data) {
      // Differentiate error status codes based on trigger exception message
      let statusCode = 400;
      if (error?.includes('Rate limit')) {
        statusCode = 429; // Too Many Requests
      } else if (error?.includes('Double-booking') || error?.includes('Fully booked')) {
        statusCode = 409; // Conflict
      }

      return NextResponse.json(
        {
          success: false,
          error: error || 'Failed to process reservation.',
          fieldErrors,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reservations
 * Returns reservations list with date-range filtering and strict service-role/admin authorization check.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Auth Protection Check
    const authHeader = request.headers.get('authorization');
    const adminKeyHeader = request.headers.get('x-admin-key');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const isAuthorized =
      (adminKeyHeader && adminKeyHeader === serviceRoleKey) ||
      (authHeader && authHeader.startsWith('Bearer ') && authHeader.replace('Bearer ', '') === serviceRoleKey) ||
      process.env.NODE_ENV === 'development';

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials or Service Role key required.' },
        { status: 401 }
      );
    }

    const supabase = isAuthorized ? createAdminServerClient() : createServerClient();
    let query = supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true });

    if (startDate) {
      query = query.gte('reservation_date', startDate);
    }

    if (endDate) {
      query = query.lte('reservation_date', endDate);
    }

    if (status) {
      query = query.eq('status', status as any);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
