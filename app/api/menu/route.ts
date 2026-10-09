/**
 * Riverè Cafe & Bakery - REST Route Handler: Menu
 * File: app/api/menu/route.ts
 * Description: GET /api/menu (Returns categorized menu items with caching headers)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFlipbookMenuItems, getMenuItemsByCategory } from '@/lib/data/menu';
import type { MenuCategoryEnum } from '@/lib/database.types';

// Next.js ISR Route Segment Config: Cache response for 1 hour (3600s)
export const revalidate = 3600;

/**
 * GET /api/menu
 * Returns active menu items categorized and sorted by display order.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category') as MenuCategoryEnum | null;

    const { data, error } = categoryParam
      ? await getMenuItemsByCategory(categoryParam)
      : await getFlipbookMenuItems();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to fetch menu items.' },
        { status: 500 }
      );
    }

    // Group menu items by category for easy consumption
    const categorized = data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof data>);

    const response = NextResponse.json(
      {
        success: true,
        totalItems: data.length,
        categoryFilter: categoryParam || 'all',
        data: categoryParam ? data : categorized,
      },
      { status: 200 }
    );

    // Set HTTP Cache Headers for CDN / Browser Caching
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
