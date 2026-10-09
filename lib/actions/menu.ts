'use server';

/**
 * Riverè Cafe & Bakery - Menu Server Actions
 * File: lib/actions/menu.ts
 * Description: Server action handlers for fetching menu items and categories.
 */

import { getFlipbookMenuItems, getMenuItemsByCategory, getFeaturedMenuItems } from '../data/menu';
import type { MenuItem, MenuCategoryEnum } from '../database.types';

export interface MenuActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server action to fetch active menu items sorted by display order and page number.
 */
export async function fetchMenuItemsAction(
  category?: MenuCategoryEnum
): Promise<MenuActionResponse<MenuItem[]>> {
  try {
    const { data, error } = category
      ? await getMenuItemsByCategory(category)
      : await getFlipbookMenuItems();

    if (error || !data) {
      return {
        success: false,
        error: error || 'Failed to fetch menu items.',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown menu server action error.';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server action to fetch featured hero menu items.
 */
export async function fetchFeaturedMenuItemsAction(): Promise<MenuActionResponse<MenuItem[]>> {
  try {
    const { data, error } = await getFeaturedMenuItems();

    if (error || !data) {
      return {
        success: false,
        error: error || 'Failed to fetch featured items.',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error fetching featured items.';
    return {
      success: false,
      error: message,
    };
  }
}
