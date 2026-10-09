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
 * Modern Fallback Menu Dataset matching contemporary artisan bakery items.
 */
export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  // PAGE 1: ARTISAN BREADS
  {
    id: 'm1000000-0000-4000-a000-000000000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Rustic Country Sourdough',
    slug: 'rustic-country-sourdough',
    category: 'breads',
    description: 'Naturally fermented 36-hour sourdough loaf with a blistered crust and tangy, open crumb.',
    price: 9.00,
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop',
    page_number: 1,
    display_order: 1,
    allergens: ['gluten'],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm1000000-0000-4000-a000-000000000002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Roasted Garlic & Rosemary Focaccia',
    slug: 'roasted-garlic-rosemary-focaccia',
    category: 'breads',
    description: 'Extra virgin olive oil dough topped with caramelized garlic cloves, flaky sea salt, and fresh garden rosemary.',
    price: 7.50,
    image_url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1000&auto=format&fit=crop',
    page_number: 1,
    display_order: 2,
    allergens: ['gluten'],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm1000000-0000-4000-a000-000000000003',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Classic Brioche Loaf',
    slug: 'classic-brioche-loaf',
    category: 'breads',
    description: 'Golden, cloud-soft butter loaf with a rich texture and caramelized crust.',
    price: 10.00,
    image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    page_number: 1,
    display_order: 3,
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    is_featured: false,
  },

  // PAGE 2: PASTRIES & CROISSANTS
  {
    id: 'm2000000-0000-4000-a000-000000000004',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Butter Flake Croissant',
    slug: 'butter-flake-croissant',
    category: 'viennoiserie',
    description: 'Classic hand-laminated 27-layer croissant with a shattered honeycombed crumb.',
    price: 4.75,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    page_number: 2,
    display_order: 4,
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm2000000-0000-4000-a000-000000000005',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Dark Chocolate Croissant',
    slug: 'dark-chocolate-croissant',
    category: 'viennoiserie',
    description: 'Flaky pastry wrapped around double batons of 70% dark Belgian chocolate.',
    price: 5.50,
    image_url: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop',
    page_number: 2,
    display_order: 5,
    allergens: ['gluten', 'dairy', 'eggs', 'soy'],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm2000000-0000-4000-a000-000000000006',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Toasted Almond Croissant',
    slug: 'toasted-almond-croissant',
    category: 'viennoiserie',
    description: 'Twice-baked butter croissant filled with vanilla almond frangipane and shaved almonds.',
    price: 6.75,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    page_number: 2,
    display_order: 6,
    allergens: ['gluten', 'dairy', 'eggs', 'tree_nuts'],
    is_available: true,
    is_featured: false,
  },
  {
    id: 'm2000000-0000-4000-a000-000000000007',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Brown Sugar Cinnamon Morning Bun',
    slug: 'brown-sugar-cinnamon-morning-bun',
    category: 'viennoiserie',
    description: 'Cardamom-spiced laminated dough rolled in brown sugar, cinnamon, and fresh orange zest.',
    price: 5.25,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    page_number: 2,
    display_order: 7,
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    is_featured: false,
  },

  // PAGE 3: DESSERTS & CAKES
  {
    id: 'm3000000-0000-4000-a000-000000000008',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Basque Burnt Cheesecake',
    slug: 'basque-burnt-cheesecake',
    category: 'patisserie',
    description: 'Caramelized charred exterior with a rich, molten vanilla cream center.',
    price: 8.50,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop',
    page_number: 3,
    display_order: 8,
    allergens: ['dairy', 'eggs'],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm3000000-0000-4000-a000-000000000009',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Wild Berry Vanilla Tart',
    slug: 'wild-berry-vanilla-tart',
    category: 'patisserie',
    description: 'Crisp shortbread crust filled with whipped Tahitian vanilla custard and fresh seasonal berries.',
    price: 7.75,
    image_url: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    page_number: 3,
    display_order: 9,
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm3000000-0000-4000-a000-000000000010',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Dark Chocolate Sea Salt Cookie',
    slug: 'dark-chocolate-sea-salt-cookie',
    category: 'patisserie',
    description: 'Chewy brown-butter cookie packed with molten dark chocolate puddles and Maldon sea salt.',
    price: 4.25,
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop',
    page_number: 3,
    display_order: 10,
    allergens: ['gluten', 'dairy', 'eggs'],
    is_available: true,
    is_featured: false,
  },

  // PAGE 4: SPECIALTY COFFEE & BEVERAGES
  {
    id: 'm4000000-0000-4000-a000-000000000011',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Iced Spanish Latte',
    slug: 'iced-spanish-latte',
    category: 'beverages',
    description: 'Double espresso shot layered over sweetened condensed milk and cold whole milk.',
    price: 6.25,
    image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop',
    page_number: 4,
    display_order: 11,
    allergens: ['dairy'],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm4000000-0000-4000-a000-000000000012',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Ceremonial Iced Matcha Latte',
    slug: 'ceremonial-iced-matcha-latte',
    category: 'beverages',
    description: 'Uji ceremonial-grade stone-ground matcha whisked fresh with oat milk and light vanilla syrup.',
    price: 6.50,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=1000&auto=format&fit=crop',
    page_number: 4,
    display_order: 12,
    allergens: [],
    is_available: true,
    is_featured: true,
  },
  {
    id: 'm4000000-0000-4000-a000-000000000013',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Salted Caramel Cold Brew',
    slug: 'salted-caramel-cold-brew',
    category: 'beverages',
    description: '24-hour steep cold brew topped with house-made salted caramel cold foam.',
    price: 5.75,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1000&auto=format&fit=crop',
    page_number: 4,
    display_order: 13,
    allergens: ['dairy'],
    is_available: true,
    is_featured: false,
  },
];

/**
 * Fetches all available menu items formatted and sorted for the 3D flipbook interface.
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

    if (error || !data || data.length === 0) {
      const filteredFallback = pageNumber !== undefined
        ? FALLBACK_MENU_ITEMS.filter((i) => i.page_number === pageNumber)
        : FALLBACK_MENU_ITEMS;
      return { data: filteredFallback, error: null };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network or runtime failure.';
    console.error('[Riverè Menu Exception]:', message);
    const filteredFallback = pageNumber !== undefined
      ? FALLBACK_MENU_ITEMS.filter((i) => i.page_number === pageNumber)
      : FALLBACK_MENU_ITEMS;
    return { data: filteredFallback, error: null };
  }
}

/**
 * Fetches available menu items grouped by flipbook page numbers.
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

    if (error || !data || data.length === 0) {
      const filteredFallback = FALLBACK_MENU_ITEMS.filter((i) => i.category === category);
      return { data: filteredFallback, error: null };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const filteredFallback = FALLBACK_MENU_ITEMS.filter((i) => i.category === category);
    return { data: filteredFallback, error: null };
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

    if (error || !data || data.length === 0) {
      const filteredFallback = FALLBACK_MENU_ITEMS.filter((i) => i.is_featured);
      return { data: filteredFallback, error: null };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const filteredFallback = FALLBACK_MENU_ITEMS.filter((i) => i.is_featured);
    return { data: filteredFallback, error: null };
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

    if (error || !data) {
      const fallbackMatch = FALLBACK_MENU_ITEMS.find((i) => i.slug === slug);
      if (fallbackMatch) {
        return { data: fallbackMatch, error: null };
      }
      return { data: null, error: `Menu item with slug "${slug}" not found.` };
    }

    return { data, error: null };
  } catch (err: unknown) {
    const fallbackMatch = FALLBACK_MENU_ITEMS.find((i) => i.slug === slug);
    if (fallbackMatch) {
      return { data: fallbackMatch, error: null };
    }
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    return { data: null, error: message };
  }
}
