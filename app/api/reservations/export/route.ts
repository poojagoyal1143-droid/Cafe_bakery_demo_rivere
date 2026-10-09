/**
 * Riverè Cafe & Bakery - REST Route Handler: Reservations Export
 * File: app/api/reservations/export/route.ts
 * Description: POST /api/reservations/export (Generates & returns downloadable CSV/Excel file directly from DB)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminServerClient, createServerClient } from '@/lib/supabaseClient';

/**
 * Escapes a cell value for safe RFC 4180 CSV compliance.
 */
function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function POST(request: NextRequest) {
  try {
    let startDate: string | null = null;
    let endDate: string | null = null;
    let status: string | null = null;

    try {
      const body = await request.json();
      startDate = body.startDate || null;
      endDate = body.endDate || null;
      status = body.status || null;
    } catch {
      // Fallback to URL search params if request body is empty
      const { searchParams } = new URL(request.url);
      startDate = searchParams.get('startDate');
      endDate = searchParams.get('endDate');
      status = searchParams.get('status');
    }

    // Auth verification
    const authHeader = request.headers.get('authorization');
    const adminKeyHeader = request.headers.get('x-admin-key');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const isAuthorized =
      (adminKeyHeader && adminKeyHeader === serviceRoleKey) ||
      (authHeader && authHeader.startsWith('Bearer ') && authHeader.replace('Bearer ', '') === serviceRoleKey) ||
      process.env.NODE_ENV === 'development';

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin key required to export reservation data.' },
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
        { success: false, error: `Failed to query export data: ${error.message}` },
        { status: 500 }
      );
    }

    const rows = data || [];

    // Construct CSV Header and Content
    const headers = [
      'Reservation ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Reservation Date',
      'Reservation Time',
      'Party Size',
      'Table ID',
      'Status',
      'Special Requests',
      'Created At',
    ];

    const csvLines = [headers.map(escapeCSV).join(',')];

    for (const row of rows) {
      const line = [
        escapeCSV(row.id),
        escapeCSV(row.customer_name),
        escapeCSV(row.customer_email),
        escapeCSV(row.customer_phone),
        escapeCSV(row.reservation_date),
        escapeCSV(row.reservation_time),
        escapeCSV(row.party_size),
        escapeCSV(row.table_id || 'N/A'),
        escapeCSV(row.status),
        escapeCSV(row.special_requests || ''),
        escapeCSV(row.created_at),
      ].join(',');
      csvLines.push(line);
    }

    // Include UTF-8 BOM (\uFEFF) for automatic Excel character encoding recognition
    const csvContent = '\uFEFF' + csvLines.join('\n');

    const startFilename = startDate || 'all';
    const endFilename = endDate || 'latest';
    const filename = `rivere-reservations-${startFilename}-to-${endFilename}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
