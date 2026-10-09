/**
 * Riverè Cafe & Bakery - Artisan Recipes Data Access Layer
 * File: lib/data/recipes.ts
 * Description: Production queries for fetching recipes & recipe details with strict error handling & modern fallback dataset.
 */

import { createServerClient } from '../supabaseClient';
import type { Recipe, RecipeDifficultyEnum, RecipeIngredient, RecipeInstruction } from '../database.types';

export interface DataResponse<T> {
  data: T | null;
  error: string | null;
}

export interface FormattedRecipe extends Omit<Recipe, 'ingredients' | 'instructions'> {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}

/**
 * Modern Fallback Artisan Recipes matching contemporary cafe menus.
 */
export const FALLBACK_RECIPES: FormattedRecipe[] = [
  {
    id: 'a1111111-1111-4111-a111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Rustic Country Sourdough Loaf',
    slug: 'rustic-country-sourdough',
    excerpt: 'Master the 36-hour natural sourdough fermentation with this blistered, tangy open-crumb rustic boule.',
    prep_time_minutes: 45,
    bake_time_minutes: 50,
    yield_servings: 2,
    difficulty: 'artisan',
    image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop',
    is_published: true,
    ingredients: [
      { item: 'Bread Flour (12.7% protein)', quantity: 800, unit: 'g' },
      { item: 'Whole Wheat Heritage Flour', quantity: 200, unit: 'g' },
      { item: 'Filtered Water (90°F / 32°C)', quantity: 780, unit: 'g' },
      { item: 'Active Sourdough Levain', quantity: 200, unit: 'g' },
      { item: 'Fine Sea Salt', quantity: 20, unit: 'g' },
    ],
    instructions: [
      { step_number: 1, title: 'Autolyse', detail: 'Mix bread flour, whole wheat flour, and 750g water until combined. Cover and rest for 60 minutes.' },
      { step_number: 2, title: 'Incorporate Starter & Salt', detail: 'Dimple active levain and sea salt into dough with remaining 30g water. Stretch and fold for 5 minutes.' },
      { step_number: 3, title: 'Bulk Fermentation', detail: 'Perform 4 sets of coil folds over 4 hours at 76°F until dough expands 50% with aerated bubbles.' },
      { step_number: 4, title: 'Shaping & Cold Ferment', detail: 'Pre-shape into round boules, bench rest 20 mins, then final shape into bannetons. Cold retard in fridge for 24-36 hours.' },
      { step_number: 5, title: 'Bake in Dutch Oven', detail: 'Bake covered at 500°F (260°C) with steam for 20 mins, then uncovered at 450°F for 25 mins until blistered and golden.' },
    ],
  },
  {
    id: 'b2222222-2222-4222-b222-222222222222',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'San Sebastián Basque Burnt Cheesecake',
    slug: 'basque-burnt-cheesecake',
    excerpt: 'Learn how to create a high-heat caramelized crust protecting a silky, molten vanilla custard interior.',
    prep_time_minutes: 25,
    bake_time_minutes: 40,
    yield_servings: 8,
    difficulty: 'easy',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop',
    is_published: true,
    ingredients: [
      { item: 'Full-Fat Cream Cheese (room temp)', quantity: 1000, unit: 'g' },
      { item: 'Granulated Caster Sugar', quantity: 350, unit: 'g' },
      { item: 'Large Farm Fresh Eggs', quantity: 6, unit: 'pcs' },
      { item: 'Heavy Whipping Cream (36% fat)', quantity: 400, unit: 'ml' },
      { item: 'All-Purpose Flour', quantity: 30, unit: 'g' },
      { item: 'Tahitian Vanilla Bean Paste', quantity: 10, unit: 'g' },
    ],
    instructions: [
      { step_number: 1, title: 'Prepare Pan & Oven', detail: 'Preheat oven to 425°F (220°C). Line a 9-inch springform pan with 2 overlapping sheets of crumpled parchment paper.' },
      { step_number: 2, title: 'Cream Batter', detail: 'Beat cream cheese and sugar until silky smooth. Add eggs one at a time, mixing gently without creating excess air.' },
      { step_number: 3, title: 'Incorporate Cream & Flour', detail: 'Whisk heavy cream, vanilla, and sifted flour into batter until velvety and homogeneous.' },
      { step_number: 4, title: 'High Heat Bake', detail: 'Pour batter into pan and bake for 40-45 minutes until top is deeply browned and center jiggles like gelatin.' },
      { step_number: 5, title: 'Cool & Serve', detail: 'Cool at room temperature for 3 hours before slicing at room temperature for maximum molten texture.' },
    ],
  },
  {
    id: 'c3333333-3333-4333-c333-333333333333',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Laminated Dark Chocolate Croissants',
    slug: 'dark-chocolate-croissant',
    excerpt: 'Artisan 27-layer butter pastry wrapped around double batons of rich 70% dark Belgian chocolate.',
    prep_time_minutes: 60,
    bake_time_minutes: 22,
    yield_servings: 12,
    difficulty: 'master_baker',
    image_url: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop',
    is_published: true,
    ingredients: [
      { item: 'T55 French Pastry Flour', quantity: 500, unit: 'g' },
      { item: 'Normandy Beurre de Tourage (84% fat)', quantity: 250, unit: 'g' },
      { item: '70% Dark Chocolate Batons', quantity: 24, unit: 'pcs' },
      { item: 'Whole Milk', quantity: 140, unit: 'ml' },
      { item: 'Filtered Water', quantity: 140, unit: 'ml' },
      { item: 'Fresh Baker Yeast', quantity: 20, unit: 'g' },
      { item: 'Fine Salt & Sugar', quantity: 60, unit: 'g' },
    ],
    instructions: [
      { step_number: 1, title: 'Détrempe Preparation', detail: 'Knead flour, milk, water, yeast, sugar, and salt into smooth dough disk. Chill overnight at 38°F.' },
      { step_number: 2, title: 'Lamination & Folds', detail: 'Enclose butter block in dough. Perform 1 simple turn and 1 double turn with 30-minute chill rests between turns.' },
      { step_number: 3, title: 'Cut & Roll', detail: 'Roll dough to 4mm thickness. Cut 8x25cm rectangles. Place 2 chocolate batons per pastry and roll tightly.' },
      { step_number: 4, title: 'Proofing', detail: 'Proof at 78°F (25°C) with 80% humidity for 2.5 hours until pastries double in size and jiggle when shaken.' },
      { step_number: 5, title: 'Bake', detail: 'Egg wash tops and bake at 390°F (200°C) for 18-22 minutes until deep amber mahogany with honeycomb layers.' },
    ],
  },
];

/**
 * Normalizes raw JSONB ingredients and instructions into strictly-typed arrays.
 */
function normalizeRecipe(recipe: Recipe): FormattedRecipe {
  let ingredients: RecipeIngredient[] = [];
  let instructions: RecipeInstruction[] = [];

  if (Array.isArray(recipe.ingredients)) {
    ingredients = recipe.ingredients as unknown as RecipeIngredient[];
  } else if (typeof recipe.ingredients === 'string') {
    try {
      ingredients = JSON.parse(recipe.ingredients);
    } catch {
      ingredients = [];
    }
  }

  if (Array.isArray(recipe.instructions)) {
    instructions = recipe.instructions as unknown as RecipeInstruction[];
  } else if (typeof recipe.instructions === 'string') {
    try {
      instructions = JSON.parse(recipe.instructions);
    } catch {
      instructions = [];
    }
  }

  return {
    ...recipe,
    ingredients,
    instructions,
  };
}

/**
 * Fetches all published artisan recipes, optionally filtered by difficulty level.
 * Falls back gracefully to FALLBACK_RECIPES if database is unreachable.
 */
export async function getPublishedRecipes(
  difficulty?: RecipeDifficultyEnum
): Promise<DataResponse<FormattedRecipe[]>> {
  try {
    const supabase = createServerClient();
    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      const filteredFallback = difficulty
        ? FALLBACK_RECIPES.filter((r) => r.difficulty === difficulty)
        : FALLBACK_RECIPES;
      return { data: filteredFallback, error: null };
    }

    const formatted = data.map(normalizeRecipe);
    return { data: formatted, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    console.error('[Riverè Recipes Exception]:', message);
    const filteredFallback = difficulty
      ? FALLBACK_RECIPES.filter((r) => r.difficulty === difficulty)
      : FALLBACK_RECIPES;
    return { data: filteredFallback, error: null };
  }
}

/**
 * Fetches a single published recipe by its unique URL slug.
 */
export async function getRecipeBySlug(slug: string): Promise<DataResponse<FormattedRecipe>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      const fallbackMatch = FALLBACK_RECIPES.find((r) => r.slug === slug);
      if (fallbackMatch) {
        return { data: fallbackMatch, error: null };
      }
      return { data: null, error: `Recipe "${slug}" not found or not published.` };
    }

    return { data: normalizeRecipe(data), error: null };
  } catch (err: unknown) {
    const fallbackMatch = FALLBACK_RECIPES.find((r) => r.slug === slug);
    if (fallbackMatch) {
      return { data: fallbackMatch, error: null };
    }
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    return { data: null, error: message };
  }
}

/**
 * Fetches a single recipe by its UUID.
 */
export async function getRecipeById(id: string): Promise<DataResponse<FormattedRecipe>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const fallbackMatch = FALLBACK_RECIPES.find((r) => r.id === id);
      if (fallbackMatch) {
        return { data: fallbackMatch, error: null };
      }
      return { data: null, error: `Recipe with ID ${id} not found.` };
    }

    return { data: normalizeRecipe(data), error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    return { data: null, error: message };
  }
}
