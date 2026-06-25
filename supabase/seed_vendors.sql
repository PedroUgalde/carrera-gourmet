-- Seed: 10 vendors de ejemplo para Carrera Gourmet
-- Ejecutar en Supabase → SQL Editor (después de 001_initial_schema.sql)
-- Re-ejecutable: borra datos previos de seed

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Limpiar seed anterior
DELETE FROM public.menus WHERE vendor_id IN (
  SELECT v.id FROM public.vendors v
  JOIN public.users u ON u.id = v.user_id
  WHERE u.email LIKE 'seed-vendor-%@carrera-gourmet.demo'
);
DELETE FROM public.vendors WHERE user_id IN (
  SELECT id FROM public.users WHERE email LIKE 'seed-vendor-%@carrera-gourmet.demo'
);
DELETE FROM public.users WHERE email LIKE 'seed-vendor-%@carrera-gourmet.demo';
DELETE FROM auth.identities WHERE provider_id IN (
  SELECT id::text FROM auth.users WHERE email LIKE 'seed-vendor-%@carrera-gourmet.demo'
);
DELETE FROM auth.users WHERE email LIKE 'seed-vendor-%@carrera-gourmet.demo';

DO $$
DECLARE
  uid uuid;
  vid uuid;
  emails text[] := ARRAY[
    'seed-vendor-01@carrera-gourmet.demo','seed-vendor-02@carrera-gourmet.demo',
    'seed-vendor-03@carrera-gourmet.demo','seed-vendor-04@carrera-gourmet.demo',
    'seed-vendor-05@carrera-gourmet.demo','seed-vendor-06@carrera-gourmet.demo',
    'seed-vendor-07@carrera-gourmet.demo','seed-vendor-08@carrera-gourmet.demo',
    'seed-vendor-09@carrera-gourmet.demo','seed-vendor-10@carrera-gourmet.demo'
  ];
  em text;
BEGIN
  FOREACH em IN ARRAY emails LOOP
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      em, crypt('SeedVendor123!', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"vendor"}'::jsonb, false, '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), uid,
      jsonb_build_object('sub', uid::text, 'email', em, 'email_verified', true, 'phone_verified', false),
      'email', uid::text, NOW(), NOW(), NOW()
    );
  END LOOP;
END $$;

-- Vendors (user_id se resuelve por email)
INSERT INTO public.vendors (user_id, name, location_name, city, latitude, longitude, capacity_total, hours, tags, image_url)
SELECT u.id, v.name, v.location_name, v.city, v.lat, v.lng, v.cap, v.hours::jsonb, v.tags, v.image_url
FROM (VALUES
  ('seed-vendor-01@carrera-gourmet.demo', 'Tacos El Portales', 'Portales Sur', 'CDMX', 19.3712, -99.1405, 18, '{"mon":"10-22","tue":"10-22","wed":"10-22","thu":"10-22","fri":"10-23","sat":"10-23","sun":"11-21"}', ARRAY['Traditional','Beef','Spicy'], 'https://images.unsplash.com/photo-1565299585323-38174c4a1e7c?w=900&h=600&fit=crop'),
  ('seed-vendor-02@carrera-gourmet.demo', 'Antojitos La Güela', 'Portales Sur', 'CDMX', 19.3688, -99.1420, 15, '{"mon":"10-22","tue":"10-22","wed":"10-22","thu":"10-22","fri":"10-23","sat":"10-23","sun":"11-21"}', ARRAY['Traditional','Vegetarian'], 'https://images.unsplash.com/photo-1613514785949-d1550775989c?w=900&h=600&fit=crop'),
  ('seed-vendor-03@carrera-gourmet.demo', 'Tacos CU — ESCOM', 'Ciudad Universitaria, ESCOM', 'CDMX', 19.3244, -99.1778, 22, '{"mon":"9-21","tue":"9-21","wed":"9-21","thu":"9-21","fri":"9-22","sat":"10-20","sun":"10-19"}', ARRAY['Traditional','Budget','Spicy'], 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=900&h=600&fit=crop'),
  ('seed-vendor-04@carrera-gourmet.demo', 'Elotes del Pedregal', 'ESCOM, Ciudad Universitaria', 'CDMX', 19.3255, -99.1795, 12, '{"mon":"16-23","tue":"16-23","wed":"16-23","thu":"16-23","fri":"16-24","sat":"14-24","sun":"14-22"}', ARRAY['Vegetarian','Vegan'], 'https://images.unsplash.com/photo-1625944525537-42f498a70791?w=900&h=600&fit=crop'),
  ('seed-vendor-05@carrera-gourmet.demo', 'Tacos del Zócalo', 'Centro Histórico, Zócalo', 'CDMX', 19.4328, -99.1332, 30, '{"mon":"8-22","tue":"8-22","wed":"8-22","thu":"8-22","fri":"8-23","sat":"8-23","sun":"9-21"}', ARRAY['Traditional','Beef'], 'https://images.unsplash.com/photo-1599974579688-e975d7316732?w=900&h=600&fit=crop'),
  ('seed-vendor-06@carrera-gourmet.demo', 'Barbacoa Don Pepe', 'Zócalo', 'CDMX', 19.4340, -99.1345, 20, '{"mon":"7-15","tue":"7-15","wed":"7-15","thu":"7-15","fri":"7-15","sat":"7-16","sun":"7-16"}', ARRAY['Traditional','Beef'], 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&h=600&fit=crop'),
  ('seed-vendor-07@carrera-gourmet.demo', 'Tortas Azteca', 'Estadio Azteca', 'CDMX', 19.3030, -99.1510, 25, '{"mon":"10-22","tue":"10-22","wed":"10-22","thu":"10-22","fri":"10-23","sat":"10-23","sun":"11-21"}', ARRAY['Traditional','Pork'], 'https://images.unsplash.com/photo-1550547622-a9226c5ae518?w=900&h=600&fit=crop'),
  ('seed-vendor-08@carrera-gourmet.demo', 'Carnitas Calzada', 'Calzada de Tlalpan, Estadio Azteca', 'CDMX', 19.3015, -99.1495, 18, '{"mon":"9-20","tue":"9-20","wed":"9-20","thu":"9-20","fri":"9-21","sat":"9-21","sun":"10-18"}', ARRAY['Pork','Traditional'], 'https://images.unsplash.com/photo-1529042410799-b6611223cc5d?w=900&h=600&fit=crop'),
  ('seed-vendor-09@carrera-gourmet.demo', 'Birrieria El Compadre', 'Centro Histórico', 'Guadalajara', 20.6597, -103.3496, 24, '{"mon":"8-20","tue":"8-20","wed":"8-20","thu":"8-20","fri":"8-21","sat":"8-21","sun":"9-19"}', ARRAY['Traditional','Beef'], 'https://images.unsplash.com/photo-1618046368034-d55f20408220?w=900&h=600&fit=crop'),
  ('seed-vendor-10@carrera-gourmet.demo', 'Elotes y Esquites La Güera', 'Parque Fundidora', 'Monterrey', 25.6866, -100.3161, 14, '{"mon":"16-23","tue":"16-23","wed":"16-23","thu":"16-23","fri":"16-24","sat":"14-24","sun":"14-22"}', ARRAY['Vegetarian','Vegan'], 'https://images.unsplash.com/photo-1625944525537-42f498a70791?w=900&h=600&fit=crop')
) AS v(email, name, location_name, city, lat, lng, cap, hours, tags, image_url)
JOIN public.users u ON u.email = v.email;

-- Menús
INSERT INTO public.menus (vendor_id, item_name, description_original, description_translated, price, tags)
SELECT vd.id, m.item, m.desc_es, m.desc_en, m.price, m.tags
FROM (VALUES
  ('Tacos El Portales', 'Tacos de Suadero', 'Tacos de suadero con cebolla, cilantro y salsa roja', 'Slow-cooked beef brisket tacos (suadero) with onion, cilantro and red salsa', 35, ARRAY['Beef','Traditional']),
  ('Tacos El Portales', 'Quesadilla de Flor de Calabaza', 'Quesadilla con flor de calabaza y queso Oaxaca', 'Squash blossom quesadilla with Oaxaca cheese', 45, ARRAY['Vegetarian','Contains Dairy']),
  ('Antojitos La Güela', 'Esquites Portales', 'Esquites con epazote, limón y chile en polvo', 'Cup of corn kernels with epazote, lime and chili powder', 40, ARRAY['Vegetarian']),
  ('Tacos CU — ESCOM', 'Tacos de Longaniza', 'Tacos de longaniza con nopales y salsa verde', 'Spicy pork sausage tacos with cactus and green salsa near ESCOM', 30, ARRAY['Pork','Spicy']),
  ('Tacos CU — ESCOM', 'Gringa de Pastor', 'Gringa al pastor con piña y queso', 'Flour tortilla with marinated pork, pineapple and melted cheese', 55, ARRAY['Pork','Contains Dairy']),
  ('Elotes del Pedregal', 'Elote Preparado', 'Elote con mayonesa, chile, limón y queso', 'Grilled corn with mayo, chili powder, lime and cheese', 35, ARRAY['Vegetarian']),
  ('Elotes del Pedregal', 'Elote Vegano', 'Elote con mantequilla vegana y chile tajín', 'Grilled corn with vegan butter and tajín chili', 35, ARRAY['Vegan','Vegetarian']),
  ('Tacos del Zócalo', 'Tacos de Canasta', 'Tacos de canasta con papa y chicharrón', 'Steamed basket tacos with potato and pork rinds', 15, ARRAY['Traditional','Budget']),
  ('Tacos del Zócalo', 'Tacos al Pastor', 'Tacos al pastor con piña asada', 'Marinated pork tacos with grilled pineapple near the Zócalo', 42, ARRAY['Pork','Traditional']),
  ('Barbacoa Don Pepe', 'Barbacoa de Borrego', 'Barbacoa de borrego con consomé y tortillas', 'Slow-cooked lamb barbacoa with broth and fresh tortillas', 120, ARRAY['Traditional','Lamb']),
  ('Tortas Azteca', 'Torta de Milanesa', 'Torta de milanesa con aguacate y frijoles', 'Breaded cutlet sandwich with avocado and beans', 65, ARRAY['Pork','Traditional']),
  ('Tortas Azteca', 'Cemita de Puebla', 'Cemita con milanesa, quesillo y pápalo', 'Puebla-style sesame roll with cutlet, string cheese and pápalo herb', 75, ARRAY['Traditional','Contains Dairy']),
  ('Carnitas Calzada', 'Carnitas Mixtas', 'Carnitas surtidas con cuerito y tortillas hechas a mano', 'Mixed pork carnitas with crispy skin and handmade tortillas', 90, ARRAY['Pork','Traditional']),
  ('Birrieria El Compadre', 'Birria de Res', 'Birria estilo Jalisco con consomé', 'Slow-stewed beef birria with rich consommé — Jalisco specialty', 120, ARRAY['Beef','Traditional']),
  ('Elotes y Esquites La Güera', 'Esquites', 'Esquites con mayonesa, chile y limón', 'Cup of corn kernels with mayo, chili powder and lime', 45, ARRAY['Vegetarian']),
  ('Elotes y Esquites La Güera', 'Elote Vegano', 'Elote con mantequilla vegana y chile', 'Grilled corn with vegan butter and chili', 40, ARRAY['Vegan','Vegetarian'])
) AS m(vendor_name, item, desc_es, desc_en, price, tags)
JOIN public.vendors vd ON vd.name = m.vendor_name;
