-- Simplified Supabase schema - only store used troops and map areas with full attributes

-- Create used_troops table (stores all troop attributes and tracks usage)
CREATE TABLE IF NOT EXISTS used_troops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tier INTEGER NOT NULL,
  type TEXT NOT NULL,
  occupation TEXT NOT NULL,
  faction TEXT NOT NULL,
  banner TEXT NOT NULL,
  culture TEXT NOT NULL,
  image TEXT NOT NULL,
  used_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create used_map_areas table (stores all map area attributes and tracks usage)
CREATE TABLE IF NOT EXISTS used_map_areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  faction TEXT NOT NULL,
  type TEXT NOT NULL,
  coordinates JSONB NOT NULL, -- [x, y] coordinates array
  used_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE used_troops ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_map_areas ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on used_troops" ON used_troops FOR SELECT USING (true);
CREATE POLICY "Allow public read access on used_map_areas" ON used_map_areas FOR SELECT USING (true);

-- Create policies to allow public write access
CREATE POLICY "Allow public write access on used_troops" ON used_troops FOR ALL USING (true);
CREATE POLICY "Allow public write access on used_map_areas" ON used_map_areas FOR ALL USING (true);
