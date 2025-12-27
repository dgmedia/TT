-- Pebble Studio: Themes Table
-- Run this in Supabase SQL Editor (SQL Editor → New Query → Paste → Run)

-- Create themes table
create table if not exists themes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Theme metadata
  name text not null,
  description text,
  author text default 'Anonymous',
  
  -- Configuration data
  media jsonb,
  colors jsonb,
  text_content jsonb,
  
  -- Visibility & stats
  is_public boolean default false,
  likes integer default 0,
  views integer default 0,
  
  -- Optional: preview thumbnail URL
  thumbnail_url text
);

-- Create index for faster public theme queries
create index if not exists themes_public_idx on themes (is_public, created_at desc);
create index if not exists themes_likes_idx on themes (likes desc);

-- Enable Row Level Security
alter table themes enable row level security;

-- Policy: Anyone can read public themes
create policy "Public themes are viewable by everyone"
  on themes for select
  using (is_public = true);

-- Policy: Anyone can read their own themes by ID (for private configs)
create policy "Anyone can view theme by ID"
  on themes for select
  using (true);

-- Policy: Anyone can create themes
create policy "Anyone can create themes"
  on themes for insert
  with check (true);

-- Policy: Anyone can update view count
create policy "Anyone can update views"
  on themes for update
  using (true)
  with check (true);

-- Function to increment views
create or replace function increment_views(theme_id uuid)
returns void as $$
begin
  update themes set views = views + 1 where id = theme_id;
end;
$$ language plpgsql;

-- Function to increment likes
create or replace function increment_likes(theme_id uuid)
returns void as $$
begin
  update themes set likes = likes + 1 where id = theme_id;
end;
$$ language plpgsql;
