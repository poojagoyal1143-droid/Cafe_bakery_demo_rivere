/**
 * Riverè Cafe & Bakery - Database Zod Validation Schemas
 * File: lib/validations/database.ts
 * Description: Client and server pre-validation schemas mirroring every PostgreSQL DDL constraint.
 */

import { z } from 'zod';

// ==============================================================================
// 1. ENUM SCHEMAS
// ==============================================================================
export const MenuCategorySchema = z.enum([
  'viennoiserie',
  'patisserie',
  'breads',
  'beverages',
  'seasonal',
]);

export const RecipeDifficultySchema = z.enum([
  'easy',
  'artisan',
  'master_baker',
]);

export const ReservationStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]);

// ==============================================================================
// 2. MENU ITEM VALIDATION SCHEMAS
// ==============================================================================
export const MenuItemInsertSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: 'Title must be at least 2 characters.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lower-case alphanumeric words separated by single hyphens.',
    }),
  category: MenuCategorySchema,
  description: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters.' }),
  price: z
    .number()
    .min(0, { message: 'Price must be greater than or equal to 0.00.' }),
  image_url: z
    .string()
    .url({ message: 'Must be a valid HTTP or HTTPS image URL.' }),
  page_number: z
    .number()
    .int()
    .min(1, { message: 'Page number must be between 1 and 20.' })
    .max(20, { message: 'Page number must be between 1 and 20.' }),
  display_order: z
    .number()
    .int()
    .min(1, { message: 'Display order must be at least 1.' })
    .default(1),
  allergens: z.array(z.string()).default([]),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export const MenuItemSchema = MenuItemInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ==============================================================================
// 3. RECIPE VALIDATION SCHEMAS
// ==============================================================================
export const RecipeIngredientSchema = z.object({
  item: z.string().min(1, { message: 'Ingredient item name is required.' }),
  quantity: z.number().positive({ message: 'Quantity must be positive.' }),
  unit: z.string().min(1, { message: 'Measurement unit is required.' }),
});

export const RecipeInstructionSchema = z.object({
  step_number: z.number().int().positive(),
  title: z.string().min(1, { message: 'Step title is required.' }),
  detail: z.string().min(1, { message: 'Step detail is required.' }),
});

export const RecipeInsertSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Recipe title must be at least 3 characters.' })
    .max(150, { message: 'Recipe title cannot exceed 150 characters.' }),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lower-case alphanumeric words separated by single hyphens.',
    }),
  excerpt: z
    .string()
    .max(300, { message: 'Excerpt cannot exceed 300 characters.' }),
  prep_time_minutes: z
    .number()
    .int()
    .positive({ message: 'Prep time must be greater than 0 minutes.' }),
  bake_time_minutes: z
    .number()
    .int()
    .min(0, { message: 'Bake time cannot be negative.' }),
  yield_servings: z
    .number()
    .int()
    .positive({ message: 'Yield servings must be greater than 0.' }),
  difficulty: RecipeDifficultySchema.default('artisan'),
  ingredients: z
    .array(RecipeIngredientSchema)
    .min(1, { message: 'Recipe must include at least one ingredient.' }),
  instructions: z
    .array(RecipeInstructionSchema)
    .min(1, { message: 'Recipe must include at least one instruction step.' }),
  image_url: z
    .string()
    .url({ message: 'Must be a valid HTTP or HTTPS image URL.' }),
  is_published: z.boolean().default(true),
});

export const RecipeSchema = RecipeInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ==============================================================================
// 4. TABLE LAYOUT VALIDATION SCHEMAS
// ==============================================================================
export const TableLayoutInsertSchema = z.object({
  table_number: z
    .number()
    .int()
    .min(1, { message: 'Table number must be between 1 and 30.' })
    .max(30, { message: 'Table number must be between 1 and 30.' }),
  capacity: z
    .number()
    .int()
    .min(1, { message: 'Capacity must be between 1 and 8.' })
    .max(8, { message: 'Capacity must be between 1 and 8.' }),
  is_active: z.boolean().default(true),
});

export const TableLayoutSchema = TableLayoutInsertSchema.extend({
  id: z.string().uuid(),
});

// ==============================================================================
// 5. RESERVATION VALIDATION SCHEMAS (Strict Client/Server Pre-validation)
// ==============================================================================
export const ReservationInsertSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(80, { message: 'Name cannot exceed 80 characters.' }),
  customer_email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address.' }),
  customer_phone: z
    .string()
    .trim()
    .regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/, {
      message: 'Please enter a valid phone number (e.g. +1 555-0199 or 5550199).',
    })
    .min(7, { message: 'Phone number must be at least 7 characters.' })
    .max(20, { message: 'Phone number cannot exceed 20 characters.' }),
  reservation_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Reservation date must be in YYYY-MM-DD format.' })
    .refine(
      (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(dateStr + 'T00:00:00');
        return selected >= today;
      },
      { message: 'Reservation date cannot be in the past.' }
    ),
  reservation_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
      message: 'Reservation time must be in HH:MM or HH:MM:SS format.',
    })
    .refine(
      (timeStr) => {
        const [hoursStr, minutesStr] = timeStr.split(':');
        const minutes = parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
        const opening = 7 * 60;  // 07:00
        const closing = 21 * 60; // 21:00
        return minutes >= opening && minutes <= closing;
      },
      { message: 'Reservation time must be between opening hours (07:00 and 21:00).' }
    ),
  party_size: z
    .number()
    .int()
    .min(1, { message: 'Party size must be at least 1 guest.' })
    .max(8, { message: 'Party size cannot exceed 8 guests per reservation.' }),
  table_id: z.string().uuid().nullable().optional(),
  special_requests: z
    .string()
    .max(300, { message: 'Special requests cannot exceed 300 characters.' })
    .nullable()
    .optional(),
  status: ReservationStatusSchema.default('pending'),
});

export const ReservationSchema = ReservationInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ReservationInsertInput = z.infer<typeof ReservationInsertSchema>;
export type MenuItemInsertInput = z.infer<typeof MenuItemInsertSchema>;
export type RecipeInsertInput = z.infer<typeof RecipeInsertSchema>;
