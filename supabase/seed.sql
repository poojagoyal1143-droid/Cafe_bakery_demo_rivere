-- ==============================================================================
-- Riverè Cafe & Bakery - Production Seed Dataset
-- File: supabase/seed.sql
-- Description: Complete seed data for Modern Artisan Menu Items, Tables Layout, and Recipes
-- ==============================================================================

-- 1. TABLES LAYOUT SEED
INSERT INTO public.tables_layout (table_number, capacity, is_active)
VALUES
  (1, 2, true),
  (2, 2, true),
  (3, 4, true),
  (4, 6, true)
ON CONFLICT (table_number) DO UPDATE
SET capacity = EXCLUDED.capacity, is_active = EXCLUDED.is_active;

-- 2. MENU ITEMS SEED (13 Modern Artisan Items across 4 Flipbook Pages)
INSERT INTO public.menu_items (
  title, slug, category, description, price, image_url, page_number, display_order, allergens, is_available, is_featured
)
VALUES
  -- CATEGORY: ARTISAN BREADS (PAGE 1)
  (
    'Rustic Country Sourdough',
    'rustic-country-sourdough',
    'breads',
    'Naturally fermented 36-hour sourdough loaf with a blistered crust and tangy, open crumb.',
    9.00,
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop',
    1,
    1,
    ARRAY['gluten'],
    true,
    true
  ),
  (
    'Roasted Garlic & Rosemary Focaccia',
    'roasted-garlic-rosemary-focaccia',
    'breads',
    'Extra virgin olive oil dough topped with caramelized garlic cloves, flaky sea salt, and fresh garden rosemary.',
    7.50,
    'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1000&auto=format&fit=crop',
    1,
    2,
    ARRAY['gluten'],
    true,
    true
  ),
  (
    'Classic Brioche Loaf',
    'classic-brioche-loaf',
    'breads',
    'Golden, cloud-soft butter loaf with a rich texture and caramelized crust.',
    10.00,
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    1,
    3,
    ARRAY['gluten', 'dairy', 'eggs'],
    true,
    false
  ),

  -- CATEGORY: PASTRIES & CROISSANTS (PAGE 2)
  (
    'Butter Flake Croissant',
    'butter-flake-croissant',
    'viennoiserie',
    'Classic hand-laminated 27-layer croissant with a shattered honeycombed crumb.',
    4.75,
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    2,
    4,
    ARRAY['gluten', 'dairy', 'eggs'],
    true,
    true
  ),
  (
    'Dark Chocolate Croissant',
    'dark-chocolate-croissant',
    'viennoiserie',
    'Flaky pastry wrapped around double batons of 70% dark Belgian chocolate.',
    5.50,
    'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop',
    2,
    5,
    ARRAY['gluten', 'dairy', 'eggs', 'soy'],
    true,
    true
  ),
  (
    'Toasted Almond Croissant',
    'toasted-almond-croissant',
    'viennoiserie',
    'Twice-baked butter croissant filled with vanilla almond frangipane and shaved almonds.',
    6.75,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    2,
    6,
    ARRAY['gluten', 'dairy', 'eggs', 'tree_nuts'],
    true,
    false
  ),
  (
    'Brown Sugar Cinnamon Morning Bun',
    'brown-sugar-cinnamon-morning-bun',
    'viennoiserie',
    'Cardamom-spiced laminated dough rolled in brown sugar, cinnamon, and fresh orange zest.',
    5.25,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    2,
    7,
    ARRAY['gluten', 'dairy', 'eggs'],
    true,
    false
  ),

  -- CATEGORY: DESSERTS & CAKES (PAGE 3)
  (
    'Basque Burnt Cheesecake',
    'basque-burnt-cheesecake',
    'patisserie',
    'Caramelized charred exterior with a rich, molten vanilla cream center.',
    8.50,
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop',
    3,
    8,
    ARRAY['dairy', 'eggs'],
    true,
    true
  ),
  (
    'Wild Berry Vanilla Tart',
    'wild-berry-vanilla-tart',
    'patisserie',
    'Crisp shortbread crust filled with whipped Tahitian vanilla custard and fresh seasonal berries.',
    7.75,
    'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    3,
    9,
    ARRAY['gluten', 'dairy', 'eggs'],
    true,
    true
  ),
  (
    'Dark Chocolate Sea Salt Cookie',
    'dark-chocolate-sea-salt-cookie',
    'patisserie',
    'Chewy brown-butter cookie packed with molten dark chocolate puddles and Maldon sea salt.',
    4.25,
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop',
    3,
    10,
    ARRAY['gluten', 'dairy', 'eggs'],
    true,
    false
  ),

  -- CATEGORY: SPECIALTY COFFEE & BEVERAGES (PAGE 4)
  (
    'Iced Spanish Latte',
    'iced-spanish-latte',
    'beverages',
    'Double espresso shot layered over sweetened condensed milk and cold whole milk.',
    6.25,
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop',
    4,
    11,
    ARRAY['dairy'],
    true,
    true
  ),
  (
    'Ceremonial Iced Matcha Latte',
    'ceremonial-iced-matcha-latte',
    'beverages',
    'Uji ceremonial-grade stone-ground matcha whisked fresh with oat milk and light vanilla syrup.',
    6.50,
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=1000&auto=format&fit=crop',
    4,
    12,
    ARRAY[]::TEXT[],
    true,
    true
  ),
  (
    'Salted Caramel Cold Brew',
    'salted-caramel-cold-brew',
    'beverages',
    '24-hour steep cold brew topped with house-made salted caramel cold foam.',
    5.75,
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1000&auto=format&fit=crop',
    4,
    13,
    ARRAY['dairy'],
    true,
    false
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  page_number = EXCLUDED.page_number,
  display_order = EXCLUDED.display_order,
  allergens = EXCLUDED.allergens,
  is_available = EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured;

-- 3. RECIPES SEED (3 Master Baker Recipes for Modern Cafe Favorites)
INSERT INTO public.recipes (
  title, slug, excerpt, prep_time_minutes, bake_time_minutes, yield_servings, difficulty, ingredients, instructions, image_url, is_published
)
VALUES
  (
    'Rustic Country Sourdough Loaf',
    'rustic-country-sourdough',
    'Master the 36-hour natural sourdough fermentation with this blistered, tangy open-crumb rustic boule.',
    45,
    50,
    2,
    'artisan',
    '[
      {"item": "Bread Flour (12.7% protein)", "quantity": 800, "unit": "g"},
      {"item": "Whole Wheat Heritage Flour", "quantity": 200, "unit": "g"},
      {"item": "Filtered Water (90°F / 32°C)", "quantity": 780, "unit": "g"},
      {"item": "Active Sourdough Levain", "quantity": 200, "unit": "g"},
      {"item": "Fine Sea Salt", "quantity": 20, "unit": "g"}
    ]'::jsonb,
    '[
      {
        "step_number": 1,
        "title": "Autolyse",
        "detail": "Mix bread flour, whole wheat flour, and 750g water until combined. Cover and rest for 60 minutes."
      },
      {
        "step_number": 2,
        "title": "Incorporate Starter & Salt",
        "detail": "Dimple active levain and sea salt into dough with remaining 30g water. Stretch and fold for 5 minutes."
      },
      {
        "step_number": 3,
        "title": "Bulk Fermentation",
        "detail": "Perform 4 sets of coil folds over 4 hours at 76°F until dough expands 50% with aerated bubbles."
      },
      {
        "step_number": 4,
        "title": "Shaping & Cold Ferment",
        "detail": "Pre-shape into round boules, bench rest 20 mins, then final shape into bannetons. Cold retard in fridge for 24-36 hours."
      },
      {
        "step_number": 5,
        "title": "Bake in Dutch Oven",
        "detail": "Bake covered at 500°F (260°C) with steam for 20 mins, then uncovered at 450°F for 25 mins until blistered and golden."
      }
    ]'::jsonb,
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop',
    true
  ),
  (
    'San Sebastián Basque Burnt Cheesecake',
    'basque-burnt-cheesecake',
    'Learn how to create a high-heat caramelized crust protecting a silky, molten vanilla custard interior.',
    25,
    40,
    8,
    'easy',
    '[
      {"item": "Full-Fat Cream Cheese (room temp)", "quantity": 1000, "unit": "g"},
      {"item": "Granulated Caster Sugar", "quantity": 350, "unit": "g"},
      {"item": "Large Farm Fresh Eggs", "quantity": 6, "unit": "pcs"},
      {"item": "Heavy Whipping Cream (36% fat)", "quantity": 400, "unit": "ml"},
      {"item": "All-Purpose Flour", "quantity": 30, "unit": "g"},
      {"item": "Tahitian Vanilla Bean Paste", "quantity": 10, "unit": "g"}
    ]'::jsonb,
    '[
      {
        "step_number": 1,
        "title": "Prepare Pan & Oven",
        "detail": "Preheat oven to 425°F (220°C). Line a 9-inch springform pan with 2 overlapping sheets of crumpled parchment paper."
      },
      {
        "step_number": 2,
        "title": "Cream Batter",
        "detail": "Beat cream cheese and sugar until silky smooth. Add eggs one at a time, mixing gently without creating excess air."
      },
      {
        "step_number": 3,
        "title": "Incorporate Cream & Flour",
        "detail": "Whisk heavy cream, vanilla, and sifted flour into batter until velvety and homogeneous."
      },
      {
        "step_number": 4,
        "title": "High Heat Bake",
        "detail": "Pour batter into pan and bake for 40-45 minutes until top is deeply browned and center jiggles like gelatin."
      },
      {
        "step_number": 5,
        "title": "Cool & Serve",
        "detail": "Cool at room temperature for 3 hours before slicing at room temperature for maximum molten texture."
      }
    ]'::jsonb,
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop',
    true
  ),
  (
    'Laminated Dark Chocolate Croissants',
    'dark-chocolate-croissant',
    'Artisan 27-layer butter pastry wrapped around double batons of rich 70% dark Belgian chocolate.',
    60,
    22,
    12,
    'master_baker',
    '[
      {"item": "T55 French Pastry Flour", "quantity": 500, "unit": "g"},
      {"item": "Normandy Beurre de Tourage (84% fat)", "quantity": 250, "unit": "g"},
      {"item": "70% Dark Chocolate Batons", "quantity": 24, "unit": "pcs"},
      {"item": "Whole Milk", "quantity": 140, "unit": "ml"},
      {"item": "Water", "quantity": 140, "unit": "ml"},
      {"item": "Fresh Baker Yeast", "quantity": 20, "unit": "g"},
      {"item": "Fine Salt & Sugar", "quantity": 60, "unit": "g"}
    ]'::jsonb,
    '[
      {
        "step_number": 1,
        "title": "Détrempe Preparation",
        "detail": "Knead flour, milk, water, yeast, sugar, and salt into smooth dough disk. Chill overnight at 38°F."
      },
      {
        "step_number": 2,
        "title": "Lamination & Folds",
        "detail": "Enclose butter block in dough. Perform 1 simple turn and 1 double turn with 30-minute chill rests between turns."
      },
      {
        "step_number": 3,
        "title": "Cut & Roll",
        "detail": "Roll dough to 4mm thickness. Cut 8x25cm rectangles. Place 2 chocolate batons per pastry and roll tightly."
      },
      {
        "step_number": 4,
        "title": "Proofing",
        "detail": "Proof at 78°F (25°C) with 80% humidity for 2.5 hours until pastries double in size and jiggle when shaken."
      },
      {
        "step_number": 5,
        "title": "Bake",
        "detail": "Egg wash tops and bake at 390°F (200°C) for 18-22 minutes until deep amber mahogany with honeycomb layers."
      }
    ]'::jsonb,
    'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop',
    true
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  prep_time_minutes = EXCLUDED.prep_time_minutes,
  bake_time_minutes = EXCLUDED.bake_time_minutes,
  yield_servings = EXCLUDED.yield_servings,
  difficulty = EXCLUDED.difficulty,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions,
  image_url = EXCLUDED.image_url,
  is_published = EXCLUDED.is_published;
