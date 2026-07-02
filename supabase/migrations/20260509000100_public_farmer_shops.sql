alter table public.profiles
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists shop_name text,
  add column if not exists farm_name text,
  add column if not exists bio text,
  add column if not exists avatar_url text;

create or replace function public.get_public_farmer_shops(farmer_ids uuid[] default null)
returns table (
  id uuid,
  full_name text,
  shop_name text,
  farm_name text,
  address text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    profiles.id,
    profiles.full_name,
    profiles.shop_name,
    profiles.farm_name,
    profiles.address
  from public.profiles
  where profiles.role = 'farmer'
    and (farmer_ids is null or profiles.id = any(farmer_ids));
$$;

grant execute on function public.get_public_farmer_shops(uuid[]) to anon, authenticated;

update public.profiles
set
  shop_name = coalesce(public.profiles.shop_name, auth.users.raw_user_meta_data ->> 'shopName'),
  farm_name = coalesce(public.profiles.farm_name, auth.users.raw_user_meta_data ->> 'shopName'),
  address = coalesce(public.profiles.address, auth.users.raw_user_meta_data ->> 'address'),
  phone = coalesce(public.profiles.phone, auth.users.raw_user_meta_data ->> 'phone'),
  updated_at = now()
from auth.users
where auth.users.id = public.profiles.id
  and public.profiles.role = 'farmer';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    role,
    shop_name,
    farm_name,
    address,
    phone
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer'),
    new.raw_user_meta_data ->> 'shopName',
    new.raw_user_meta_data ->> 'shopName',
    new.raw_user_meta_data ->> 'address',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    shop_name = excluded.shop_name,
    farm_name = excluded.farm_name,
    address = excluded.address,
    phone = excluded.phone,
    updated_at = now();

  return new;
end;
$$;
