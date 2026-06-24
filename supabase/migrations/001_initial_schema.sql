-- Carrera Gourmet — Initial Schema
create extension if not exists "uuid-ossp";

-- Perfil de usuario (extiende auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('tourist', 'vendor')),
  created_at timestamptz default now()
);

-- Comercios
create table public.vendors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade unique,
  name text not null,
  location_name text not null,
  city text not null check (city in ('CDMX', 'Guadalajara', 'Monterrey')),
  latitude double precision not null,
  longitude double precision not null,
  capacity_total integer not null check (capacity_total > 0),
  hours jsonb not null default '{}',
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Menú
create table public.menus (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  item_name text not null,
  description_original text not null,
  description_translated text,
  price numeric(10,2) not null check (price >= 0),
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Reservas
create table public.reservations (
  id uuid primary key default uuid_generate_v4(),
  tourist_id uuid not null references public.users(id),
  vendor_id uuid not null references public.vendors(id),
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled', 'completed')),
  party_size integer not null check (party_size > 0),
  reservation_time timestamptz not null default now(),
  created_at timestamptz default now()
);

-- Índices
create index idx_vendors_city on public.vendors(city);
create index idx_vendors_coords on public.vendors(latitude, longitude);
create index idx_menus_vendor on public.menus(vendor_id);
create index idx_reservations_vendor_status on public.reservations(vendor_id, status);

-- Vista: aforo disponible por vendor
create or replace view public.vendor_capacity as
select
  v.id as vendor_id,
  v.capacity_total,
  coalesce(sum(r.party_size) filter (where r.status = 'confirmed'), 0)::integer as occupied,
  (v.capacity_total - coalesce(sum(r.party_size) filter (where r.status = 'confirmed'), 0))::integer as available
from public.vendors v
left join public.reservations r on r.vendor_id = v.id
group by v.id, v.capacity_total;

-- Trigger: crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'tourist')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.users enable row level security;
alter table public.vendors enable row level security;
alter table public.menus enable row level security;
alter table public.reservations enable row level security;

create policy "users read own" on public.users for select using (auth.uid() = id);
create policy "vendors public read" on public.vendors for select using (true);
create policy "vendors insert own" on public.vendors for insert with check (auth.uid() = user_id);
create policy "vendors update own" on public.vendors for update using (auth.uid() = user_id);
create policy "menus public read" on public.menus for select using (true);
create policy "menus manage own vendor" on public.menus for all using (
  vendor_id in (select id from public.vendors where user_id = auth.uid())
);
create policy "reservations tourist insert" on public.reservations for insert
  with check (auth.uid() = tourist_id);
create policy "reservations read own" on public.reservations for select using (
  auth.uid() = tourist_id or vendor_id in (select id from public.vendors where user_id = auth.uid())
);

-- RPC: reservar con validación atómica de aforo
create or replace function public.book_reservation(
  p_tourist_id uuid,
  p_vendor_id uuid,
  p_party_size int
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_capacity_total int;
  v_occupied int;
  v_available int;
  v_reservation_id uuid;
begin
  select capacity_total into v_capacity_total
  from public.vendors where id = p_vendor_id for update;

  if v_capacity_total is null then
    raise exception 'Vendor not found';
  end if;

  select coalesce(sum(party_size), 0)::int into v_occupied
  from public.reservations
  where vendor_id = p_vendor_id and status = 'confirmed';

  v_available := v_capacity_total - v_occupied;

  if v_available < p_party_size then
    raise exception 'Insufficient capacity';
  end if;

  insert into public.reservations (tourist_id, vendor_id, party_size)
  values (p_tourist_id, p_vendor_id, p_party_size)
  returning id into v_reservation_id;

  return v_reservation_id;
end;
$$;
