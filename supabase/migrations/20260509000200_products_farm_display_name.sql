alter table public.profiles
  add column if not exists phone text,
  add column if not exists address text,
  add column if not exists shop_name text,
  add column if not exists farm_name text;

alter table public.products
  add column if not exists farm_name text,
  add column if not exists farm_location text;

update public.products
set
  farm_name = coalesce(
    public.products.farm_name,
    nullif(public.profiles.shop_name, ''),
    nullif(public.profiles.farm_name, ''),
    nullif(auth.users.raw_user_meta_data ->> 'shopName', ''),
    nullif(public.profiles.full_name, '')
  ),
  farm_location = coalesce(
    public.products.farm_location,
    nullif(public.profiles.address, ''),
    nullif(auth.users.raw_user_meta_data ->> 'address', '')
  )
from auth.users
left join public.profiles on public.profiles.id = auth.users.id
where public.products.farmer_id = auth.users.id;
