/**
 * Riverè Cafe & Bakery - Artisan Recipes Data Access Layer
 * File: lib/data/recipes.ts
 * Description: Production queries for fetching recipes & recipe details with strict error handling.
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
 * Leverages the `idx_recipes_published` composite index for fast chronologic retrieval.
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

    if (error) {
      console.error('[Riverè Recipes Query Error]:', error.message);
      return { data: null, error: `Failed to fetch recipes: ${error.message}` };
    }

    const formatted = (data || []).map(normalizeRecipe);
    return { data: formatted, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    console.error('[Riverè Recipes Exception]:', message);
    return { data: null, error: message };
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

    if (error) {
      console.error('[Riverè Recipe Slug Error]:', error.message);
      return { data: null, error: `Recipe "${slug}" not found or not published.` };
    }

    return { data: normalizeRecipe(data), error: null };
  } catch (err: unknown) {
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

    if (error) {
      console.error('[Riverè Recipe ID Error]:', error.message);
      return { data: null, error: `Recipe with ID ${id} not found.` };
    }

    return { data: normalizeRecipe(data), error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown runtime exception.';
    return { data: null, error: message };
  }
}
