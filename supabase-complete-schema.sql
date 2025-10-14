-- Complete Supabase Schema for Bannerlord Quest Game
-- This schema includes all tables for the database-driven system
-- Built-in Node.js scheduler handles daily selections (no database scheduling needed)

-- =============================================
-- CORE GAME DATA TABLES
-- =============================================

-- Create troops table to store all troop data
CREATE TABLE IF NOT EXISTS troops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  tier INTEGER NOT NULL CHECK (tier >= 1 AND tier <= 6),
  type TEXT NOT NULL CHECK (type IN ('Archer', 'Cavalry', 'Infantry', 'Mounted Archer')),
  occupation TEXT NOT NULL CHECK (occupation IN ('Mercenary', 'Soldier', 'Bandit')),
  faction TEXT NOT NULL,
  banner TEXT NOT NULL,
  culture TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create map_areas table to store all map area data
CREATE TABLE IF NOT EXISTS map_areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  faction TEXT NOT NULL,
  type TEXT NOT NULL,
  coordinates JSONB NOT NULL, -- [x, y] coordinates array
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- GAME STATE TRACKING TABLES
-- =============================================

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

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Troops table indexes
CREATE INDEX IF NOT EXISTS idx_troops_name ON troops(name);
CREATE INDEX IF NOT EXISTS idx_troops_faction ON troops(faction);
CREATE INDEX IF NOT EXISTS idx_troops_culture ON troops(culture);
CREATE INDEX IF NOT EXISTS idx_troops_tier ON troops(tier);
CREATE INDEX IF NOT EXISTS idx_troops_type ON troops(type);
CREATE INDEX IF NOT EXISTS idx_troops_occupation ON troops(occupation);

-- Map areas table indexes
CREATE INDEX IF NOT EXISTS idx_map_areas_name ON map_areas(name);
CREATE INDEX IF NOT EXISTS idx_map_areas_faction ON map_areas(faction);
CREATE INDEX IF NOT EXISTS idx_map_areas_type ON map_areas(type);

-- Used troops table indexes
CREATE INDEX IF NOT EXISTS idx_used_troops_name ON used_troops(name);
CREATE INDEX IF NOT EXISTS idx_used_troops_date ON used_troops(used_date);
CREATE INDEX IF NOT EXISTS idx_used_troops_faction ON used_troops(faction);

-- Used map areas table indexes
CREATE INDEX IF NOT EXISTS idx_used_map_areas_name ON used_map_areas(name);
CREATE INDEX IF NOT EXISTS idx_used_map_areas_date ON used_map_areas(used_date);
CREATE INDEX IF NOT EXISTS idx_used_map_areas_faction ON used_map_areas(faction);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_troops_updated_at 
    BEFORE UPDATE ON troops 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_map_areas_updated_at 
    BEFORE UPDATE ON map_areas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS FOR MONITORING
-- =============================================

-- Create a view to check data status
CREATE OR REPLACE VIEW data_status AS
SELECT 
  'troops' as table_name,
  COUNT(*) as total_records,
  MIN(created_at) as first_created,
  MAX(updated_at) as last_updated
FROM troops
UNION ALL
SELECT 
  'map_areas' as table_name,
  COUNT(*) as total_records,
  MIN(created_at) as first_created,
  MAX(updated_at) as last_updated
FROM map_areas
UNION ALL
SELECT 
  'used_troops' as table_name,
  COUNT(*) as total_records,
  MIN(used_date) as first_created,
  MAX(used_date) as last_updated
FROM used_troops
UNION ALL
SELECT 
  'used_map_areas' as table_name,
  COUNT(*) as total_records,
  MIN(used_date) as first_created,
  MAX(used_date) as last_updated
FROM used_map_areas;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE troops ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_troops ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_map_areas ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY POLICIES
-- =============================================

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on troops" ON troops FOR SELECT USING (true);
CREATE POLICY "Allow public read access on map_areas" ON map_areas FOR SELECT USING (true);
CREATE POLICY "Allow public read access on used_troops" ON used_troops FOR SELECT USING (true);
CREATE POLICY "Allow public read access on used_map_areas" ON used_map_areas FOR SELECT USING (true);

-- Create policies to allow public write access
CREATE POLICY "Allow public write access on troops" ON troops FOR ALL USING (true);
CREATE POLICY "Allow public write access on map_areas" ON map_areas FOR ALL USING (true);
CREATE POLICY "Allow public write access on used_troops" ON used_troops FOR ALL USING (true);
CREATE POLICY "Allow public write access on used_map_areas" ON used_map_areas FOR ALL USING (true);

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON TABLE troops IS 'Master table containing all available troops data';
COMMENT ON TABLE map_areas IS 'Master table containing all available map areas data';
COMMENT ON TABLE used_troops IS 'Tracks which troops have been used and when';
COMMENT ON TABLE used_map_areas IS 'Tracks which map areas have been used and when';

COMMENT ON COLUMN troops.tier IS 'Troop tier from 1 (lowest) to 6 (highest)';
COMMENT ON COLUMN troops.type IS 'Troop type: Archer, Cavalry, Infantry, or Mounted Archer';
COMMENT ON COLUMN troops.occupation IS 'Troop occupation: Mercenary, Soldier, or Bandit';
COMMENT ON COLUMN map_areas.coordinates IS 'JSON array containing [x, y] coordinates for map positioning';

-- =============================================
-- SCHEMA COMPLETION
-- =============================================

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Bannerlord Quest Database Schema Setup Complete!';
    RAISE NOTICE 'Tables created: troops, map_areas, used_troops, used_map_areas';
    RAISE NOTICE 'Functions created: update_updated_at_column';
    RAISE NOTICE 'Views created: data_status';
    RAISE NOTICE 'Scheduling: Built-in Node.js scheduler runs daily at 15:00 UTC';
    RAISE NOTICE 'Next step: Run data migration to populate troops and map_areas tables';
END $$;

INSERT INTO troops (name, tier, type, banner, occupation, faction, culture, image) VALUES
  ('Vlandian Voulgier', 5, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Voulgier.PNG'),
  ('Vlandian Vanguard', 5, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Vanguard.PNG'),
  ('Vlandian Swordsman', 4, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Swordsman.PNG'),
  ('Vlandian Squire', 2, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Squire.PNG'),
  ('Vlandian Spearman', 3, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Spearman.PNG'),
  ('Vlandian Sharpshooter', 5, 'Archer', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Sharpshooter.PNG'),
  ('Vlandian Sergeant', 5, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Sergeant.PNG'),
  ('Vlandian Recruit', 1, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Recruit.PNG'),
  ('Vlandian Pikeman', 5, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Pikeman.PNG'),
  ('Vlandian Light Cavalry', 3, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Light_Cavalry.PNG'),
  ('Vlandian Levy Crossbowman', 2, 'Archer', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Levy_Crossbowman.PNG'),
  ('Vlandian Knight', 4, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Knight.PNG'),
  ('Vlandian Hardened Crossbowman', 4, 'Archer', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Hardened_Crossbowman.PNG'),
  ('Vlandian Galland', 3, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Galland.PNG'),
  ('Vlandian Footman', 2, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Footman.PNG'),
  ('Vlandian Crossbowman', 3, 'Archer', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Crossbowman.PNG'),
  ('Vlandian Champion', 5, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Champion.PNG'),
  ('Vlandian Cavalry', 4, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Cavalry.PNG'),
  ('Vlandian Billman', 4, 'Infantry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Billman.PNG'),
  ('Vlandian Banner Knight', 6, 'Cavalry', 'Factions/Kingdom_of_Vlandia.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Vlandia/Vlandian_Banner_Knight.PNG'),
  ('Sturgian Archer', 4, 'Archer', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Archer.PNG'),
  ('Sturgian Brigand', 3, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Brigand.PNG'),
  ('Sturgian Druzhinnik', 5, 'Cavalry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Druzhinnik.PNG'),
  ('Sturgian Druzhinnik Champion', 6, 'Cavalry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Druzhinnik_Champion.PNG'),
  ('Sturgian Hardened Brigand', 4, 'Cavalry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Hardened_Brigand.PNG'),
  ('Sturgian Heavy Axeman', 5, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Heavy_Axeman.PNG'),
  ('Sturgian Heavy Spearman', 5, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Heavy_Spearman.PNG'),
  ('Sturgian Horse Raider', 5, 'Cavalry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Horse_Raider.PNG'),
  ('Sturgian Hunter', 3, 'Archer', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Hunter.PNG'),
  ('Sturgian Line Breaker', 4, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Line_Breaker.PNG'),
  ('Sturgian Otrok', 2, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Otrok.PNG'),
  ('Sturgian Recruit', 1, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Recruit.PNG'),
  ('Sturgian Soldier', 3, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Soldier.PNG'),
  ('Sturgian Spearman', 4, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Spearman.PNG'),
  ('Sturgian Veteran Bowman', 5, 'Archer', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Veteran_Bowman.PNG'),
  ('Sturgian Warrior', 6, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Warrior.PNG'),
  ('Sturgian Woodsman', 2, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Sturgian_Woodsman.PNG'),
  ('Varyag', 3, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Varyag.PNG'),
  ('Varyag Veteran', 4, 'Infantry', 'Factions/Principality_of_Sturgia.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Sturgia/Varyag_Veteran.PNG'),
  ('Khuzait Archer', 4, 'Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Archer.PNG'),
  ('Khuzait Darkhan', 5, 'Infantry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Darkhan.PNG'),
  ('Khuzait Footman', 2, 'Infantry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Footman.PNG'),
  ('Khuzait Heavy Horse Archer', 5, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Heavy_Horse_Archer.PNG'),
  ('Khuzait Heavy Lancer', 5, 'Cavalry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Heavy_Lancer.PNG'),
  ('Khuzait Horse Archer', 4, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Horse_Archer.PNG'),
  ('Khuzait Horseman', 3, 'Cavalry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Horseman.PNG'),
  ('Khuzait Hunter', 3, 'Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Hunter.PNG'),
  ('Khuzait Khan''s Guard', 6, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Khan''s_Guard.PNG'),
  ('Khuzait Kheshig', 5, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Kheshig.PNG'),
  ('Khuzait Lancer', 4, 'Cavalry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Lancer.PNG'),
  ('Khuzait Marksman', 5, 'Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Marksman.PNG'),
  ('Khuzait Noble''s Son', 2, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Noble''s_Son.PNG'),
  ('Khuzait Nomad', 1, 'Infantry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Nomad.PNG'),
  ('Khuzait Qanqli', 3, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Qanqli.PNG'),
  ('Khuzait Raider', 3, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Raider.PNG'),
  ('Khuzait Spear Infantry', 4, 'Infantry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Spear_Infantry.PNG'),
  ('Khuzait Spearman', 3, 'Infantry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Spearman.PNG'),
  ('Khuzait Torguud', 4, 'Mounted Archer', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Torguud.PNG'),
  ('Khuzait Tribal Warrior', 2, 'Infantry', 'Factions/Khuzait_Khanate.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Khuzait/Khuzait_Tribal_Warrior.PNG'),
  ('Imperial Archer', 2, 'Archer', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Archer.PNG'),
  ('Imperial Bucellarii', 5, 'Mounted Archer', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Bucellarii.PNG'),
  ('Imperial Cataphract', 5, 'Cavalry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Cataphract.PNG'),
  ('Imperial Crossbowman', 4, 'Archer', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Crossbowman.PNG'),
  ('Imperial Elite Cataphract', 6, 'Cavalry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Elite_Cataphract.PNG'),
  ('Imperial Elite Menavliaton', 5, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Elite_Menavliaton.PNG'),
  ('Imperial Equite', 3, 'Cavalry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Equite.PNG'),
  ('Imperial Heavy Horseman', 4, 'Cavalry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Heavy_Horseman.PNG'),
  ('Imperial Infantryman', 2, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Infantryman.PNG'),
  ('Imperial Legionary', 5, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Legionary.PNG'),
  ('Imperial Menavliaton', 4, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Menavliaton.PNG'),
  ('Imperial Palatine Guard', 5, 'Archer', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Palatine_Guard.PNG'),
  ('Imperial Recruit', 1, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Recruit.PNG'),
  ('Imperial Sergeant Crossbowman', 5, 'Archer', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Sergeant_Crossbowman.PNG'),
  ('Imperial Trained Archer', 3, 'Archer', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Trained_Archer.PNG'),
  ('Imperial Trained Infantryman', 3, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Trained_Infantryman.PNG'),
  ('Imperial Veteran Archer', 4, 'Archer', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Veteran_Archer.PNG'),
  ('Imperial Veteran Infantryman', 4, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Veteran_Infantryman.PNG'),
  ('Imperial Vigla Recruit', 2, 'Infantry', 'Factions/Calradic_Empire.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Empire/Imperial_Vigla_Recruit.PNG'),
  ('Battanian Horseman', 5, 'Cavalry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Horseman.PNG'),
  ('Battanian Clan Warrior', 2, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Clan_Warrior.PNG'),
  ('Battanian Falxman', 4, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Falxman.PNG'),
  ('Battanian Oathsworn', 5, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Oathsworn.PNG'),
  ('Battanian Picked Warrior', 4, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Picked_Warrior.PNG'),
  ('Battanian Raider', 3, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Raider.PNG'),
  ('Battanian Scout', 4, 'Cavalry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Scout.PNG'),
  ('Battanian Skirmisher', 3, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Skirmisher.PNG'),
  ('Battanian Trained Warrior', 3, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Trained_Warrior.PNG'),
  ('Battanian Veteran Skirmisher', 4, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Veteran_Skirmisher.PNG'),
  ('Battanian Volunteer', 1, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Volunteer.PNG'),
  ('Battanian Wood Runner', 2, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Wood_Runner.PNG'),
  ('Battanian Veteran Falxman', 5, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Veteran_Falxman.PNG'),
  ('Battanian Wildling', 5, 'Infantry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Wildling.PNG'),
  ('Battanian Mounted Skirmisher', 5, 'Cavalry', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Mounted_Skirmisher.PNG'),
  ('Battanian Highborn Youth', 2, 'Archer', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Highborn_Youth.PNG'),
  ('Battanian Highborn Warrior', 3, 'Archer', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Highborn_Warrior.PNG'),
  ('Battanian Hero', 4, 'Archer', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Hero.PNG'),
  ('Battanian Fian', 5, 'Archer', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Fian.PNG'),
  ('Battanian Fian Champion', 6, 'Archer', 'Factions/High_Kingdom_of_the_Battanians.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Battania/Battanian_Fian_Champion.PNG'),
  ('Aserai Archer', 4, 'Archer', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Archer.PNG'),
  ('Aserai Faris', 4, 'Cavalry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Faris.PNG'),
  ('Aserai Footman', 3, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Footman.PNG'),
  ('Aserai Infantry', 4, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Infantry.PNG'),
  ('Aserai Light Archer', 3, 'Archer', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Light_Archer.PNG'),
  ('Aserai Mamluke Axeman', 3, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Mamluke_Axeman.PNG'),
  ('Aserai Mamluke Cavalry', 4, 'Mounted Archer', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Mamluke_Cavalry.PNG'),
  ('Aserai Mamluke Guard', 4, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Mamluke_Guard.PNG'),
  ('Aserai Mamluke Heavy Cavalry', 5, 'Mounted Archer', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Mamluke_Heavy_Cavalry.PNG'),
  ('Aserai Mamluke Palace Guard', 5, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Mamluke_Palace_Guard.PNG'),
  ('Aserai Mamluke Regular', 3, 'Cavalry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Mamluke_Regular.PNG'),
  ('Aserai Mamluke Soldier', 2, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Mamluke_Soldier.PNG'),
  ('Aserai Master Archer', 5, 'Archer', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Master_Archer.PNG'),
  ('Aserai Recruit', 1, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Recruit.PNG'),
  ('Aserai Tribal Horseman', 3, 'Cavalry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Tribal_Horseman.PNG'),
  ('Aserai Tribesman', 2, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Tribesman.PNG'),
  ('Aserai Vanguard Faris', 6, 'Cavalry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Vanguard_Faris.PNG'),
  ('Aserai Veteran Faris', 5, 'Cavalry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Veteran_Faris.PNG'),
  ('Aserai Veteran Infantry', 5, 'Infantry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Veteran_Infantry.PNG'),
  ('Aserai Youth', 2, 'Cavalry', 'Factions/Aserai_Sultanate.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Aserai/Aserai_Youth.PNG'),
  ('Marauder', 3, 'Mounted Archer', 'Factions/None.png', 'Bandit', 'None', 'Steppe Bandits', 'Units/Steppe Bandits/Marauder.PNG'),
  ('Raider', 4, 'Mounted Archer', 'Factions/None.png', 'Bandit', 'None', 'Steppe Bandits', 'Units/Steppe Bandits/Raider.PNG'),
  ('Steppe Bandit', 2, 'Cavalry', 'Factions/None.png', 'Bandit', 'None', 'Steppe Bandits', 'Units/Steppe Bandits/Steppe_Bandit.PNG'),
  ('Steppe Bandit Boss', 5, 'Mounted Archer', 'Factions/None.png', 'Bandit', 'None', 'Steppe Bandits', 'Units/Steppe Bandits/Steppe_Bandit_Boss.PNG'),
  ('Sea Raider', 2, 'Infantry', 'Factions/None.png', 'Bandit', 'None', 'Sea Raiders', 'Units/Sea Raider/Sea_Raider.PNG'),
  ('Sea Raider Boss', 5, 'Infantry', 'Factions/None.png', 'Bandit', 'None', 'Sea Raiders', 'Units/Sea Raider/Sea_Raider_Boss.PNG'),
  ('Sea Raider Chief', 4, 'Infantry', 'Factions/None.png', 'Bandit', 'None', 'Sea Raiders', 'Units/Sea Raider/Sea_Raider_Chief.PNG'),
  ('Sea Raider Warrior', 3, 'Infantry', 'Factions/None.png', 'Bandit', 'None', 'Sea Raiders', 'Units/Sea Raider/Sea_Raider_Warrior.PNG'),
  ('Brigand', 3, 'Infantry', 'Factions/None.png', 'Bandit', 'None', 'Mountain Bandits', 'Units/Mountain Bandits/Brigand.PNG'),
  ('Highwayman', 4, 'Cavalry', 'Factions/None.png', 'Bandit', 'None', 'Mountain Bandits', 'Units/Mountain Bandits/Highwayman.PNG'),
  ('Hillman', 2, 'Infantry', 'Factions/None.png', 'Bandit', 'None', 'Mountain Bandits', 'Units/Mountain Bandits/Hillman.PNG'),
  ('Mountain Bandit Boss', 5, 'Infantry', 'Factions/None.png', 'Bandit', 'None', 'Mountain Bandits', 'Units/Mountain Bandits/Mountain_Bandit_Boss.PNG'),
  ('Bushwacker', 2, 'Archer', 'Factions/None.png', 'Bandit', 'None', 'Forest Bandits', 'Units/Forest Bandits/Bushwacker.PNG'),
  ('Forest Bandit', 4, 'Archer', 'Factions/None.png', 'Bandit', 'None', 'Forest Bandits', 'Units/Forest Bandits/Forest_Bandit.PNG'),
  ('Forest Bandit Boss', 5, 'Archer', 'Factions/None.png', 'Bandit', 'None', 'Forest Bandits', 'Units/Forest Bandits/Forest_Bandit_Boss.PNG'),
  ('Freebooter', 3, 'Archer', 'Factions/None.png', 'Bandit', 'None', 'Forest Bandits', 'Units/Forest Bandits/Freebooter.PNG'),
  ('Bedouin Rover', 2, 'Infantry', 'Desert Bandits', 'Bandit', '', '', 'Units/Desert Bandits/Bedouin_Rover.PNG'),
  ('Desert Bandit Boss', 5, 'Cavalry', 'Factions/None.png', 'Bandit', 'None', 'Desert Bandits', 'Units/Desert Bandits/Desert_Bandit_Boss.PNG'),
  ('Harami', 4, 'Cavalry', 'Factions/None.png', 'Bandit', 'None', 'Desert Bandits', 'Units/Desert Bandits/Harami.PNG'),
  ('Nomad Bandit', 3, 'Cavalry', 'Factions/None.png', 'Bandit', 'None', 'Desert Bandits', 'Units/Desert Bandits/Nomad_Bandit.PNG'),
  ('Hired Spear', 3, 'Infantry', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Hired Men/Hired_Spear.PNG'),
  ('Hired Pike', 4, 'Infantry', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Hired Men/Hired_Pike.PNG'),
  ('Hired Elite Pike', 5, 'Infantry', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Hired Men/Hired_Elite_Pike.PNG'),
  ('Hired Crossbow', 4, 'Archer', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Hired Men/Hired_Crossbow.PNG'),
  ('Elite Hired Crossbow', 5, 'Archer', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Hired Men/Elite_Hired_Crossbow.PNG'),
  ('Elite Mercenary Maceman', 5, 'Infantry', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Sellswords/Elite_Mercenary_Maceman.PNG'),
  ('Mercenary Maceman', 4, 'Infantry', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Sellswords/Mercenary_Maceman.PNG'),
  ('Outrider', 4, 'Mounted Archer', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Sellswords/Outrider.PNG'),
  ('Sellsword', 3, 'Infantry', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Sellswords/Sellsword.PNG'),
  ('Veteran Outrider', 5, 'Mounted Archer', 'Factions/None.png', 'Mercenary', 'None', 'None', 'Units/Sellswords/Veteran_Outrider.PNG'),
  ('Gallant Sword Sister', 5, 'Mounted Archer', 'Factions/Calradic_Empire.png', 'Mercenary', 'Calradic Empire', 'Empire', 'Units/Sword Sister/Gallant_Sword_Siter.PNG'),
  ('Sisterhood Follower', 3, 'Archer', 'Factions/Calradic_Empire.png', 'Mercenary', 'Calradic Empire', 'Empire', 'Units/Sword Sister/Sisterhood_Follower.PNG'),
  ('Sword Sister', 4, 'Archer', 'Factions/Calradic_Empire.png', 'Mercenary', 'Calradic Empire', 'Empire', 'Units/Sword Sister/Sword_Sister.PNG'),
  ('Veteran Sword Sister', 5, 'Archer', 'Factions/Calradic_Empire.png', 'Mercenary', 'Calradic Empire', 'Empire', 'Units/Sword Sister/Veteran_Sword_Sister.PNG'),
  ('Beni Zilal Recruit', 2, 'Cavalry', 'Factions/Beni_Zilal.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Beni Zilal/Beni_Zilal_Recruit.png'),
  ('Beni Zilal Soldier', 3, 'Cavalry', 'Factions/Beni_Zilal.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Beni Zilal/Beni_Zilal_Soldier.png'),
  ('Beni Zilal Royal Guard', 4, 'Cavalry', 'Factions/Beni_Zilal.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Beni Zilal/Beni_Zilal_Royal_Guard.png'),
  ('Jawwal Recruit', 2, 'Infantry', 'Factions/Jawwal.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Jawwal/Jawwal_Recruit.png'),
  ('Jawwal Camel Rider', 3, 'Infantry', 'Factions/Jawwal.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Jawwal/Jawwal_Camel_Rider.png'),
  ('Jawwal Bedouin', 4, 'Cavalry', 'Factions/Jawwal.png', 'Soldier', 'Aserai Sultanate', 'Aserai', 'Units/Jawwal/Jawwal_Bedouin.png'),
  ('Koleman', 2, 'Cavalry', 'Factions/Ghilman.png', 'Soldier', 'Aserai Sultanate', 'Darshi', 'Units/Darshi/Koleman.PNG'),
  ('Ghilman', 3, 'Cavalry', 'Factions/Ghilman.png', 'Soldier', 'Aserai Sultanate', 'Darshi', 'Units/Darshi/Ghilman.PNG'),
  ('Ghulam', 4, 'Cavalry', 'Factions/Ghilman.png', 'Soldier', 'Aserai Sultanate', 'Darshi', 'Units/Darshi/Ghulam.PNG'),
  ('Young Wolf', 2, 'Archer', 'Factions/Wolfskins.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Wolfskins/Young_Wolf.png'),
  ('Seasoned Wolf', 3, 'Archer', 'Factions/Wolfskins.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Wolfskins/Seasoned_Wolf.png'),
  ('Chosen Wolf', 4, 'Archer', 'Factions/Wolfskins.png', 'Soldier', 'High Kingdom of the Battanians', 'Battania', 'Units/Wolfskins/Chosen_Wolf.png'),
  ('Karakhergit Nomad', 2, 'Mounted Archer', 'Factions/Karakhergit.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Karakhergit/Karakhergit_Nomad.png'),
  ('Karakhergit Rider', 3, 'Mounted Archer', 'Factions/Karakhergit.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Karakhergit/Karakhergit_Rider.png'),
  ('Karakhergit Elder', 4, 'Mounted Archer', 'Factions/Karakhergit.png', 'Soldier', 'Khuzait Khanate', 'Khuzait', 'Units/Karakhergit/Karakhergit_Elder.png'),
  ('Recruit Forester', 2, 'Archer', 'Factions/Forest_People.png', 'Soldier', 'Principality of Sturgia', 'Vakken', 'Units/Vakken/Recruit_Forester.PNG'),
  ('Expert Forester', 3, 'Archer', 'Factions/Forest_People.png', 'Soldier', 'Principality of Sturgia', 'Vakken', 'Units/Vakken/Expert_Forester.PNG'),
  ('Veteran Forester', 4, 'Archer', 'Factions/Forest_People.png', 'Soldier', 'Principality of Sturgia', 'Vakken', 'Units/Vakken/Veteran_Forester.PNG'),
  ('Lake Rat Recruit', 2, 'Infantry', 'Factions/Lake_Rats.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Lake Rats/Lake_Rat_Recruit.png'),
  ('Lake Rat Veteran', 3, 'Infantry', 'Factions/Lake_Rats.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Lake Rats/Lake_Rat_Veteran.png'),
  ('Lake Rat Wrecker', 4, 'Infantry', 'Factions/Lake_Rats.png', 'Soldier', 'Principality of Sturgia', 'Sturgia', 'Units/Lake Rats/Lake_Rat_Wrecker.png'),
  ('Skolder Recruit', 2, 'Infantry', 'Factions/Skolderbroda.png', 'Soldier', 'Principality of Sturgia', 'Nord', 'Units/Skolderbroda/Skolder_Recruit.png'),
  ('Skolder Warrior Broda', 3, 'Infantry', 'Factions/Skolderbroda.png', 'Soldier', 'Principality of Sturgia', 'Nord', 'Units/Skolderbroda/Skolder_Warrior_Broda.png'),
  ('Skolder Veteran Broda', 4, 'Infantry', 'Factions/Skolderbroda.png', 'Soldier', 'Principality of Sturgia', 'Nord', 'Units/Skolderbroda/Skolder_Veteran_Broda.png'),
  ('Sprout', 2, 'Archer', 'Factions/Brotherhood_of_the_Woods.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Brotherhood of the Woods/Sprout.png'),
  ('Sapling', 3, 'Archer', 'Factions/Brotherhood_of_the_Woods.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Brotherhood of the Woods/Sapling.png'),
  ('Arboreal', 4, 'Archer', 'Factions/Brotherhood_of_the_Woods.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Brotherhood of the Woods/Arboreal.png'),
  ('Boar Novice', 2, 'Archer', 'Factions/Company_of_the_Golden_Boar.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Company of the Golden Boar/Boar_Novice.png'),
  ('Boar Veteran', 3, 'Archer', 'Factions/Company_of_the_Golden_Boar.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Company of the Golden Boar/Boar_Veteran.png'),
  ('Boar Champion', 4, 'Archer', 'Factions/Company_of_the_Golden_Boar.png', 'Soldier', 'Kingdom of Vlandia', 'Vlandia', 'Units/Company of the Golden Boar/Boar_Champion.png'),
  ('Recruit Eleftheroi', 2, 'Cavalry', 'Factions/Eleftheroi.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Eleftheroi/Recruit_Eleftheroi.png'),
  ('Expert Eleftheroi', 3, 'Cavalry', 'Factions/Eleftheroi.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Eleftheroi/Expert_Eleftheroi.png'),
  ('Veteran Eleftheroi', 4, 'Cavalry', 'Factions/Eleftheroi.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Eleftheroi/Veteran_Eleftheroi.png'),
  ('Spark', 2, 'Infantry', 'Factions/Embers_of_the_Flame.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Embers of the Flame/Spark.png'),
  ('Flame', 3, 'Infantry', 'Factions/Embers_of_the_Flame.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Embers of the Flame/Flame.png'),
  ('Blaze', 4, 'Infantry', 'Factions/Embers_of_the_Flame.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Embers of the Flame/Blaze.png'),
  ('Hidden Pawn', 2, 'Infantry', 'Factions/Hidden_Hand.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Hidden Hand/Hidden_Pawn.png'),
  ('Hidden Hand', 3, 'Infantry', 'Factions/Hidden_Hand.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Hidden Hand/Hidden_Hand.png'),
  ('Puppeteer', 4, 'Infantry', 'Factions/Hidden_Hand.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Hidden Hand/Puppeteer.png'),
  ('Hastati', 2, 'Infantry', 'Factions/Legion_of_the_Betrayed.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Legion of the Betrayed/Hastati.png'),
  ('Principes', 3, 'Infantry', 'Factions/Legion_of_the_Betrayed.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Legion of the Betrayed/Principes.png'),
  ('Triarii', 4, 'Infantry', 'Factions/Legion_of_the_Betrayed.png', 'Soldier', 'Calradic Empire', 'Empire', 'Units/Legion of the Betrayed/Triarii.png');


  INSERT INTO map_areas (name, faction, type, coordinates) VALUES
  ('Ain Baliq Castle', 'Aserai', 'Castle', '[385,800]'::jsonb),
  ('Barihal Castle', 'Aserai', 'Castle', '[405,851]'::jsonb),
  ('Jamayeh Castle', 'Aserai', 'Castle', '[440,857]'::jsonb),
  ('Medeni Castle', 'Aserai', 'Castle', '[269,558]'::jsonb),
  ('Sahel Castle', 'Aserai', 'Castle', '[578,327]'::jsonb),
  ('Shibal Zumr Castle', 'Aserai', 'Castle', '[185,317]'::jsonb),
  ('Tamnuh Castle', 'Aserai', 'Castle', '[344,418]'::jsonb),
  ('Tubilis Castle', 'Aserai', 'Castle', '[548,460]'::jsonb),
  ('Uqba Castle', 'Aserai', 'Castle', '[165,109]'::jsonb),
  ('Ab Comer Castle', 'Battania', 'Castle', '[507,787]'::jsonb),
  ('Aster Castle', 'Battania', 'Castle', '[482,393]'::jsonb),
  ('Druimmor Castle', 'Battania', 'Castle', '[793,760]'::jsonb),
  ('Flintolg Castle', 'Battania', 'Castle', '[701,577]'::jsonb),
  ('Llanoc Hen Castle', 'Battania', 'Castle', '[767,594]'::jsonb),
  ('Pendraic Castle', 'Battania', 'Castle', '[412,827]'::jsonb),
  ('Rhemtoil Castle', 'Battania', 'Castle', '[859,350]'::jsonb),
  ('Uthelaim Castle', 'Battania', 'Castle', '[815,284]'::jsonb),
  ('Akiser Castle', 'Khuzait', 'Castle', '[339,427]'::jsonb),
  ('Dinar Castle', 'Khuzait', 'Castle', '[760,325]'::jsonb),
  ('Erzenur Castle', 'Khuzait', 'Castle', '[776,507]'::jsonb),
  ('Hakkun Castle', 'Khuzait', 'Castle', '[648,790]'::jsonb),
  ('Kaysar Castle', 'Khuzait', 'Castle', '[544,721]'::jsonb),
  ('Khimli Castle', 'Khuzait', 'Castle', '[677,294]'::jsonb),
  ('Simira Castle', 'Khuzait', 'Castle', '[816,352]'::jsonb),
  ('Tepes Castle', 'Khuzait', 'Castle', '[830,791]'::jsonb),
  ('Usek Castle', 'Khuzait', 'Castle', '[567,199]'::jsonb),
  ('Mazhadan Castle', 'Sturgia', 'Castle', '[821,537]'::jsonb),
  ('Kranirog Castle', 'Sturgia', 'Castle', '[253,669]'::jsonb),
  ('Nevyansk Castle', 'Sturgia', 'Castle', '[711,827]'::jsonb),
  ('Ov Castle', 'Sturgia', 'Castle', '[590,866]'::jsonb),
  ('Takor Castle', 'Sturgia', 'Castle', '[447,114]'::jsonb),
  ('Urikskala Castle', 'Sturgia', 'Castle', '[192,611]'::jsonb),
  ('Ustokol Castle', 'Sturgia', 'Castle', '[474,511]'::jsonb),
  ('Vladiv Castle', 'Sturgia', 'Castle', '[156,823]'::jsonb),
  ('Caleus Castle', 'Vlandia', 'Castle', '[854,724]'::jsonb),
  ('Drapand Castle', 'Vlandia', 'Castle', '[141,737]'::jsonb),
  ('Hongard Castle', 'Vlandia', 'Castle', '[464,735]'::jsonb),
  ('Ormanfard Castle', 'Vlandia', 'Castle', '[603,766]'::jsonb),
  ('Talivel Castle', 'Vlandia', 'Castle', '[244,358]'::jsonb),
  ('Tirby Castle', 'Vlandia', 'Castle', '[171,755]'::jsonb),
  ('Usanc Castle', 'Vlandia', 'Castle', '[851,348]'::jsonb),
  ('Verecsand Castle', 'Vlandia', 'Castle', '[308,760]'::jsonb),
  ('Ataconia Castle', 'Northern Empire', 'Castle', '[631,822]'::jsonb),
  ('Atriom Castle', 'Northern Empire', 'Castle', '[140,705]'::jsonb),
  ('Gaos Castle', 'Northern Empire', 'Castle', '[292,562]'::jsonb),
  ('Epinosa Castle', 'Northern Empire', 'Castle', '[268,485]'::jsonb),
  ('Lochana Castle', 'Northern Empire', 'Castle', '[626,472]'::jsonb),
  ('Mecalovea Castle', 'Northern Empire', 'Castle', '[597,358]'::jsonb),
  ('Rhesos Castle', 'Northern Empire', 'Castle', '[439,848]'::jsonb),
  ('Syratos Castle', 'Northern Empire', 'Castle', '[397,366]'::jsonb),
  ('Varagos Castle', 'Northern Empire', 'Castle', '[594,470]'::jsonb),
  ('Chanopsis Castle', 'Southern Empire', 'Castle', '[474,380]'::jsonb),
  ('Corenia Castle', 'Southern Empire', 'Castle', '[203,591]'::jsonb),
  ('Jogurys Castle', 'Southern Empire', 'Castle', '[213,667]'::jsonb),
  ('Lavenia Castle', 'Southern Empire', 'Castle', '[526,696]'::jsonb),
  ('Melion Castle', 'Southern Empire', 'Castle', '[515,112]'::jsonb),
  ('Morenia Castle', 'Southern Empire', 'Castle', '[537,605]'::jsonb),
  ('Odrysa Castle', 'Southern Empire', 'Castle', '[353,303]'::jsonb),
  ('Sestadaim Castle', 'Southern Empire', 'Castle', '[633,898]'::jsonb),
  ('Garontor Castle', 'Western Empire', 'Castle', '[470,573]'::jsonb),
  ('Gersegos Castle', 'Western Empire', 'Castle', '[565,414]'::jsonb),
  ('Hertogea Castle', 'Western Empire', 'Castle', '[622,235]'::jsonb),
  ('Onica Castle', 'Western Empire', 'Castle', '[320,251]'::jsonb),
  ('Oristocorys Castle', 'Western Empire', 'Castle', '[842,824]'::jsonb),
  ('Thorios Castle', 'Western Empire', 'Castle', '[637,682]'::jsonb),
  ('Thractorae Castle', 'Western Empire', 'Castle', '[825,264]'::jsonb),
  ('Veron Castle', 'Western Empire', 'Castle', '[620,566]'::jsonb),
  ('Askar', 'Aserai', 'Town', '[592,829]'::jsonb),
  ('Hubyar', 'Aserai', 'Town', '[493,102]'::jsonb),
  ('Husn Fulq', 'Aserai', 'Town', '[470,445]'::jsonb),
  ('Iyakis', 'Aserai', 'Town', '[453,258]'::jsonb),
  ('Qasira', 'Aserai', 'Town', '[537,722]'::jsonb),
  ('Quyaz', 'Aserai', 'Town', '[425,242]'::jsonb),
  ('Razih', 'Aserai', 'Town', '[733,452]'::jsonb),
  ('Sanala', 'Aserai', 'Town', '[487,336]'::jsonb),
  ('Car Banseth', 'Battania', 'Town', '[282,635]'::jsonb),
  ('Dunglanys', 'Battania', 'Town', '[369,499]'::jsonb),
  ('Marunath', 'Battania', 'Town', '[483,228]'::jsonb),
  ('Pen Cannoc', 'Battania', 'Town', '[705,873]'::jsonb),
  ('Seonon', 'Battania', 'Town', '[711,502]'::jsonb),
  ('Akkalat', 'Khuzait', 'Town', '[217,354]'::jsonb),
  ('Baltakhand', 'Khuzait', 'Town', '[603,191]'::jsonb),
  ('Chaikand', 'Khuzait', 'Town', '[753,579]'::jsonb),
  ('Makeb', 'Khuzait', 'Town', '[406,137]'::jsonb),
  ('Odokh', 'Khuzait', 'Town', '[707,819]'::jsonb),
  ('Ortongard', 'Khuzait', 'Town', '[395,404]'::jsonb),
  ('Balgard', 'Sturgia', 'Town', '[837,189]'::jsonb),
  ('Omor', 'Sturgia', 'Town', '[554,714]'::jsonb),
  ('Revyl', 'Sturgia', 'Town', '[862,379]'::jsonb),
  ('Sibir', 'Sturgia', 'Town', '[472,461]'::jsonb),
  ('Tyal', 'Sturgia', 'Town', '[258,404]'::jsonb),
  ('Varcheg', 'Sturgia', 'Town', '[614,253]'::jsonb),
  ('Varnovapol', 'Sturgia', 'Town', '[651,483]'::jsonb),
  ('Charas', 'Vlandia', 'Town', '[257,670]'::jsonb),
  ('Galend', 'Vlandia', 'Town', '[350,807]'::jsonb),
  ('Jaculan', 'Vlandia', 'Town', '[310,302]'::jsonb),
  ('Ocs Hall', 'Vlandia', 'Town', '[413,455]'::jsonb),
  ('Ostican', 'Vlandia', 'Town', '[693,730]'::jsonb),
  ('Pravend', 'Vlandia', 'Town', '[573,462]'::jsonb),
  ('Rovalt', 'Vlandia', 'Town', '[229,484]'::jsonb),
  ('Sargot', 'Vlandia', 'Town', '[743,776]'::jsonb),
  ('Amprela', 'Northern Empire', 'Town', '[520,496]'::jsonb),
  ('Argoron', 'Northern Empire', 'Town', '[563,362]'::jsonb),
  ('Diathma', 'Northern Empire', 'Town', '[130,120]'::jsonb),
  ('Epicrotea', 'Northern Empire', 'Town', '[555,525]'::jsonb),
  ('Myzea', 'Northern Empire', 'Town', '[618,767]'::jsonb),
  ('Saneopa', 'Northern Empire', 'Town', '[427,636]'::jsonb),
  ('Danustica', 'Southern Empire', 'Town', '[468,544]'::jsonb),
  ('Lycaron', 'Southern Empire', 'Town', '[381,604]'::jsonb),
  ('Onira', 'Southern Empire', 'Town', '[189,386]'::jsonb),
  ('Phycaon', 'Southern Empire', 'Town', '[891,405]'::jsonb),
  ('Poros', 'Southern Empire', 'Town', '[138,302]'::jsonb),
  ('Syronea', 'Southern Empire', 'Town', '[619,714]'::jsonb),
  ('Vostrum', 'Southern Empire', 'Town', '[356,432]'::jsonb),
  ('Amitatys', 'Western Empire', 'Town', '[564,813]'::jsonb),
  ('Jalmarys', 'Western Empire', 'Town', '[200,479]'::jsonb),
  ('Lageta', 'Western Empire', 'Town', '[716,427]'::jsonb),
  ('Ortysia', 'Western Empire', 'Town', '[558,118]'::jsonb),
  ('Rhotae', 'Western Empire', 'Town', '[797,783]'::jsonb),
  ('Zeonica', 'Western Empire', 'Town', '[720,662]'::jsonb),
  ('Abba', 'Aserai', 'Village', '[514,795]'::jsonb),
  ('Abghan', 'Aserai', 'Village', '[690,161]'::jsonb),
  ('Abu Khih', 'Aserai', 'Village', '[752,516]'::jsonb),
  ('Ain Baliq', 'Aserai', 'Village', '[295,188]'::jsonb),
  ('Asmait', 'Aserai', 'Village', '[347,338]'::jsonb),
  ('Barihal', 'Aserai', 'Village', '[354,710]'::jsonb),
  ('Baq', 'Aserai', 'Village', '[579,848]'::jsonb),
  ('Bir Seif', 'Aserai', 'Village', '[201,723]'::jsonb),
  ('Bunqaz', 'Aserai', 'Village', '[885,795]'::jsonb),
  ('Ezbet Nahul', 'Aserai', 'Village', '[757,428]'::jsonb),
  ('Fanab', 'Aserai', 'Village', '[322,823]'::jsonb),
  ('Hamoshawat', 'Aserai', 'Village', '[767,490]'::jsonb),
  ('Hiblet', 'Aserai', 'Village', '[226,293]'::jsonb),
  ('Hoqqa', 'Aserai', 'Village', '[324,724]'::jsonb),
  ('Jahasim', 'Aserai', 'Village', '[789,163]'::jsonb),
  ('Kuqa', 'Aserai', 'Village', '[427,737]'::jsonb),
  ('Lamesa', 'Aserai', 'Village', '[400,185]'::jsonb),
  ('Mabwaz', 'Aserai', 'Village', '[457,308]'::jsonb),
  ('Medeni', 'Aserai', 'Village', '[418,242]'::jsonb),
  ('Mijayit', 'Aserai', 'Village', '[578,445]'::jsonb),
  ('Mussum', 'Aserai', 'Village', '[367,312]'::jsonb),
  ('Nahlan', 'Aserai', 'Village', '[266,129]'::jsonb),
  ('Qablab', 'Aserai', 'Village', '[710,301]'::jsonb),
  ('Qidnar', 'Aserai', 'Village', '[669,250]'::jsonb),
  ('Sahel', 'Aserai', 'Village', '[374,756]'::jsonb),
  ('Shibal Zumr', 'Aserai', 'Village', '[452,586]'::jsonb),
  ('Tamnuh', 'Aserai', 'Village', '[577,783]'::jsonb),
  ('Tasheba', 'Aserai', 'Village', '[417,214]'::jsonb),
  ('Tubilis', 'Aserai', 'Village', '[726,710]'::jsonb),
  ('Uqba', 'Aserai', 'Village', '[881,589]'::jsonb),
  ('Wadar', 'Aserai', 'Village', '[836,537]'::jsonb),
  ('Zalm', 'Aserai', 'Village', '[266,496]'::jsonb),
  ('Ab Comer', 'Battania', 'Village', '[132,467]'::jsonb),
  ('Andurn', 'Battania', 'Village', '[223,700]'::jsonb),
  ('Aster', 'Battania', 'Village', '[260,867]'::jsonb),
  ('Ath Cafal', 'Battania', 'Village', '[668,611]'::jsonb),
  ('Beglomuar', 'Battania', 'Village', '[459,278]'::jsonb),
  ('Bog Beth', 'Battania', 'Village', '[437,704]'::jsonb),
  ('Bryn Glas', 'Battania', 'Village', '[211,530]'::jsonb),
  ('Cantrec', 'Battania', 'Village', '[669,608]'::jsonb),
  ('Claig Ban', 'Battania', 'Village', '[432,855]'::jsonb),
  ('Dalmengus', 'Battania', 'Village', '[345,886]'::jsonb),
  ('Diantogmail', 'Battania', 'Village', '[395,455]'::jsonb),
  ('Druimmor', 'Battania', 'Village', '[350,274]'::jsonb),
  ('Durn', 'Battania', 'Village', '[720,875]'::jsonb),
  ('Ebereth', 'Battania', 'Village', '[669,777]'::jsonb),
  ('Fenon Etir', 'Battania', 'Village', '[775,715]'::jsonb),
  ('Flintolg', 'Battania', 'Village', '[340,828]'::jsonb),
  ('Gainseth', 'Battania', 'Village', '[797,817]'::jsonb),
  ('Geunat Nal', 'Battania', 'Village', '[104,644]'::jsonb),
  ('Glenlithrig', 'Battania', 'Village', '[549,711]'::jsonb),
  ('Glintor', 'Battania', 'Village', '[899,364]'::jsonb),
  ('Imlagh', 'Battania', 'Village', '[285,138]'::jsonb),
  ('Inveth', 'Battania', 'Village', '[354,615]'::jsonb),
  ('Lindorn', 'Battania', 'Village', '[773,626]'::jsonb),
  ('Llanoc Hen', 'Battania', 'Village', '[788,529]'::jsonb),
  ('Mag Arba', 'Battania', 'Village', '[755,172]'::jsonb),
  ('Morihig', 'Battania', 'Village', '[601,281]'::jsonb),
  ('Pendraic', 'Battania', 'Village', '[628,435]'::jsonb),
  ('Rhemtoil', 'Battania', 'Village', '[750,769]'::jsonb),
  ('Seordas', 'Battania', 'Village', '[597,401]'::jsonb),
  ('Swenryn', 'Battania', 'Village', '[107,539]'::jsonb),
  ('Tor Leiad', 'Battania', 'Village', '[815,109]'::jsonb),
  ('Tor Melina', 'Battania', 'Village', '[874,494]'::jsonb),
  ('Uthelaim', 'Battania', 'Village', '[352,550]'::jsonb),
  ('Akiser', 'Khuzait', 'Village', '[312,409]'::jsonb),
  ('Asalig', 'Khuzait', 'Village', '[137,838]'::jsonb),
  ('Danara', 'Khuzait', 'Village', '[838,830]'::jsonb),
  ('Dinar', 'Khuzait', 'Village', '[411,416]'::jsonb),
  ('Erzenur', 'Khuzait', 'Village', '[212,552]'::jsonb),
  ('Esme', 'Khuzait', 'Village', '[719,691]'::jsonb),
  ('Fisnar', 'Khuzait', 'Village', '[781,803]'::jsonb),
  ('Gereden', 'Khuzait', 'Village', '[522,155]'::jsonb),
  ('Hakkun', 'Khuzait', 'Village', '[332,396]'::jsonb),
  ('Hanekhy', 'Khuzait', 'Village', '[813,773]'::jsonb),
  ('Ispantar', 'Khuzait', 'Village', '[782,483]'::jsonb),
  ('Kamshar', 'Khuzait', 'Village', '[768,346]'::jsonb),
  ('Karahalli', 'Khuzait', 'Village', '[491,265]'::jsonb),
  ('Karahan', 'Khuzait', 'Village', '[484,606]'::jsonb),
  ('Karakalat', 'Khuzait', 'Village', '[693,421]'::jsonb),
  ('Kaysar', 'Khuzait', 'Village', '[116,109]'::jsonb),
  ('Khimli', 'Khuzait', 'Village', '[659,856]'::jsonb),
  ('Kiraz', 'Khuzait', 'Village', '[663,341]'::jsonb),
  ('Kohi Ajik', 'Khuzait', 'Village', '[543,463]'::jsonb),
  ('Kuruluk', 'Khuzait', 'Village', '[673,317]'::jsonb),
  ('Mazen', 'Khuzait', 'Village', '[406,557]'::jsonb),
  ('Mivanjan', 'Khuzait', 'Village', '[388,125]'::jsonb),
  ('Nutyuk', 'Khuzait', 'Village', '[571,686]'::jsonb),
  ('Okhutan', 'Khuzait', 'Village', '[653,585]'::jsonb),
  ('Omrotok', 'Khuzait', 'Village', '[792,606]'::jsonb),
  ('Pabastan', 'Khuzait', 'Village', '[266,611]'::jsonb),
  ('Payam', 'Khuzait', 'Village', '[312,183]'::jsonb),
  ('Ransam', 'Khuzait', 'Village', '[441,416]'::jsonb),
  ('Shapeshte', 'Khuzait', 'Village', '[682,315]'::jsonb),
  ('Simira', 'Khuzait', 'Village', '[759,546]'::jsonb),
  ('Tepes', 'Khuzait', 'Village', '[378,852]'::jsonb),
  ('Tismil', 'Khuzait', 'Village', '[211,217]'::jsonb),
  ('Ulaan', 'Khuzait', 'Village', '[841,148]'::jsonb),
  ('Urunjan', 'Khuzait', 'Village', '[506,656]'::jsonb),
  ('Usek', 'Khuzait', 'Village', '[764,788]'::jsonb),
  ('Alebat', 'Sturgia', 'Village', '[302,439]'::jsonb),
  ('Alov', 'Sturgia', 'Village', '[767,570]'::jsonb),
  ('Borchovagorka', 'Sturgia', 'Village', '[875,583]'::jsonb),
  ('Bukits', 'Sturgia', 'Village', '[867,218]'::jsonb),
  ('Chornobas', 'Sturgia', 'Village', '[440,458]'::jsonb),
  ('Dnin', 'Sturgia', 'Village', '[742,765]'::jsonb),
  ('Dvorusta', 'Sturgia', 'Village', '[180,128]'::jsonb),
  ('Ferkh', 'Sturgia', 'Village', '[182,246]'::jsonb),
  ('Forin', 'Sturgia', 'Village', '[253,442]'::jsonb),
  ('Glavstrom', 'Sturgia', 'Village', '[270,442]'::jsonb),
  ('Ismilkorg', 'Sturgia', 'Village', '[282,175]'::jsonb),
  ('Karbur', 'Sturgia', 'Village', '[268,366]'::jsonb),
  ('Kargrev', 'Sturgia', 'Village', '[230,768]'::jsonb),
  ('Korsyas', 'Sturgia', 'Village', '[334,468]'::jsonb),
  ('Kranirog', 'Sturgia', 'Village', '[111,496]'::jsonb),
  ('Kvol', 'Sturgia', 'Village', '[611,351]'::jsonb),
  ('Mazhadan', 'Sturgia', 'Village', '[775,733]'::jsonb),
  ('Nevyansk', 'Sturgia', 'Village', '[513,180]'::jsonb),
  ('Omkany', 'Sturgia', 'Village', '[718,628]'::jsonb),
  ('Ov', 'Sturgia', 'Village', '[158,589]'::jsonb),
  ('Radakmed', 'Sturgia', 'Village', '[578,613]'::jsonb),
  ('Rodobas', 'Sturgia', 'Village', '[769,573]'::jsonb),
  ('Safna', 'Sturgia', 'Village', '[282,284]'::jsonb),
  ('Skorin', 'Sturgia', 'Village', '[518,546]'::jsonb),
  ('Takor', 'Sturgia', 'Village', '[356,188]'::jsonb),
  ('Urikskala', 'Sturgia', 'Village', '[469,663]'::jsonb),
  ('Ustokol', 'Sturgia', 'Village', '[372,164]'::jsonb),
  ('Visibrot', 'Sturgia', 'Village', '[143,562]'::jsonb),
  ('Vladiv', 'Sturgia', 'Village', '[231,278]'::jsonb),
  ('Yangutum', 'Sturgia', 'Village', '[407,828]'::jsonb),
  ('Zhemyan', 'Sturgia', 'Village', '[265,482]'::jsonb),
  ('Alantas', 'Vlandia', 'Village', '[783,537]'::jsonb),
  ('Alorstan', 'Vlandia', 'Village', '[738,452]'::jsonb),
  ('Arromanc', 'Vlandia', 'Village', '[118,370]'::jsonb),
  ('Caleus', 'Vlandia', 'Village', '[124,775]'::jsonb),
  ('Calioc', 'Vlandia', 'Village', '[898,213]'::jsonb),
  ('Cananc', 'Vlandia', 'Village', '[631,656]'::jsonb),
  ('Chornad', 'Vlandia', 'Village', '[210,702]'::jsonb),
  ('Drapand', 'Vlandia', 'Village', '[749,583]'::jsonb),
  ('Deriat', 'Vlandia', 'Village', '[366,276]'::jsonb),
  ('Etirburg', 'Vlandia', 'Village', '[616,500]'::jsonb),
  ('Ferton', 'Vlandia', 'Village', '[694,788]'::jsonb),
  ('Fregian', 'Vlandia', 'Village', '[245,845]'::jsonb),
  ('Furbec', 'Vlandia', 'Village', '[491,384]'::jsonb),
  ('Halisvust', 'Vlandia', 'Village', '[578,350]'::jsonb),
  ('Hongard', 'Vlandia', 'Village', '[232,714]'::jsonb),
  ('Horsger', 'Vlandia', 'Village', '[546,293]'::jsonb),
  ('Larnac', 'Vlandia', 'Village', '[625,855]'::jsonb),
  ('Mareiven', 'Vlandia', 'Village', '[337,778]'::jsonb),
  ('Marin', 'Vlandia', 'Village', '[106,175]'::jsonb),
  ('Mot', 'Vlandia', 'Village', '[428,589]'::jsonb),
  ('Ormanfard', 'Vlandia', 'Village', '[506,465]'::jsonb),
  ('Oritan', 'Vlandia', 'Village', '[301,219]'::jsonb),
  ('Palisont', 'Vlandia', 'Village', '[865,843]'::jsonb),
  ('Rodetan', 'Vlandia', 'Village', '[157,141]'::jsonb),
  ('Rulund', 'Vlandia', 'Village', '[675,396]'::jsonb),
  ('Savinth', 'Vlandia', 'Village', '[852,250]'::jsonb),
  ('Sirindac', 'Vlandia', 'Village', '[781,501]'::jsonb),
  ('Talivel', 'Vlandia', 'Village', '[351,340]'::jsonb),
  ('Tirby', 'Vlandia', 'Village', '[249,434]'::jsonb),
  ('Usanc', 'Vlandia', 'Village', '[630,257]'::jsonb),
  ('Valanby', 'Vlandia', 'Village', '[437,654]'::jsonb),
  ('Verecsand', 'Vlandia', 'Village', '[391,444]'::jsonb),
  ('Vesin', 'Vlandia', 'Village', '[499,360]'::jsonb),
  ('Aeoria', 'Northern Empire', 'Village', '[183,864]'::jsonb),
  ('Agalmon', 'Northern Empire', 'Village', '[303,882]'::jsonb),
  ('Alatys', 'Northern Empire', 'Village', '[440,258]'::jsonb),
  ('Alosea', 'Northern Empire', 'Village', '[677,815]'::jsonb),
  ('Ataconia', 'Northern Empire', 'Village', '[787,886]'::jsonb),
  ('Atrion', 'Northern Empire', 'Village', '[224,623]'::jsonb),
  ('Avasinton', 'Northern Empire', 'Village', '[346,198]'::jsonb),
  ('Boreagora', 'Northern Empire', 'Village', '[775,365]'::jsonb),
  ('Crios', 'Northern Empire', 'Village', '[331,250]'::jsonb),
  ('Dyopalis', 'Northern Empire', 'Village', '[379,565]'::jsonb),
  ('Epinosa', 'Northern Empire', 'Village', '[657,239]'::jsonb),
  ('Enoisa', 'Northern Empire', 'Village', '[509,364]'::jsonb),
  ('Gaos', 'Northern Empire', 'Village', '[807,178]'::jsonb),
  ('Gymos', 'Northern Empire', 'Village', '[899,727]'::jsonb),
  ('Hetania', 'Northern Empire', 'Village', '[301,896]'::jsonb),
  ('Jeracos', 'Northern Empire', 'Village', '[151,214]'::jsonb),
  ('Lochana', 'Northern Empire', 'Village', '[180,316]'::jsonb),
  ('Marathea', 'Northern Empire', 'Village', '[733,629]'::jsonb),
  ('Masangara', 'Northern Empire', 'Village', '[297,396]'::jsonb),
  ('Mecalovea', 'Northern Empire', 'Village', '[599,753]'::jsonb),
  ('Nortanisa', 'Northern Empire', 'Village', '[739,629]'::jsonb),
  ('Orthra', 'Northern Empire', 'Village', '[502,468]'::jsonb),
  ('Pons', 'Northern Empire', 'Village', '[857,292]'::jsonb),
  ('Potamis', 'Northern Empire', 'Village', '[117,419]'::jsonb),
  ('Rhesos', 'Northern Empire', 'Village', '[231,637]'::jsonb),
  ('Samatha', 'Northern Empire', 'Village', '[212,564]'::jsonb),
  ('Stathymos', 'Northern Empire', 'Village', '[263,688]'::jsonb),
  ('Syratos', 'Northern Empire', 'Village', '[151,743]'::jsonb),
  ('Tememos', 'Northern Empire', 'Village', '[664,813]'::jsonb),
  ('Themys', 'Northern Empire', 'Village', '[255,285]'::jsonb),
  ('Varagos', 'Northern Empire', 'Village', '[347,222]'::jsonb),
  ('Vealos', 'Northern Empire', 'Village', '[858,814]'::jsonb),
  ('Alision', 'Southern Empire', 'Village', '[243,378]'::jsonb),
  ('Amycon', 'Southern Empire', 'Village', '[161,748]'::jsonb),
  ('Atphynia', 'Southern Empire', 'Village', '[565,540]'::jsonb),
  ('Avalyps', 'Southern Empire', 'Village', '[126,507]'::jsonb),
  ('Caira', 'Southern Empire', 'Village', '[635,884]'::jsonb),
  ('Canoros', 'Southern Empire', 'Village', '[165,612]'::jsonb),
  ('Canterion', 'Southern Empire', 'Village', '[794,135]'::jsonb),
  ('Chanopsis', 'Southern Empire', 'Village', '[352,427]'::jsonb),
  ('Corenia', 'Southern Empire', 'Village', '[379,204]'::jsonb),
  ('Erebulos', 'Southern Empire', 'Village', '[516,285]'::jsonb),
  ('Ethemisa', 'Southern Empire', 'Village', '[671,656]'::jsonb),
  ('Eunalica', 'Southern Empire', 'Village', '[238,582]'::jsonb),
  ('Gorcorys', 'Southern Empire', 'Village', '[812,332]'::jsonb),
  ('Jogurys', 'Southern Empire', 'Village', '[502,250]'::jsonb),
  ('Lanthas', 'Southern Empire', 'Village', '[615,584]'::jsonb),
  ('Lartusys', 'Southern Empire', 'Village', '[160,167]'::jsonb),
  ('Melion', 'Southern Empire', 'Village', '[864,736]'::jsonb),
  ('Metachia', 'Southern Empire', 'Village', '[695,729]'::jsonb),
  ('Morenia', 'Southern Empire', 'Village', '[187,139]'::jsonb),
  ('Odrysa', 'Southern Empire', 'Village', '[638,866]'::jsonb),
  ('Parasemnos', 'Southern Empire', 'Village', '[219,385]'::jsonb),
  ('Polisia', 'Southern Empire', 'Village', '[784,705]'::jsonb),
  ('Popsia', 'Southern Empire', 'Village', '[714,242]'::jsonb),
  ('Psotai', 'Southern Empire', 'Village', '[139,656]'::jsonb),
  ('Sagolina', 'Southern Empire', 'Village', '[102,831]'::jsonb),
  ('Sagora', 'Southern Empire', 'Village', '[490,699]'::jsonb),
  ('Saldannis', 'Southern Empire', 'Village', '[585,276]'::jsonb),
  ('Sestadaim', 'Southern Empire', 'Village', '[770,327]'::jsonb),
  ('Spotia', 'Southern Empire', 'Village', '[288,826]'::jsonb),
  ('Tegresos', 'Southern Empire', 'Village', '[428,355]'::jsonb),
  ('Tevea', 'Southern Empire', 'Village', '[185,859]'::jsonb),
  ('Vargonis', 'Southern Empire', 'Village', '[722,643]'::jsonb),
  ('Zestea', 'Southern Empire', 'Village', '[279,423]'::jsonb),
  ('Aegosca', 'Western Empire', 'Village', '[188,101]'::jsonb),
  ('Alsasos', 'Western Empire', 'Village', '[680,102]'::jsonb),
  ('Arpotis', 'Western Empire', 'Village', '[575,638]'::jsonb),
  ('Bergum', 'Western Empire', 'Village', '[124,249]'::jsonb),
  ('Carphenion', 'Western Empire', 'Village', '[789,515]'::jsonb),
  ('Dradios', 'Western Empire', 'Village', '[511,765]'::jsonb),
  ('Elipa', 'Western Empire', 'Village', '[279,730]'::jsonb),
  ('Elvania', 'Western Empire', 'Village', '[158,633]'::jsonb),
  ('Gamardan', 'Western Empire', 'Village', '[650,600]'::jsonb),
  ('Garontor', 'Western Empire', 'Village', '[483,213]'::jsonb),
  ('Gersegos', 'Western Empire', 'Village', '[878,625]'::jsonb),
  ('Goleryn', 'Western Empire', 'Village', '[627,846]'::jsonb),
  ('Garengolia', 'Western Empire', 'Village', '[600,337]'::jsonb),
  ('Hertogea', 'Western Empire', 'Village', '[560,116]'::jsonb),
  ('Leblenion', 'Western Empire', 'Village', '[716,503]'::jsonb),
  ('Lysia', 'Western Empire', 'Village', '[506,303]'::jsonb),
  ('Montos', 'Western Empire', 'Village', '[736,331]'::jsonb),
  ('Neocorys', 'Western Empire', 'Village', '[149,725]'::jsonb),
  ('Nideon', 'Western Empire', 'Village', '[174,390]'::jsonb),
  ('Onica', 'Western Empire', 'Village', '[509,269]'::jsonb),
  ('Oristocorys', 'Western Empire', 'Village', '[257,341]'::jsonb),
  ('Phasos', 'Western Empire', 'Village', '[589,459]'::jsonb),
  ('Primessos', 'Western Empire', 'Village', '[622,743]'::jsonb),
  ('Tarcutis', 'Western Empire', 'Village', '[859,391]'::jsonb),
  ('Thersenion', 'Western Empire', 'Village', '[569,546]'::jsonb),
  ('Thorios', 'Western Empire', 'Village', '[392,560]'::jsonb),
  ('Thractorae', 'Western Empire', 'Village', '[451,755]'::jsonb),
  ('Vathea', 'Western Empire', 'Village', '[282,139]'::jsonb),
  ('Veron', 'Western Empire', 'Village', '[161,234]'::jsonb),
  ('Vinela', 'Western Empire', 'Village', '[495,887]'::jsonb),
  ('Zeocorys', 'Western Empire', 'Village', '[650,755]'::jsonb);
