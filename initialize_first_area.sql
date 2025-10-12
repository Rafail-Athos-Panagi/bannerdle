-- Initialize First Map Area Selection
-- This script initializes the first map area for the daily map area guessing game
-- Run this after setting up the database schema

-- Insert the first map area into used_map_areas table with all attributes
-- Using "Ain Baliq Castle" as the first map area (first entry in map_areas.json)
INSERT INTO used_map_areas (
  name,
  faction,
  type,
  coordinates,
  used_date
) VALUES (
  'Ain Baliq Castle',
  'Aserai',
  'Castle',
  '[385, 800]'::jsonb,
  NOW()
);

-- Verify the initialization
SELECT 
  'Used Map Areas:' as info,
  name,
  faction,
  type,
  coordinates,
  used_date
FROM used_map_areas
ORDER BY used_date DESC;
