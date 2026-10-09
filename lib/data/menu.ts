/**
 * Riverè Cafe & Bakery - Flipbook Menu Data Access Layer
 * File: lib/data/menu.ts
 * Description: Production queries for fetching 3D flipbook menu items with error handling & strict typing.
 */

import { createServerClient } from '../supabaseClient';
import type { MenuItem, MenuCategoryEnum } from '../database.types';

export interface DataResponse<T> {
  data: T | null;
  error: string | null;
}

export interface FlipbookPageGroup {
  pageNumber: number;
  items: MenuItem[];
}

/**
 * Fetches all available menu items formatted and sorted for the 3D flipbook interface.
 * Leverages the `idx_menu_items_flipbook` composite B-Tree index for zero slow queries.
 *
 * @param pageNumber Optional page number filter (1 to 20)
 */
export async function getFlipbookMenuItems(
  pageNumber?: number
): Promise<DataResponse<MenuItem[]>> {
  try {
    const supabase = createServerClient();
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('page_number', { ascending: true })
      .order('display_order', { ascending: true });

    if (pageNumber !== undefined) {
      query = query.eq('page_number', pageNumber);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Riverè Menu Query Error]:', error.message);
      return { data: null, error: `Failed to fetch menu items: ${error.message}` };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network or runtime failure.';
    console.error('[Riverè Menu Exception]:', message);
    return { data: null, error: message };
  }
}

/**
 * Fetches available menu items grouped by flipbook page numbers.
 * Ideal for building multi-page 3D flipbook animations.
 */
export async function getFlipbookGroupedPages(): Promise<DataResponse<FlipbookPageGroup[]>> {
  const { data, error } = await getFlipbookMenuItems();
  if (error || !data) {
    return { data: null, error };
  }

  const groupedMap = new Map<number, MenuItem[]>();
  for (const item of data) {
    const page = item.page_number;
    if (!groupedMap.has(page)) {
      groupedMap.set(page, []);
    }
    groupedMap.get(page)!.push(item);
  }

  const result: FlipbookPageGroup[] = Array.from(groupedMap.entries())
    .map(([pageNumber, items]) => ({ pageNumber, items }))
    .sort((a, b) => a.pageNumber - b.pageNumber);

  return { data: result, error: null };
}

/**
 * Fetches available menu items by specific artisan category.
 */
export async function getMenuItemsByCategory(
  category: MenuCategoryEnum
): Promise<DataResponse<MenuItem[]>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[Riverè Category Query Error]:', error.message);
      return { data: null, error: `Failed to fetch ${category} items: ${error.message}` };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    return { data: null, error: message };
  }
}

/**
 * Fetches featured menu items for hero carousel / showcase sections.
 */
export async function getFeaturedMenuItems(): Promise<DataResponse<MenuItem[]>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .eq('is_featured', true)
      .order('page_number', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[Riverè Featured Items Error]:', error.message);
      return { data: null, error: `Failed to fetch featured menu items: ${error.message}` };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    return { data: null, error: message };
  }
}

/**
 * Fetches a single menu item by its unique URL slug.
 */
export async function getMenuItemBySlug(slug: string): Promise<DataResponse<MenuItem>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('[Riverè Menu Item Slug Query Error]:', error.message);
      return { data: null, error: `Menu item with slug "${slug}" not found.` };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    return { data: null, error: message };
  }
}
