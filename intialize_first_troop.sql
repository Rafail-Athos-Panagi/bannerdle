-- Initialize First Troop Selection
-- This script initializes the first troop for the daily troop guessing game
-- Run this after setting up the database schema

-- Insert the first troop into used_troops table with all attributes
-- Using "Vlandian Sergeant" as the first troop (first entry in Troops.json)
INSERT INTO used_troops (
  name,
  tier,
  type,
  occupation,
  faction,
  banner,
  culture,
  image,
  used_date
) VALUES (
  'Vlandian Sergeant',
  2,
  'Infantry',
  'Soldier',
  'Vlandia',
  'Vlandia',
  'Vlandian',
  'Units/Vlandia/Vlandian_Sergeant.PNG',
  NOW()
);

-- Verify the initialization
SELECT 
  'Used Troops:' as info,
  name,
  tier,
  type,
  occupation,
  faction,
  banner,
  culture,
  image,
  used_date
FROM used_troops
ORDER BY used_date DESC;
