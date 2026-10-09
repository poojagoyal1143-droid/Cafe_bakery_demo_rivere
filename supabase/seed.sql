-- ==============================================================================
-- Riverè Cafe & Bakery - Production Seed Dataset
-- File: supabase/seed.sql
-- Description: Complete seed data for Menu Items, Tables Layout, and Recipes
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

-- 2. MENU ITEMS SEED (12 Items spanning 4 Pages of the 3D Flipbook)
INSERT INTO public.menu_items (
  title, slug, category, description, price, image_url, page_number, display_order, allergens, is_available, is_featured
)
VALUES
  -- PAGE 1: VIENNOISERIE
  (
    'Pain au Chocolat à l''Ancienne',
    'pain-au-chocolat-l-ancienne',
    'viennoiserie',
    'Hand-laminated 84% Normandy butter croissant pastry folded with dual batons of single-origin 64% Valrhona dark chocolate.',
    6.75,
    'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop',
    1,
    1,
    ARRAY['gluten', 'dairy', 'eggs'],
    true,
    true
  ),
  (
    'Kouign-Amann de Douarnenez',
    'kouign-amann-de-douarnenez',
    'viennoiserie',
    'Traditional Breton caramelized pastry layered with salted butter and coarse organic sugar crystals, slow-baked to a caramelized crown.',
    7.50,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    1,
    2,
    ARRAY['gluten', 'dairy'],
    true,
    true
  ),
  (
    'Cardamom Orange Cruffin',
    'cardamom-orange-cruffin',
    'viennoiserie',
    'Croissant muffin hybridization dusted with freshly ground Guatemalan green cardamom sugar and filled with Valencia orange curd.',
    7.25,
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    1,
    3,
    ARRAY['gluten', 'dairy', 'eggs'],
    true,
    false
  ),

  -- PAGE 2: PÂTISSERIE
  (
    'Valrhona Dark Chocolate Mille-Feuille',
    'valrhona-dark-chocolate-mille-feuille',
    'patisserie',
    'Caramelized inverted puff pastry leaves layered with 70% Guanaja chocolate cremeux and Tahiti vanilla whipped ganache.',
    12.50,
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop',
    2,
    1,
    ARRAY['gluten', 'dairy', 'eggs', 'soy'],
    true,
    true
  ),
  (
    'Pistachio Raspberry Tartlet',
    'pistachio-raspberry-tartlet',
    'patisserie',
    'Sweet sable shell filled with Sicilian pistachio frangipane, fresh raspberry compote, and hand-arranged ruby raspberries.',
    11.75,
    'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    2,
    2,
    ARRAY['gluten', 'dairy', 'eggs', 'tree_nuts'],
    true,
    false
  ),
  (
    'Vanilla Bean Paris-Brest',
    'vanilla-bean-paris-brest',
    'patisserie',
    'Crisp choux ring topped with toasted almonds, generously filled with praline mousseline and Bourbon vanilla diplomat cream.',
    10.50,
    'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1000&auto=format&fit=crop',
    2,
    3,
    ARRAY['gluten', 'dairy', 'eggs', 'tree_nuts'],
    true,
    false
  ),

  -- PAGE 3: ARTISAN BREADS
  (
    'Wild Yeast Country Boule (72-Hour)',
    'wild-yeast-country-boule-72-hour',
    'breads',
    'Stone-ground heritage stone-milled wheat and dark rye flour naturally fermented over 72 hours with our 10-year-old starter.',
    11.00,
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop',
    3,
    1,
    ARRAY['gluten'],
    true,
    true
  ),
  (
    'Sourdough Baguette Tradition',
    'sourdough-baguette-tradition',
    'breads',
    'Classic French baguette with high hydration, open honeycomb crumb structure, and an intensely blistered crisp crust.',
    5.50,
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    3,
    2,
    ARRAY['gluten'],
    true,
    false
  ),
  (
    'Roasted Garlic & Rosemary Focaccia',
    'roasted-garlic-rosemary-focaccia',
    'breads',
    'Genovese style olive oil focaccia topped with slow-roasted confit garlic cloves, sea salt flakes, and fresh rosemary sprigs.',
    8.50,
    'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1000&auto=format&fit=crop',
    3,
    3,
    ARRAY['gluten'],
    true,
    false
  ),

  -- PAGE 4: BEVERAGES & SEASONAL
  (
    'Lavender Honey Cortado',
    'lavender-honey-cortado',
    'beverages',
    'Double shot of Ethiopia Yirgacheffe espresso cut with equal parts steamed oat milk infused with wild Provence lavender and raw wildflower honey.',
    5.75,
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
    4,
    1,
    ARRAY[]::TEXT[],
    true,
    true
  ),
  (
    'Smoked Bourbon Vanilla Latte',
    'smoked-bourbon-vanilla-latte',
    'beverages',
    'Micro-foamed Guernsey whole milk layered over small-batch espresso and house-crafted Madagascar smoked vanilla syrup.',
    6.50,
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop',
    4,
    2,
    ARRAY['dairy'],
    true,
    false
  ),
  (
    'Spiced Apricot Brioche Feuilletée',
    'spiced-apricot-brioche-feuilletee',
    'seasonal',
    'Autumn seasonal special: Flaky laminated brioche ribboned with saffron apricot compote and toasted Marcona almonds.',
    8.75,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    4,
    3,
    ARRAY['gluten', 'dairy', 'eggs', 'tree_nuts'],
    true,
    true
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

-- 3. RECIPES SEED (2 Comprehensive Master Baker Recipes)
INSERT INTO public.recipes (
  title, slug, excerpt, prep_time_minutes, bake_time_minutes, yield_servings, difficulty, ingredients, instructions, image_url, is_published
)
VALUES
  (
    'Classic 72-Hour Sourdough Boule',
    'classic-72-hour-sourdough-boule',
    'Master the art of natural wild yeast fermentation with this signature high-hydration open-crumb sourdough loaf.',
    45,
    50,
    2,
    'artisan',
    '[
      {"item": "Bread Flour (12.7% protein)", "quantity": 800, "unit": "g"},
      {"item": "Whole Wheat Heritage Flour", "quantity": 200, "unit": "g"},
      {"item": "Water (90°F / 32°C)", "quantity": 780, "unit": "g"},
      {"item": "Active Levain (100% hydration)", "quantity": 200, "unit": "g"},
      {"item": "Fine Sea Salt", "quantity": 20, "unit": "g"}
    ]'::jsonb,
    '[
      {
        "step_number": 1,
        "title": "Autolyse",
        "detail": "Mix the bread flour, whole wheat flour, and 750g of water until no dry flour remains. Cover and let rest for 60 minutes."
      },
      {
        "step_number": 2,
        "title": "Incorporate Levain & Salt",
        "detail": "Add 200g active levain and dimple into the dough. Add fine sea salt dissolved in remaining 30g water. Perform stretch and fold for 5 minutes."
      },
      {
        "step_number": 3,
        "title": "Bulk Fermentation & Coil Folds",
        "detail": "Perform 4 sets of coil folds spaced 30 minutes apart over 4 hours at ambient 76°F until dough increases 50% in volume with domed edges."
      },
      {
        "step_number": 4,
        "title": "Shaping & Cold Fermentation",
        "detail": "Pre-shape into rounds, bench rest 20 minutes, then final shape into round boules. Place into rice-floured bannetons and cold ferment for 48 hours."
      },
      {
        "step_number": 5,
        "title": "Bake in Dutch Oven",
        "detail": "Preheat Dutch oven to 500°F (260°C). Score the boule, transfer onto parchment, bake covered with steam for 20 mins, then uncovered at 450°F for 25 mins until mahogany."
      }
    ]'::jsonb,
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop',
    true
  ),
  (
    'Valrhona Dark Chocolate Ganache Tart',
    'valrhona-dark-chocolate-ganache-tart',
    'An exquisite showcase of crisp cacao sable pastry filled with silky 70% Guanaja chocolate emulsion and sea salt flakes.',
    60,
    25,
    8,
    'master_baker',
    '[
      {"item": "Unsalted Butter (Normandy)", "quantity": 125, "unit": "g"},
      {"item": "Confectioners Sugar", "quantity": 90, "unit": "g"},
      {"item": "Egg Yolk", "quantity": 2, "unit": "pcs"},
      {"item": "Pastry Flour", "quantity": 200, "unit": "g"},
      {"item": "Dutch Process Cocoa Powder", "quantity": 30, "unit": "g"},
      {"item": "Valrhona Guanaja 70% Chocolate", "quantity": 300, "unit": "g"},
      {"item": "Heavy Cream (36% fat)", "quantity": 300, "unit": "g"},
      {"item": "Maldon Sea Salt Flakes", "quantity": 2, "unit": "g"}
    ]'::jsonb,
    '[
      {
        "step_number": 1,
        "title": "Cacao Sablée Pastry",
        "detail": "Cream butter and confectioners sugar until pale. Add egg yolks. Sift in flour and cocoa powder. Press into disk and chill 2 hours."
      },
      {
        "step_number": 2,
        "title": "Blind Baking",
        "detail": "Roll pastry to 3mm thickness, line an 8-inch tart ring, dock the base, and blind bake with pie weights at 325°F (165°C) for 20 minutes until crisp."
      },
      {
        "step_number": 3,
        "title": "Silky Ganache Emulsion",
        "detail": "Scald heavy cream and pour over chopped Valrhona chocolate in three additions, stirring with a rubber spatula in small concentric circles until glossy."
      },
      {
        "step_number": 4,
        "title": "Pour & Set",
        "detail": "Pour warm ganache into cooled tart shell. Tap gently to release air bubbles. Allow to set at room temperature (65°F) for 4 hours."
      },
      {
        "step_number": 5,
        "title": "Finish",
        "detail": "Finish with a delicate sprinkle of Maldon flaky sea salt prior to slicing with a hot, clean knife."
      }
    ]'::jsonb,
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop',
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
