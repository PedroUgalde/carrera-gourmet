-- Add image support for vendor storefront photos
alter table public.vendors
  add column if not exists image_url text;
