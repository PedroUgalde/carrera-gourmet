-- Seed data for Carrera Gourmet demo
-- Run AFTER migration. Creates demo vendor users via auth is not possible here;
-- instead insert vendors directly (for demo/testing without auth users).

-- Demo vendors (no user_id FK — for local demo only, skip if using real auth)
-- Use this block only if you want standalone demo data without registered vendors.
-- Replace UUIDs with actual auth user IDs after registering vendor accounts.

-- Example: insert demo vendors with fixed UUIDs for testing recommend API
-- Uncomment and adjust user_ids after creating vendor accounts in Supabase Auth.

/*
-- Vendor 1: Tacos El Güero (CDMX)
insert into public.vendors (id, user_id, name, location_name, city, latitude, longitude, capacity_total, hours, tags)
values (
  '11111111-1111-1111-1111-111111111101',
  '<VENDOR_USER_ID_1>',
  'Tacos El Güero',
  'Colonia Roma Norte',
  'CDMX',
  19.42, -99.15,
  20,
  '{"mon":"10-22","tue":"10-22","wed":"10-22","thu":"10-22","fri":"10-23","sat":"10-23","sun":"11-21"}',
  ARRAY['Traditional', 'Beef', 'Spicy']
);

insert into public.menus (vendor_id, item_name, description_original, description_translated, price, tags) values
('11111111-1111-1111-1111-111111111101', 'Tacos de Suadero', 'Tacos de suadero con cebolla y cilantro', 'Beef brisket tacos (suadero is slow-cooked beef) with onion and cilantro', 35.00, ARRAY['Beef', 'Traditional']),
('11111111-1111-1111-1111-111111111101', 'Tacos al Pastor', 'Tacos al pastor con piña y salsa roja', 'Marinated pork tacos with pineapple and red salsa — a Mexico City classic', 40.00, ARRAY['Pork', 'Spicy', 'Traditional']);

-- Vendor 2: Tlayudas Doña Lupita (CDMX)
insert into public.vendors (id, user_id, name, location_name, city, latitude, longitude, capacity_total, hours, tags)
values (
  '11111111-1111-1111-1111-111111111102',
  '<VENDOR_USER_ID_2>',
  'Tlayudas Oaxaqueñas Doña Lupita',
  'Coyoacán',
  'CDMX',
  19.35, -99.08,
  15,
  '{"mon":"9-21","tue":"9-21","wed":"9-21","thu":"9-21","fri":"9-22","sat":"9-22","sun":"10-20"}',
  ARRAY['Vegetarian', 'Traditional']
);

insert into public.menus (vendor_id, item_name, description_original, description_translated, price, tags) values
('11111111-1111-1111-1111-111111111102', 'Tlayuda Clásica', 'Tlayuda con frijol, quesillo y tasajo', 'Large crispy Oaxacan tortilla with beans, Oaxaca cheese and dried beef', 85.00, ARRAY['Traditional']),
('11111111-1111-1111-1111-111111111102', 'Tlayuda Vegana', 'Tlayuda con frijol, nopales y aguacate', 'Vegan tlayuda with beans, cactus and avocado', 75.00, ARRAY['Vegan', 'Vegetarian']);

-- Vendor 3: Birrieria El Compadre (Guadalajara)
insert into public.vendors (id, user_id, name, location_name, city, latitude, longitude, capacity_total, hours, tags)
values (
  '22222222-2222-2222-2222-222222222201',
  '<VENDOR_USER_ID_3>',
  'Birrieria El Compadre',
  'Centro Histórico',
  'Guadalajara',
  20.67, -103.34,
  25,
  '{"mon":"8-20","tue":"8-20","wed":"8-20","thu":"8-20","fri":"8-21","sat":"8-21","sun":"9-19"}',
  ARRAY['Traditional', 'Beef']
);

insert into public.menus (vendor_id, item_name, description_original, description_translated, price, tags) values
('22222222-2222-2222-2222-222222222201', 'Birria de Res', 'Birria estilo Jalisco con consomé', 'Slow-stewed beef birria with rich consommé broth — Jalisco specialty', 120.00, ARRAY['Beef', 'Traditional']),
('22222222-2222-2222-2222-222222222201', 'Quesabirria', 'Quesabirria con queso fundido', 'Crispy birria taco with melted cheese — viral street food favorite', 65.00, ARRAY['Beef', 'Contains Dairy']);

-- Vendor 4: Tortas Ahogadas La Chiva (Guadalajara)
insert into public.vendors (id, user_id, name, location_name, city, latitude, longitude, capacity_total, hours, tags)
values (
  '22222222-2222-2222-2222-222222222202',
  '<VENDOR_USER_ID_4>',
  'Tortas Ahogadas La Chiva',
  'Mercado Libertad',
  'Guadalajara',
  20.65, -103.35,
  18,
  '{"mon":"9-19","tue":"9-19","wed":"9-19","thu":"9-19","fri":"9-20","sat":"9-20","sun":"10-18"}',
  ARRAY['Spicy', 'Pork', 'Traditional']
);

insert into public.menus (vendor_id, item_name, description_original, description_translated, price, tags) values
('22222222-2222-2222-2222-222222222202', 'Torta Ahogada', 'Torta ahogada con carnitas y salsa picante', 'Drowned sandwich with carnitas pork in spicy tomato sauce — Guadalajara icon', 55.00, ARRAY['Pork', 'Spicy']),
('22222222-2222-2222-2222-222222222202', 'Torta Ahogada Suave', 'Torta ahogada con salsa menos picante', 'Same drowned sandwich with milder sauce for sensitive palates', 55.00, ARRAY['Pork']);

-- Vendor 5: Cabrito Don Ramón (Monterrey)
insert into public.vendors (id, user_id, name, location_name, city, latitude, longitude, capacity_total, hours, tags)
values (
  '33333333-3333-3333-3333-333333333301',
  '<VENDOR_USER_ID_5>',
  'Cabrito Don Ramón',
  'Barrio Antiguo',
  'Monterrey',
  25.67, -100.31,
  30,
  '{"mon":"11-22","tue":"11-22","wed":"11-22","thu":"11-22","fri":"11-23","sat":"11-23","sun":"12-21"}',
  ARRAY['Traditional', 'Goat']
);

insert into public.menus (vendor_id, item_name, description_original, description_translated, price, tags) values
('33333333-3333-3333-3333-333333333301', 'Cabrito al Horno', 'Cabrito al horno estilo Monterrey', 'Slow-roasted young goat — Monterrey''s signature dish', 250.00, ARRAY['Goat', 'Traditional']),
('33333333-3333-3333-3333-333333333301', 'Machaca con Huevo', 'Machaca con huevo y frijoles', 'Shredded dried beef with scrambled eggs and beans — northern breakfast staple', 95.00, ARRAY['Beef', 'Traditional']);

-- Vendor 6: Elotes y Esquites La Güera (Monterrey)
insert into public.vendors (id, user_id, name, location_name, city, latitude, longitude, capacity_total, hours, tags)
values (
  '33333333-3333-3333-3333-333333333302',
  '<VENDOR_USER_ID_6>',
  'Elotes y Esquites La Güera',
  'Parque Fundidora',
  'Monterrey',
  25.69, -100.29,
  12,
  '{"mon":"16-23","tue":"16-23","wed":"16-23","thu":"16-23","fri":"16-24","sat":"14-24","sun":"14-22"}',
  ARRAY['Vegetarian', 'Vegan']
);

insert into public.menus (vendor_id, item_name, description_original, description_translated, price, tags) values
('33333333-3333-3333-3333-333333333302', 'Esquites', 'Esquites con mayonesa, chile y limón', 'Cup of corn kernels with mayo, chili powder and lime — classic street snack', 45.00, ARRAY['Vegetarian']),
('33333333-3333-3333-3333-333333333302', 'Elote Vegano', 'Elote con mantequilla vegana y chile', 'Grilled corn on the cob with vegan butter and chili — plant-based option', 40.00, ARRAY['Vegan', 'Vegetarian']);
*/

-- Demo data without auth (for API testing only — disable FK temporarily not recommended)
-- Instead, use the seed API route at /api/seed for programmatic seeding.
